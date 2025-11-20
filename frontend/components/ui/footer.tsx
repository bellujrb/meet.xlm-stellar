import { Button } from "@/components/ui/button"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-8 pt-16 lg:pb-12 lg:pt-24 bg-white border-t-4 border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-3 group"
            aria-label={brandName}
          >
            <div className="w-12 h-12 rounded-xl border-3 border-zinc-900 bg-amber-400 flex items-center justify-center shadow-[3px_3px_0px_0px] shadow-zinc-900 transition-all duration-300 group-hover:shadow-[5px_5px_0px_0px] group-hover:rotate-[-5deg]">
              {logo}
            </div>
            <span className="font-handwritten font-bold text-2xl text-zinc-900">
              {brandName}
            </span>
          </a>
          
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group w-12 h-12 rounded-full border-3 border-zinc-900 bg-white flex items-center justify-center shadow-[3px_3px_0px_0px] shadow-zinc-900 hover:shadow-[5px_5px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
                >
                  <div className="text-zinc-900 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t-2 border-zinc-900 mt-8 pt-8 md:mt-10 md:pt-10 lg:grid lg:grid-cols-10 lg:gap-4">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="shrink-0">
                  <a
                    href={link.href}
                    className="text-base font-semibold text-zinc-900 hover:text-amber-600 transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 text-sm leading-6 text-zinc-600 lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div className="font-semibold text-zinc-900">{copyright.text}</div>
            {copyright.license && <div className="mt-1">{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}

