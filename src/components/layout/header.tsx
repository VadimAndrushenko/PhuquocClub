'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { cn } from '@/lib/utils'
import Logo from '../ui/Logo'
import BurgerButton from '../ui/BurgerButton'
import { useSearch } from '@/contexts/SearchContext'

import {
  LifeBuoy,
  Search,
  // Иконки для навигации
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

import SearchInput from '../ui/SearchInput'

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

  const openSearch = () => {
    setIsSearchOpen(true)
    setTimeout(() => setIsSearchVisible(true), 10)
  }

  const closeSearch = () => {
    setIsSearchVisible(false)
    setTimeout(() => {
      setIsSearchOpen(false)
    }, 300)
  }

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
          className={cn(
            'max-xl:absolute duration-300 transition max-xl:top-full max-xl:left-0 max-xl:w-full max-xl:bg-background/95 max-xl:border-t max-xl:border-white/5 max-xl:px-6 max-xl:py-8',
            open
              ? 'max-xl:translate-y-0 max-xl:opacity-100 visible'
              : 'max-xl:-translate-y-5 max-xl:opacity-0 max-xl:pointer-events-none max-xl:-z-10',
          )}
        >
          <nav className="flex items-center max-xl:flex-col max-xl:items-start gap-3">
            {navigationItems.length > 0 ? (
              navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
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
                      isActive ? 'text-black active' : 'text-[#314158] hover:text-black',
                    )}
                  >
                    <IconComponent size={16} />
                    {item.title}
                  </button>
                )
              })
            ) : (
              // Fallback menu если навигация не настроена
              <></>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-6 items-center relative max-[500px]:gap-2">
            <button
              onClick={openSearch}
              className="p-2 hover:bg-[#004E4A33] rounded-xl transition-colors duration-300"
            >
              <Search className="text-[#45556C]" />
            </button>

            <button
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
            </button>

            <div className="xl:hidden">
              <BurgerButton burgerRef={burgerRef} isMenuOpen={open} setIsMenuOpen={setOpen} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center pt-28 px-4 transition-opacity duration-300',
          isSearchVisible ? 'opacity-100 z-[100]' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeSearch}
      >
        <div
          className={cn(
            'w-full max-w-2xl transition-all duration-300',
            isSearchVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <SearchInput onClose={closeSearch} />
          </div>
          <p className="text-center text-white/70 text-sm mt-6">
            Нажмите ESC или кликните по тёмному фону чтобы закрыть
          </p>
        </div>
      </div>
    </header>
  )
}
 