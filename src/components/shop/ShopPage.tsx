'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useWishlistStore } from '@/store'
import { useStore } from '@/hooks/useStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShopPage({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mounted = useStore(useWishlistStore, (state) => state)

  useEffect(() => {
    if (selectedCategory) {
      setProducts(initialProducts.filter(p => p.categoryId === selectedCategory))
    } else {
      setProducts(initialProducts)
    }
  }, [selectedCategory, initialProducts])

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-display text-4xl font-bold text-cocoa">Shop Collection</h1>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center space-x-2 border border-peachy px-4 py-2 rounded-full text-cocoa font-medium uppercase text-sm tracking-widest"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-peachy/30">
            <h3 className="font-bold uppercase tracking-widest text-sm text-cocoa mb-4 flex items-center justify-between">
              Categories <ChevronDown className="w-4 h-4" />
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-sm hover:text-salmon transition-colors ${!selectedCategory ? 'text-salmon font-bold' : 'text-cocoa/70'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`text-sm hover:text-salmon transition-colors ${selectedCategory === category.id ? 'text-salmon font-bold' : 'text-cocoa/70'}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="font-bold uppercase tracking-widest text-sm text-cocoa mb-4 flex items-center justify-between">
              Price Range <ChevronDown className="w-4 h-4" />
            </h3>
            {/* Placeholder for price filter */}
            <div className="space-y-2 mb-8">
               <label className="flex items-center space-x-2 text-sm text-cocoa/70">
                 <input type="checkbox" className="rounded border-peachy text-salmon focus:ring-salmon" />
                 <span>Under ₹2000</span>
               </label>
               <label className="flex items-center space-x-2 text-sm text-cocoa/70">
                 <input type="checkbox" className="rounded border-peachy text-salmon focus:ring-salmon" />
                 <span>₹2000 - ₹5000</span>
               </label>
               <label className="flex items-center space-x-2 text-sm text-cocoa/70">
                 <input type="checkbox" className="rounded border-peachy text-salmon focus:ring-salmon" />
                 <span>Over ₹5000</span>
               </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {products.map((product) => {
                const images = JSON.parse(product.images)
                const isLiked = isInWishlist(product.id)

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-blush">
                      <Link href={`/product/${product.slug}`}>
                        <Image
                          src={images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cocoa hover:text-salmon transition-colors"
                      >
                        <Heart className="w-5 h-5" fill={mounted && isLiked ? "#F2AFA3" : "none"} color={mounted && isLiked ? "#F2AFA3" : "currentColor"} />
                      </button>
                    </div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-display text-lg font-bold text-cocoa mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-peachy mb-2">{product.category.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cocoa">₹{product.price}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-peachy line-through">₹{product.comparePrice}</span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-cocoa/60">No products found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
