import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-cocoa text-blush pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl font-bold tracking-wider mb-4">MANSVI</h3>
            <p className="text-sm text-peachy mb-6">
              Wear the Culture. Own the Grace. Premium Indian women&apos;s ethnic wear.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-salmon">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-sm text-peachy hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=kurtis" className="text-sm text-peachy hover:text-white transition-colors">Kurtis</Link></li>
              <li><Link href="/shop?category=anarkali" className="text-sm text-peachy hover:text-white transition-colors">Anarkalis</Link></li>
              <li><Link href="/shop?category=festive-wear" className="text-sm text-peachy hover:text-white transition-colors">Festive Wear</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-salmon">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-peachy hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sm text-peachy hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-sm text-peachy hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-sm text-peachy hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-salmon">Newsletter</h4>
            <p className="text-sm text-peachy mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="bg-transparent border border-peachy text-blush px-4 py-2 w-full focus:outline-none focus:border-salmon"
              />
              <button type="submit" className="bg-salmon text-cocoa px-4 py-2 font-medium uppercase text-sm hover:bg-peachy transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-peachy/30 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-peachy mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Mansvi Fashion. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-peachy">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
