import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-3 border-black bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-black text-xl tracking-tighter">
              eSIM<span className="text-black bg-[#FFE500] px-1 ml-0.5">TR</span>
            </span>
            <p className="text-sm text-gray-400 mt-1">{t('footer.description')}</p>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {year} eSIM TR. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
