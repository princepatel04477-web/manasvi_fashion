'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useStore } from '@/hooks/useStore'

export function CartDrawer() {
  const cartStore = useStore(useCartStore, (state) => state)
  const router = useRouter()

  if (!cartStore) return null

  const { isOpen, items, toggleCart, removeItem, updateQuantity, getCartTotal } = cartStore

  const total = getCartTotal()
  const tax = total * 0.18 // 18% GST mock
  const finalTotal = total + tax

  const handleCheckout = () => {
    toggleCart()
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-[60] bg-cocoa/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-blush z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-peachy">
              <h2 className="font-display text-2xl font-bold text-cocoa flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3" />
                Your Cart ({items.length})
              </h2>
              <button onClick={toggleCart} className="text-cocoa hover:text-salmon transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-peachy mb-4" />
                  <p className="text-cocoa font-medium">Your cart is currently empty.</p>
                  <button
                    onClick={toggleCart}
                    className="bg-salmon text-cocoa px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm relative group">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1 text-peachy hover:text-salmon opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-blush flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-cocoa text-sm line-clamp-1 pr-6">{item.name}</h3>
                        <p className="text-xs text-peachy mt-1 flex gap-2">
                          <span>Size: {item.size}</span>
                          <span className="flex items-center gap-1">Color: <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.color }}/></span>
                        </p>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <div className="flex items-center space-x-3 border border-peachy rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-cocoa hover:text-salmon">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-cocoa w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-cocoa hover:text-salmon">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-cocoa">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-peachy p-6 bg-white space-y-4">
                <div className="flex justify-between text-sm text-cocoa/80">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-cocoa/80 border-b border-peachy/30 pb-4">
                  <span>Estimated GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl font-bold text-cocoa pt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-peachy text-center mb-4">Shipping calculated at checkout</p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-cocoa text-blush py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-salmon hover:text-cocoa transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}
