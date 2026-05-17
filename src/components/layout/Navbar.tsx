'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Heart, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const toggleCart = useCartStore((state) => state.toggleCart)
  const cartItemsCount = useCartStore((state) => state.items.length)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-blush/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cocoa"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
          <span className="font-display text-2xl md:text-3xl font-bold tracking-wider text-cocoa">
            MANSVI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-sm uppercase tracking-widest font-medium text-cocoa hover:text-salmon transition-colors">
            Shop
          </Link>
          <Link href="/shop?category=new-arrivals" className="text-sm uppercase tracking-widest font-medium text-cocoa hover:text-salmon transition-colors">
            New Arrivals
          </Link>
          <Link href="/shop?category=festive" className="text-sm uppercase tracking-widest font-medium text-cocoa hover:text-salmon transition-colors">
            Festive
          </Link>
          <Link href="/about" className="text-sm uppercase tracking-widest font-medium text-cocoa hover:text-salmon transition-colors">
            About
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/account" className="text-cocoa hover:text-salmon transition-colors hidden md:block">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/account?tab=wishlist" className="text-cocoa hover:text-salmon transition-colors hidden md:block">
            <Heart className="w-5 h-5" />
          </Link>
          <button onClick={toggleCart} className="text-cocoa hover:text-salmon transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-salmon text-cocoa text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-blush md:hidden flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-peachy">
              <span className="font-display text-2xl font-bold tracking-wider text-cocoa">
                MANSVI
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-cocoa" />
              </button>
            </div>
            <nav className="flex flex-col p-8 space-y-6">
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display text-cocoa">Shop All</Link>
              <Link href="/shop?category=kurtis" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display text-cocoa">Kurtis</Link>
              <Link href="/shop?category=festive" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display text-cocoa">Festive Wear</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display text-cocoa">My Account</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
