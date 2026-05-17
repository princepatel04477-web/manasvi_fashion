'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react'
import { useCartStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useStore } from '@/hooks/useStore'

export default function CheckoutPage() {
  const cartStore = useStore(useCartStore, (state) => state)
  const router = useRouter()

  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirmation

  if (!cartStore) return null

  const { items, getCartTotal, clearCart } = cartStore

  const total = getCartTotal()
  const tax = total * 0.18
  const finalTotal = total + tax

  // Redirect to cart if empty
  if (items.length === 0 && step !== 3) {
    if (typeof window !== 'undefined') {
      router.push('/shop')
    }
    return null
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mocking payment processing
    setTimeout(() => {
      clearCart()
      setStep(3)
    }, 1500)
  }

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <CheckCircle2 className="w-24 h-24 text-salmon mb-6" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-cocoa mb-4 text-center">Order Confirmed!</h1>
        <p className="text-cocoa/80 text-center max-w-md mb-8">
          Thank you for your purchase. We&apos;ve received your order and will email you the tracking details once it ships.
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-peachy mb-8 text-center w-full max-w-sm">
          <p className="text-sm text-peachy mb-1">Order Number</p>
          <p className="font-bold text-cocoa text-xl">#MANSVI-{Math.floor(10000 + Math.random() * 90000)}</p>
        </div>
        <button
          onClick={() => router.push('/shop')}
          className="bg-cocoa text-blush px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-salmon hover:text-cocoa transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-cocoa mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Form */}
        <div className="lg:w-2/3">
          {/* Progress Steps */}
          <div className="flex items-center text-sm font-bold uppercase tracking-widest mb-8">
            <span className={step >= 1 ? 'text-salmon' : 'text-peachy'}>Address</span>
            <ChevronRight className="w-4 h-4 mx-2 text-peachy" />
            <span className={step >= 2 ? 'text-salmon' : 'text-peachy'}>Payment</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="address-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleAddressSubmit}
                className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-peachy/30"
              >
                <h2 className="text-xl font-bold text-cocoa mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">First Name</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">Last Name</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-cocoa">Email Address</label>
                    <input required type="email" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-cocoa">Street Address</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">City</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">State</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">PIN Code</label>
                    <input required type="text" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">Phone Number</label>
                    <input required type="tel" className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-cocoa text-blush py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-salmon hover:text-cocoa transition-colors mt-6">
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="payment-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePaymentSubmit}
                className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-peachy/30"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-cocoa">Payment Method</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-salmon underline">Edit Address</button>
                </div>

                <div className="border border-peachy rounded-xl overflow-hidden">
                  <label className="flex items-center p-4 border-b border-peachy cursor-pointer hover:bg-blush/50 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="text-salmon focus:ring-salmon" />
                    <span className="ml-3 font-bold text-cocoa">Razorpay / Credit Card / UPI</span>
                  </label>
                  <div className="p-4 bg-blush/20 text-sm text-cocoa/80 text-center flex flex-col items-center">
                    <Lock className="w-8 h-8 text-peachy mb-2" />
                    <p>After clicking &quot;Pay Now&quot;, you will be redirected to Razorpay to complete your purchase securely.</p>
                    <p className="text-xs text-peachy mt-2">(MOCK IMPLEMENTATION)</p>
                  </div>
                </div>

                <button type="submit" className="w-full bg-salmon text-cocoa py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-cocoa hover:text-blush transition-colors mt-6 flex justify-center items-center">
                  <Lock className="w-4 h-4 mr-2" /> Pay ₹{finalTotal.toFixed(2)} Now
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-peachy sticky top-28">
            <h2 className="font-bold text-cocoa mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 rounded-md overflow-hidden bg-blush flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-cocoa text-blush w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-cocoa text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-peachy">Size: {item.size}</p>
                    <p className="font-bold text-cocoa text-sm mt-1">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-peachy/50 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-cocoa/80">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cocoa/80">
                <span>Shipping</span>
                <span className="text-salmon font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-cocoa/80 border-b border-peachy/50 pb-4">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-display text-2xl font-bold text-cocoa pt-2">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
