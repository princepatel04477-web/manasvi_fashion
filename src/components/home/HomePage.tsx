'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ThreeHero } from '@/components/3d/ThreeHero'
import { Heart } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { useStore } from '@/hooks/useStore'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  { name: 'Kurtis', image: 'https://images.unsplash.com/photo-1620804473760-4966779b5c77?q=80&w=600&auto=format&fit=crop', link: '/shop?category=kurtis' },
  { name: 'Anarkali', image: 'https://images.unsplash.com/photo-1583391733958-d651010375e8?q=80&w=600&auto=format&fit=crop', link: '/shop?category=anarkali' },
  { name: 'Palazzo Sets', image: 'https://images.unsplash.com/photo-1622515099516-72c219669527?q=80&w=600&auto=format&fit=crop', link: '/shop?category=palazzo-sets' },
  { name: 'Festive Wear', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop', link: '/shop?category=festive-wear' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomePage({ featuredProducts }: { featuredProducts: any[] }) {
  const heroRef = useRef(null)
  const categoryRef = useRef(null)

  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mounted = useStore(useWishlistStore, (state) => state)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on categories
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gsap.utils.toArray('.category-card').forEach((card: any) => {
        gsap.to(card.querySelector('img'), {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden -mt-24 md:-mt-28">
        <ThreeHero />
        <div className="z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-blush mb-6"
          >
            Wear the Culture. <br className="hidden md:block" /> Own the Grace.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link
              href="/shop"
              className="inline-block bg-salmon text-cocoa px-8 py-4 uppercase tracking-widest text-sm font-bold shadow-card hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(242,175,163,0.4)] transition-all duration-300 rounded-full"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories (Horizontal Scroll on Mobile) */}
      <section className="py-24 bg-blush" ref={categoryRef}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="font-display text-4xl font-bold text-cocoa mb-12 text-center">Shop by Category</h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-8 snap-x">
            {categories.map((cat, i) => (
              <Link href={cat.link} key={i} className="category-card relative min-w-[280px] md:min-w-0 h-[400px] rounded-2xl overflow-hidden group snap-center block">
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-cocoa/20 group-hover:bg-cocoa/40 transition-colors duration-300" />
                <div className="absolute bottom-6 left-6 text-blush">
                  <h3 className="font-display text-2xl font-bold tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-4xl font-bold text-cocoa">New Arrivals</h2>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-salmon hover:text-cocoa transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const images = JSON.parse(product.images)
              const sizes = JSON.parse(product.sizes)
              const colors = JSON.parse(product.colors)
              const isLiked = isInWishlist(product.id)

              return (
                <div key={product.id} className="group flex flex-col">
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
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: images[0],
                          quantity: 1,
                          size: sizes[0],
                          color: colors[0],
                        })
                      }}
                      className="absolute bottom-4 left-4 right-4 bg-cocoa/90 backdrop-blur-sm text-blush py-3 font-bold uppercase text-sm tracking-widest translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 rounded-xl"
                    >
                      Quick Add
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
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="relative py-32 overflow-hidden bg-tan/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1610444985223-a212eab31828?q=80&w=800&auto=format&fit=crop"
                alt="Crafted for Every Woman"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-cocoa mb-6">Crafted for Every Woman</h2>
              <p className="text-lg text-cocoa/80 mb-8 max-w-lg leading-relaxed">
                Discover our meticulously curated collection of Indian ethnic wear, where traditional craftsmanship meets contemporary elegance. Every piece is designed to celebrate your unique grace.
              </p>
              <Link
                href="/about"
                className="inline-block border-b-2 border-salmon text-cocoa font-bold uppercase tracking-widest pb-1 hover:text-salmon transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
