# eSIM TR

Seyahat eSIM paketleri satan bir web uygulamasi. Musteriler siteden paket secip siparis verir, sistem otomatik olarak stoktan QR kod atayip e-posta ile gonderir. Admin panelden stok, siparis ve raporlar yonetilir.

## Ozellikler

### Storefront (Musteri Tarafi)
- Brutalist tasarim stili (siyah, beyaz, elektrik sari)
- Ulke/bolge bazli eSIM paket listeleme ve filtreleme
- Anlik ulke arama
- Paket detay sayfasi ile gomulu siparis formu
- Siparis sonrasi otomatik QR kod e-postasi
- Coklu dil destegi (Turkce / Ingilizce)
- SEO uyumlu (dinamik metadata, sitemap)
- Tam responsive tasarim

### Admin Panel
- Supabase Auth ile guvenli giris
- Dashboard: Gunluk siparis sayisi, bekleyen/gonderilen, dusuk stok uyarilari
- Siparis yonetimi: Listeleme, filtreleme, arama, durum guncelleme, e-posta tekrar gonderme
- Stok yonetimi: Paket bazli stok tablosu (renk kodlu), surukle-birak QR yukleme
- Raporlar: Tarih araligi, gunluk siparis grafigi, ulke bazli gelir, CSV export
- E-posta sablonlari: Onizleme ve test gonderim

