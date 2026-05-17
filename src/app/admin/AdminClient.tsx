'use client'

import { useState } from 'react'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Settings, LogOut, Plus, Edit, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminClient({ products, orders }: { products: any[], orders: any[] }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-blush/30 flex">
      {/* Sidebar */}
      <div className="w-64 bg-cocoa text-blush flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold tracking-wider text-center">MANSVI</h2>
          <p className="text-xs text-peachy text-center tracking-widest uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-salmon text-cocoa'
                    : 'text-blush/70 hover:bg-white/10 hover:text-blush'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-salmon hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white px-8 py-4 shadow-sm flex justify-between items-center md:hidden">
           <h2 className="font-display text-xl font-bold tracking-wider text-cocoa">MANSVI Admin</h2>
           <button onClick={() => signOut({ callbackUrl: '/' })} className="text-cocoa"><LogOut className="w-5 h-5"/></button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h1 className="font-display text-3xl font-bold text-cocoa">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: '₹4,52,000', change: '+12.5%' },
                    { label: 'Total Orders', value: orders.length, change: '+5.2%' },
                    { label: 'Products', value: products.length, change: 'Active' },
                    { label: 'Customers', value: '1,240', change: '+18.1%' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-peachy">
                      <p className="text-sm font-medium text-cocoa/70 uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="flex items-end justify-between">
                        <h3 className="font-display text-3xl font-bold text-cocoa">{stat.value}</h3>
                        <span className="text-xs font-bold text-salmon bg-salmon/10 px-2 py-1 rounded-md">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-peachy h-96">
                  <h3 className="font-bold text-cocoa mb-6">Sales Analytics</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F2AFA3" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F2AFA3" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#C0A090" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#C0A090" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8C5BC" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#3D2B26', borderColor: '#3D2B26', color: '#FCDDD8', borderRadius: '8px' }}
                        itemStyle={{ color: '#F2AFA3' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#F2AFA3" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h1 className="font-display text-3xl font-bold text-cocoa">Products Management</h1>
                  <button className="bg-salmon text-cocoa px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-cocoa hover:text-blush transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-peachy overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-blush/50 text-cocoa/80 text-sm uppercase tracking-widest border-b border-peachy">
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Stock</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const images = JSON.parse(product.images)
                        return (
                          <tr key={product.id} className="border-b border-peachy/30 hover:bg-blush/20 transition-colors">
                            <td className="p-4 flex items-center gap-4">
                              <div className="relative w-12 h-16 rounded bg-blush overflow-hidden">
                                <Image src={images[0]} alt={product.name} fill className="object-cover" />
                              </div>
                              <span className="font-medium text-cocoa">{product.name}</span>
                            </td>
                            <td className="p-4 text-sm text-cocoa/80">{product.category.name}</td>
                            <td className="p-4 font-medium text-cocoa">₹{product.price}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="p-4 flex justify-end space-x-2">
                              <button className="p-2 text-cocoa/60 hover:text-salmon transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-2 text-cocoa/60 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Other tabs placeholders */}
            {(activeTab === 'orders' || activeTab === 'customers' || activeTab === 'settings') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-peachy"
              >
                <div className="text-center text-cocoa/50">
                  <h3 className="font-display text-2xl font-bold mb-2 capitalize">{activeTab} Module</h3>
                  <p>This module is under construction.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
