'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { cn } from '@/lib/utils'
import Logo from '../ui/Logo'
import BurgerButton from '../ui/BurgerButton'
import { useSearch } from '@/contexts/SearchContext'
import dynamic from 'next/dynamic'

import {
  LifeBuoy,
  Search,
  Map,
  Plane,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Car,
  DollarSign,
  Lightbulb,
  List,
  Star,
  Calendar,
  Waves,
  Palmtree,
  Camera,
  Backpack,
  type LucideIcon,
} from 'lucide-react'

import Link from 'next/link'

const SearchInput = dynamic(() => import('../ui/SearchInput'), {
  ssr: false,
})

// Маппинг названий иконок на компоненты
const iconMap: Record<string, LucideIcon> = {
  Map,
  Plane,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Car,
  DollarSign,
  Lightbulb,
  LifeBuoy,
  List,
  Star,
  Calendar,
  Waves,
  Palmtree,
  Camera,
  Backpack,
}

export interface NavigationItem {
  id: string | number
  title: string
  href: string
  icon: string
  linkType: 'section' | 'subsection' | 'article' | 'external'
}

interface HeaderProps {
  navigationItems?: NavigationItem[]
}

export function Header({ navigationItems = [] }: HeaderProps) {
  const { showHeader } = useScrollHeader()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  const headerClass = open ? 'top-0' : showHeader ? 'top-0' : '-top-20'

  const activeHref = useMemo(() => {
    const sorted = [...navigationItems].sort((a, b) => b.href.length - a.href.length)
    return sorted.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/'),
    )?.href
  }, [pathname, navigationItems])

  const searchButtonRef = useRef<HTMLButtonElement>(null)

  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
    setTimeout(() => setIsSearchVisible(true), 10)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchVisible(false)
    setTimeout(() => {
      setIsSearchOpen(false)
      searchButtonRef.current?.focus()
    }, 300)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) closeSearch()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        burgerRef.current &&
        !burgerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'border-b border-black/5 sticky z-50 bg-background transition-all duration-300',
        headerClass,
      )}
    >
      <div className="container h-20 flex items-center justify-between">
        <Logo smallLogo={true} />

        <div
          ref={menuRef}
          id="mobile-menu"
          className={cn(
            'max-xl:absolute duration-300 transition max-xl:top-full max-xl:left-0 max-xl:w-full max-xl:bg-background/95 max-xl:border-t max-xl:border-white/5 max-xl:px-6 max-xl:py-8 max-xl:overscroll-contain max-xl:max-h-[calc(100vh-5rem)] max-xl:overflow-y-auto',
            open
              ? 'max-xl:translate-y-0 max-xl:opacity-100 visible'
              : 'max-xl:-translate-y-5 max-xl:opacity-0 max-xl:pointer-events-none max-xl:-z-10',
          )}
        >
          <nav className="flex items-center max-xl:flex-col max-xl:items-start gap-3">
            {navigationItems.length > 0 && (
              navigationItems.map((item) => {

                const isActive = item.href === activeHref

                const IconComponent = iconMap[item.icon] || Map

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.linkType === 'external') {
                        window.open(item.href, '_blank')
                      } else {
                        router.push(item.href)
                      }
                      setOpen(false)
                    }}
                    className={cn(
                      'hover-underline px-1.5 py-1 center flex items-center gap-1 text-sm transition-all duration-300',
                      isActive ? 'text-black active' : 'text-[var(--color-paragraph)] hover:text-black',
                    )}
                  >
                    <IconComponent size={16} />
                    {item.title}
                  </button>
                )
              })
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-6 items-center relative max-[500px]:gap-2">
            <button
              ref={searchButtonRef}
              onClick={openSearch}
              aria-label="Открыть поиск"
              aria-expanded={isSearchOpen}
              aria-controls="search-overlay"
              className="p-2 hover:bg-[#004E4A33] rounded-xl transition-colors duration-300"
            >
              <Search className="text-[#45556C]" />
            </button>

            <Link
              href="/help"
              className="
                w-[166px] h-[40px] rounded-2xl bg-[var(--color-main)]
                shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]
                text-white hover:opacity-90 active:scale-[0.98] transition-all
                font-medium leading-5 flex items-center gap-[17px]
                sm:pl-6 max-sm:w-[110px] max-sm:justify-center max-sm:text-sm max-sm:gap-2.5
              "
            >
              <LifeBuoy size={18} />
              Помощь
            </Link>

            <div className="xl:hidden">
              <BurgerButton burgerRef={burgerRef} isMenuOpen={open} setIsMenuOpen={setOpen} />
            </div>
          </div>
        </div>
      </div>

      <div
        id="search-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по сайту"
        aria-hidden={!isSearchVisible}
        className={cn(
          'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4 transition-all duration-300',
          isSearchVisible ? 'opacity-100 z-[100]' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeSearch}
        onKeyDown={(e) => {
          if (e.key === 'Tab' && isSearchVisible) {
            const overlay = e.currentTarget
            const focusable = overlay.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault()
              last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault()
              first.focus()
            }
          }
        }}
      >
        <div
          className={cn(
            'w-full max-w-2xl transition-all duration-300',
            isSearchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <SearchInput onClose={closeSearch} />
          </div>
          <p className="text-center text-white/50 text-xs sm:text-sm mt-6 tracking-wide">
            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded border border-white/20 text-white/60 text-[10px] mr-1">ESC</kbd>
            {' '}или клик вне поля — закрыть
          </p>
        </div>
      </div>
    </header>
  )
}
