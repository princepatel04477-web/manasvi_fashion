'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Truck, RefreshCcw, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import * as Accordion from '@radix-ui/react-accordion'
import { useStore } from '@/hooks/useStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductPage({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const images = JSON.parse(product.images)
  const sizes = JSON.parse(product.sizes)
  const colors = JSON.parse(product.colors)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])

  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mounted = useStore(useWishlistStore, (state) => state)
  const isLiked = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    })
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-peachy mb-8">
        <a href="/" className="hover:text-cocoa transition-colors">Home</a>
        <ChevronRight className="w-4 h-4" />
        <a href="/shop" className="hover:text-cocoa transition-colors">Shop</a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-cocoa font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 mb-24">
        {/* Product Gallery */}
        <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-[3/4] md:w-full rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 w-20 ${
                  selectedImage === idx ? 'border-salmon' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-blush shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cocoa hover:text-salmon transition-colors shadow-sm"
            >
              <Heart className="w-6 h-6" fill={mounted && isLiked ? "#F2AFA3" : "none"} color={mounted && isLiked ? "#F2AFA3" : "currentColor"} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cocoa mb-2">{product.name}</h1>
          <p className="text-lg text-peachy mb-6">{product.category.name}</p>

          <div className="flex items-end space-x-4 mb-8">
            <span className="font-display text-3xl font-bold text-cocoa">₹{product.price}</span>
            {product.comparePrice && (
              <span className="text-xl text-peachy line-through mb-1">₹{product.comparePrice}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-white bg-salmon px-2 py-1 rounded-md mb-2 ml-4">
              Inclusive of all taxes
            </span>
          </div>

          <p className="text-cocoa/80 leading-relaxed mb-8">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-cocoa mb-3">Color</h3>
            <div className="flex space-x-3">
              {colors.map((color: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-cocoa scale-110 shadow-md' : 'border-transparent shadow-sm'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-cocoa">Size</h3>
              <button className="text-sm text-salmon font-medium underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {sizes.map((size: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    selectedSize === size
                      ? 'border-cocoa bg-cocoa text-blush shadow-md'
                      : 'border-peachy text-cocoa hover:border-salmon'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-salmon text-cocoa py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-card hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(242,175,163,0.4)] transition-all duration-300"
            >
              Add to Cart
            </button>
            <button className="flex-1 border-2 border-cocoa text-cocoa py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-cocoa hover:text-blush transition-colors">
              Buy It Now
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-peachy/30 mb-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="w-6 h-6 text-salmon" />
              <span className="text-xs font-bold uppercase tracking-wider text-cocoa">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RefreshCcw className="w-6 h-6 text-salmon" />
              <span className="text-xs font-bold uppercase tracking-wider text-cocoa">7 Days Return</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-salmon" />
              <span className="text-xs font-bold uppercase tracking-wider text-cocoa">Secure Payment</span>
            </div>
          </div>

          {/* Accordion Details */}
          <Accordion.Root type="single" collapsible className="w-full">
            <Accordion.Item value="fabric" className="border-b border-peachy/30">
              <Accordion.Header>
                <Accordion.Trigger className="flex justify-between items-center w-full py-4 text-left font-bold uppercase tracking-widest text-sm text-cocoa group">
                  Fabric & Care
                  <ChevronDown className="w-4 h-4 text-peachy group-data-[state=open]:rotate-180 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-cocoa/80 text-sm leading-relaxed">
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Dry clean only</li>
                  <li>Do not bleach</li>
                  <li>Iron on low heat</li>
                  <li>Store in a cool, dry place</li>
                </ul>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="shipping" className="border-b border-peachy/30">
              <Accordion.Header>
                <Accordion.Trigger className="flex justify-between items-center w-full py-4 text-left font-bold uppercase tracking-widest text-sm text-cocoa group">
                  Shipping & Returns
                  <ChevronDown className="w-4 h-4 text-peachy group-data-[state=open]:rotate-180 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-cocoa/80 text-sm leading-relaxed">
                <p>We offer free standard shipping on all orders within India. Delivery typically takes 3-7 business days depending on your location.</p>
                <p className="mt-2">Not satisfied? Return your unworn items within 7 days of delivery for a full refund or exchange.</p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>

      {/* Complete the Look / Related Products placeholder */}
      {relatedProducts && relatedProducts.length > 0 && (
         <div className="mt-24">
            <h2 className="font-display text-3xl font-bold text-cocoa mb-8 text-center">Complete the Look</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => {
                const rpImages = JSON.parse(rp.images)
                return (
                  <a href={`/product/${rp.slug}`} key={rp.id} className="group flex flex-col">
                     <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-blush">
                       <Image src={rpImages[0]} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <h3 className="font-display text-lg font-bold text-cocoa mb-1">{rp.name}</h3>
                     <span className="font-bold text-cocoa">₹{rp.price}</span>
                  </a>
                )
              })}
            </div>
         </div>
      )}
    </div>
  )
}
