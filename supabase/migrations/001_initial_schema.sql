-- Countries
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  iso_code TEXT NOT NULL UNIQUE,
  is_region BOOLEAN DEFAULT false,
  flag_emoji TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Packages
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_tr TEXT DEFAULT '',
  data_amount TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price_tr NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '{}',
  operator_name TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  package_id UUID NOT NULL REFERENCES packages(id),
  qr_code_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'sent', 'problematic')),
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- QR Codes
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'problematic')),
  order_id UUID REFERENCES orders(id),
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK from orders to qr_codes
ALTER TABLE orders ADD CONSTRAINT orders_qr_code_id_fkey FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id);

-- Email Logs
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Profiles
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_packages_country ON packages(country_id);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_qr_codes_package ON qr_codes(package_id);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_email_logs_order ON email_logs(order_id);

-- Auto order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM orders
  WHERE order_number LIKE 'ESM-' || today_str || '-%';

  NEW.order_number := 'ESM-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Auto updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_packages
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Stock summary view
CREATE OR REPLACE VIEW stock_summary AS
SELECT
  p.id AS package_id,
  p.name AS package_name,
  c.name_tr AS country_name,
  c.flag_emoji,
  COUNT(*) FILTER (WHERE q.status = 'available') AS available,
  COUNT(*) FILTER (WHERE q.status = 'assigned') AS assigned,
  COUNT(*) FILTER (WHERE q.status = 'problematic') AS problematic,
  COUNT(*) AS total
FROM packages p
JOIN countries c ON c.id = p.country_id
LEFT JOIN qr_codes q ON q.package_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.name, c.name_tr, c.flag_emoji;

-- Atomic QR assignment function (race-condition safe)
CREATE OR REPLACE FUNCTION assign_qr_to_order(p_package_id UUID, p_order_id UUID)
RETURNS UUID AS $$
DECLARE
  v_qr_id UUID;
BEGIN
  SELECT id INTO v_qr_id
  FROM qr_codes
  WHERE package_id = p_package_id AND status = 'available'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_qr_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE qr_codes
  SET status = 'assigned', order_id = p_order_id, assigned_at = now()
  WHERE id = v_qr_id;

  UPDATE orders
  SET qr_code_id = v_qr_id
  WHERE id = p_order_id;

  RETURN v_qr_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for countries and packages
CREATE POLICY "Public read countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (true);

-- Admin policies (check admin_profiles)
CREATE POLICY "Admin full countries" ON countries FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full packages" ON packages FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full qr_codes" ON qr_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full email_logs" ON email_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full admin_profiles" ON admin_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin full site_settings" ON site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- Storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "Admin upload qr" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'qr-codes' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Admin read qr" ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-codes' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
CREATE POLICY "Service role qr read" ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-codes');

-- Seed sample data
INSERT INTO countries (name_tr, name_en, slug, iso_code, is_region, flag_emoji) VALUES
  ('Türkiye', 'Turkey', 'turkiye', 'TR', false, '🇹🇷'),
  ('Avrupa', 'Europe', 'avrupa', 'EU', true, '🇪🇺'),
  ('Amerika Birleşik Devletleri', 'United States', 'abd', 'US', false, '🇺🇸'),
  ('İngiltere', 'United Kingdom', 'ingiltere', 'GB', false, '🇬🇧'),
  ('Almanya', 'Germany', 'almanya', 'DE', false, '🇩🇪'),
  ('Fransa', 'France', 'fransa', 'FR', false, '🇫🇷'),
  ('İtalya', 'Italy', 'italya', 'IT', false, '🇮🇹'),
  ('İspanya', 'Spain', 'ispanya', 'ES', false, '🇪🇸'),
  ('Japonya', 'Japan', 'japonya', 'JP', false, '🇯🇵'),
  ('Güney Kore', 'South Korea', 'guney-kore', 'KR', false, '🇰🇷');

INSERT INTO packages (country_id, name, slug, description_tr, data_amount, duration_days, price_tr, features, operator_name) VALUES
  ((SELECT id FROM countries WHERE slug='turkiye'), 'Türkiye 1GB', 'turkiye-1gb', 'Türkiye için 1GB veri paketi', '1GB', 7, 149.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'Turkcell'),
  ((SELECT id FROM countries WHERE slug='turkiye'), 'Türkiye 3GB', 'turkiye-3gb', 'Türkiye için 3GB veri paketi', '3GB', 15, 299.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'Turkcell'),
  ((SELECT id FROM countries WHERE slug='turkiye'), 'Türkiye 5GB', 'turkiye-5gb', 'Türkiye için 5GB veri paketi', '5GB', 30, 449.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'Turkcell'),
  ((SELECT id FROM countries WHERE slug='avrupa'), 'Avrupa 1GB', 'avrupa-1gb', '30+ Avrupa ülkesinde geçerli', '1GB', 7, 199.99, '{"network":"4G/LTE","hotspot":"Evet","countries":"30+"}', '3HK'),
  ((SELECT id FROM countries WHERE slug='avrupa'), 'Avrupa 3GB', 'avrupa-3gb', '30+ Avrupa ülkesinde geçerli', '3GB', 15, 399.99, '{"network":"4G/LTE","hotspot":"Evet","countries":"30+"}', '3HK'),
  ((SELECT id FROM countries WHERE slug='avrupa'), 'Avrupa 5GB', 'avrupa-5gb', '30+ Avrupa ülkesinde geçerli', '5GB', 30, 599.99, '{"network":"4G/LTE","hotspot":"Evet","countries":"30+"}', '3HK'),
  ((SELECT id FROM countries WHERE slug='abd'), 'ABD 3GB', 'abd-3gb', 'Amerika için 3GB veri paketi', '3GB', 15, 349.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'T-Mobile'),
  ((SELECT id FROM countries WHERE slug='abd'), 'ABD 5GB', 'abd-5gb', 'Amerika için 5GB veri paketi', '5GB', 30, 549.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'T-Mobile'),
  ((SELECT id FROM countries WHERE slug='japonya'), 'Japonya 1GB', 'japonya-1gb', 'Japonya için 1GB veri paketi', '1GB', 7, 249.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'SoftBank'),
  ((SELECT id FROM countries WHERE slug='japonya'), 'Japonya 3GB', 'japonya-3gb', 'Japonya için 3GB veri paketi', '3GB', 15, 449.99, '{"network":"4G/LTE","hotspot":"Evet"}', 'SoftBank');