### Teknik
- Race-condition korumali QR atama (`FOR UPDATE SKIP LOCKED`)
- Otomatik siparis numarasi (ESM-YYYYMMDD-NNN)
- Rate limiting (siparis endpoint)
- Input sanitization
- Row Level Security (RLS)
- Mock data modu (Supabase olmadan gelistirme)

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + TypeScript |
| Stil | [Tailwind CSS v4](https://tailwindcss.com/) |
| Veritabani | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| E-posta | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Ikonlar | [Lucide React](https://lucide.dev/) |

## Proje Yapisi

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (storefront)/          # Musteri sayfalari
│   │   │   ├── page.tsx           # Ana sayfa
│   │   │   ├── packages/          # Paket listesi + detay
│   │   │   ├── order-success/     # Siparis basarili
│   │   │   └── layout.tsx
│   │   ├── (admin)/               # Admin panel
│   │   │   ├── admin/             # Dashboard, siparisler, stok, raporlar
│   │   │   └── login/             # Admin girisi
│   │   └── layout.tsx
│   ├── api/                       # API rotalari
│   │   ├── orders/                # Siparis CRUD + e-posta
│   │   ├── packages/              # Paket listeleme
│   │   ├── stock/                 # Stok yonetimi + yukleme
│   │   └── auth/                  # Auth callback
│   └── sitemap.ts
├── components/
│   ├── storefront/                # Header, Footer, Hero, PackageCard, OrderForm
│   ├── admin/                     # Sidebar, OrderTable, StockTable, Dashboard
│   ├── ui/                        # Button, Input, Select, Badge, Card, Modal, Toast
│   └── email/                     # React Email sablonu
├── lib/
│   ├── supabase/                  # Client, server, admin, mock
│   ├── email/                     # E-posta gonderim fonksiyonu
│   ├── utils/                     # Format, slugify
│   ├── constants.ts
│   └── types.ts
├── i18n/                          # next-intl yapilandirmasi
├── messages/                      # tr.json, en.json
└── middleware.ts                   # Auth guard + i18n routing

supabase/
└── migrations/
    └── 001_initial_schema.sql     # Tum tablolar, fonksiyonlar, RLS, seed data
```

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabi (production icin)
- Resend hesabi (e-posta icin)

### 1. Repoyu klonla

```bash
git clone https://github.com/radioheavy/esim.git
cd esim
npm install
```

### 2. Ortam degiskenleri

`.env.local` dosyasini duzenle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Not:** Ortam degiskenlerini `your-supabase-url` olarak birakirsan uygulama **mock data** ile calisir. Supabase kurmadan UI'i test edebilirsin.

### 3. Veritabani kurulumu (Supabase)

Supabase projesinde SQL Editor'e git ve `supabase/migrations/001_initial_schema.sql` dosyasinin icerigini calistir. Bu dosya:

- Tum tablolari olusturur (countries, packages, orders, qr_codes, email_logs, admin_profiles, site_settings)
- Otomatik siparis numarasi trigger'i kurar
- `assign_qr_to_order` stored procedure'unu olusturur
- Row Level Security politikalarini uygular
- `qr-codes` storage bucket'ini olusturur
- `stock_summary` view'ini olusturur
- Ornek ulke ve paket verisi ekler

### 4. Admin kullanici olustur

Supabase Dashboard > Authentication > Users kismindan bir kullanici olustur, ardindan SQL Editor'de:

```sql
INSERT INTO admin_profiles (id, full_name, role)
VALUES ('buraya-user-uuid', 'Admin Adi', 'admin');
```

### 5. Calistir

```bash
# Gelistirme
npm run dev

# Production build
npm run build
npm start
```

Uygulama `http://localhost:3000` adresinde acilir.

## Sayfalar

| URL | Aciklama |
|-----|----------|
| `/tr` | Ana sayfa (hero + populer paketler) |
| `/tr/packages` | Tum paketler (ulke filtreleme) |
| `/tr/packages/[slug]` | Paket detay + siparis formu |
| `/tr/order-success` | Siparis basarili sayfasi |
| `/tr/login` | Admin giris |
| `/tr/admin` | Admin dashboard |
| `/tr/admin/orders` | Siparis listesi |
| `/tr/admin/orders/[id]` | Siparis detay |
| `/tr/admin/stock` | Stok tablosu |
| `/tr/admin/stock/upload` | QR kod yukleme |
| `/tr/admin/reports` | Raporlar |
| `/tr/admin/email-templates` | E-posta sablonlari |

## API Endpoints

| Metot | URL | Aciklama |
|-------|-----|----------|
| `POST` | `/api/orders` | Yeni siparis olustur |
| `GET` | `/api/orders?report=true&start=X&end=Y` | Rapor verileri |
| `GET` | `/api/orders/[id]` | Siparis detay |
| `PATCH` | `/api/orders/[id]` | Siparis durumu guncelle |
| `POST` | `/api/orders/[id]/resend-email` | E-posta tekrar gonder |
| `GET` | `/api/packages` | Paket listesi |
| `GET` | `/api/packages?countries_only=true` | Ulke listesi |
| `GET` | `/api/packages/[id]` | Paket detay |
| `PATCH` | `/api/packages/[id]` | Paket guncelle |
| `GET` | `/api/stock` | Stok ozeti |
| `POST` | `/api/stock/upload` | QR kod yukle (multipart) |

## Siparis Akisi

```
Musteri form doldurur
    |
POST /api/orders
    |
Input validasyonu + rate limit kontrolu
    |
Paket varlik kontrolu
    |
Siparis kaydi olustur (order_number otomatik)
    |
assign_qr_to_order() -> Atomik QR atama (FOR UPDATE SKIP LOCKED)
    |
|-- QR varsa -> E-posta gonder (Resend + QR attachment) -> Basari
|-- QR yoksa -> Siparis "problematic" -> 400 out_of_stock
```

## Veritabani Semasi

```
countries ---+
             +--- packages ---+
             |                +--- qr_codes ---- orders
             |                |                    +--- email_logs
             |                +--------------------+
admin_profiles
site_settings
stock_summary (VIEW)
```

### Tablolar

| Tablo | Aciklama |
|-------|----------|
| `countries` | Ulke/bolge bilgileri (isim, slug, ISO kodu, bayrak emoji) |
| `packages` | eSIM paketleri (veri, sure, fiyat, ozellikler, operator) |
| `qr_codes` | QR kod gorselleri (Storage path, durum: available/assigned/problematic) |
| `orders` | Siparisler (musteri bilgileri, durum, e-posta durumu) |
| `email_logs` | E-posta gonderim gecmisi |
| `admin_profiles` | Admin kullanici profilleri |
| `site_settings` | Site ayarlari (key-value) |
| `stock_summary` | Paket bazli stok ozet VIEW'i |

## Tasarim Sistemi

Brutalist tasarim dili:

- **Renkler:** Siyah `#000`, Beyaz `#FFF`, Accent `#FFE500`
- **Tipografi:** Kalin (700-900 weight), buyuk boyutlar
- **Kenarliklar:** 3px solid siyah, border-radius yok, golge yok
- **Hover:** Renk ters cevirme veya accent highlight
- **Kartlar:** Hover'da yukari kayma + offset golge `shadow-[4px_4px_0_0_#000]`

### UI Bilesenleri

| Bilesen | Varyantlar |
|---------|------------|
| `Button` | primary / secondary / danger / ghost, sm / md / lg |
| `Input` | Label, error state, focus highlight |
| `Select` | Label, placeholder, options |
| `Badge` | default / green / yellow / red |
| `Card` | Hover efektli kart |
| `Modal` | Dialog tabanli modal |
| `Toast` | Success / error / info bildirimleri |

## Deploy

### Vercel

1. GitHub reposunu Vercel'e bagla
2. Ortam degiskenlerini Vercel dashboard'dan ekle
3. Deploy et

### Ortam Degiskenleri (Production)

| Degisken | Aciklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Gonderici e-posta (domain dogrulanmis olmali) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (https://yourdomain.com) |

## Gelistirme Notlari

- **Mock modu:** `.env.local`'deki Supabase URL `your-supabase-url` olarak kalirsa tum veriler mock olarak calisir. Supabase baglantisi gerekmeden UI gelistirmesi yapilabilir.
- **Middleware uyarisi:** Next.js 16 `middleware` convention'ini deprecated olarak gosterir, `proxy` onerir. Simdilik calismaya devam eder.
- **Tailwind v4:** `tailwind.config.js` yerine `@theme inline` bloklari kullanilir. `border-3` gibi ozel genislikler `globals.css`'de tanimlidir.

## Lisans

Bu proje [MIT Lisansi](./LICENSE) ile lisanslanmistir.
