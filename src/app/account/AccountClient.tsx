'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Heart, MapPin, User, LogOut } from 'lucide-react'
import { useWishlistStore } from '@/store'
import Link from 'next/link'
import { useStore } from '@/hooks/useStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccountClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('orders')
  const wishlistItems = useStore(useWishlistStore, (state) => state.items) || []

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-peachy">
            <div className="text-center mb-8 pb-6 border-b border-peachy/30">
              <div className="w-20 h-20 bg-blush rounded-full mx-auto flex items-center justify-center text-cocoa text-2xl font-display font-bold mb-3">
                {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-cocoa text-lg truncate">{user.name || 'User'}</h2>
              <p className="text-xs text-peachy truncate">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-salmon text-cocoa'
                        : 'text-cocoa/70 hover:bg-blush'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-red-500 hover:bg-red-50 mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-peachy min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="font-display text-2xl font-bold text-cocoa mb-6">Order History</h2>
                {user.orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-peachy mx-auto mb-4" />
                    <p className="text-cocoa/70 mb-4">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-salmon hover:text-cocoa">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {user.orders.map((order: any) => (
                      <div key={order.id} className="border border-peachy/50 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-sm font-medium text-cocoa mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-peachy">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-cocoa">₹{order.total}</span>
                          <span className="text-xs px-2 py-1 bg-blush text-cocoa rounded-md uppercase tracking-wider font-bold">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="font-display text-2xl font-bold text-cocoa mb-6">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-peachy mx-auto mb-4" />
                    <p className="text-cocoa/70 mb-4">Your wishlist is empty.</p>
                    <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-salmon hover:text-cocoa">
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* In a real app, we would fetch the product details based on wishlistItems IDs. For now, showing placeholder logic */}
                    <div className="col-span-full text-sm text-peachy p-4 bg-blush/30 rounded-lg text-center">
                      Wishlist items would be displayed here matching the IDs: {wishlistItems.join(', ')}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="font-display text-2xl font-bold text-cocoa mb-6">Profile Settings</h2>
                <form className="max-w-md space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">Full Name</label>
                    <input type="text" defaultValue={user.name || ''} className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">Email Address</label>
                    <input type="email" defaultValue={user.email || ''} disabled className="w-full border border-peachy/50 bg-gray-50 rounded-lg px-4 py-2 text-cocoa/50 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-cocoa">Phone Number</label>
                    <input type="tel" defaultValue={user.phone || ''} className="w-full border border-peachy rounded-lg px-4 py-2 focus:outline-none focus:border-salmon" />
                  </div>
                  <button type="button" className="bg-cocoa text-blush px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-salmon hover:text-cocoa transition-colors mt-4">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-cocoa">Saved Addresses</h2>
                  <button className="text-sm text-salmon font-bold hover:text-cocoa transition-colors">
                    + Add New
                  </button>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-peachy rounded-2xl">
                  <MapPin className="w-8 h-8 text-peachy mx-auto mb-2" />
                  <p className="text-cocoa/70 text-sm">No saved addresses found.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
