import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export default function Footer() {
  const { shop } = useShop();

  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">{shop?.name}</h3>
          {shop?.address && <p className="text-sm">{shop.address}</p>}
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-sm">
            {shop?.contact_number && (
              <li>📞 {shop.contact_number}</li>
            )}
            {shop?.whatsapp_number && (
              <li>
                <a
                  href={`https://wa.me/${shop.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  💬 WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} {shop?.name}. All rights reserved.
      </div>
    </footer>
  );
}
