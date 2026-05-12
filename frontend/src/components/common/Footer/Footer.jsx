import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok } from 'react-icons/fa';
import { getSiteSettings, getServices } from '../../../services/siteSettingsService';

const FALLBACK_SERVICES = [
  'Executive Networking', 'Business Consulting', 'Leadership Programs',
  'Strategic Partnerships', 'Member Events', 'CXO Roundtables',
];

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Membership', to: '/membership' },
  { label: 'Contact Us', to: '/contact' },
];

const SocialLink = ({ href, icon }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center
                 text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-600/20 transition-all duration-200"
    >
      {icon}
    </a>
  ) : null;

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
    getServices().then((data) => setServices((data || []).slice(0, 6))).catch(() => {});
  }, []);

  const social = settings?.socialLinks || {};
  const contactEmail = settings?.email || 'info@cxoglobalalliance.com';
  const phone1 = settings?.phone1 || '';
  const phone2 = settings?.phone2 || '';
  const address = settings?.officeAddress || '';
  const serviceNames = services.length > 0
    ? services.map((s) => s.title)
    : FALLBACK_SERVICES;

  return (
    <footer className="bg-gray-950 border-t border-blue-900/40">

      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                CXO
              </div>
              <span className="font-bold text-white text-lg tracking-wide">CXO Global Alliance</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A global network of C-Suite executives, founders and business leaders driving meaningful change.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <SocialLink href={social.facebook} icon={<FaFacebookF size={14} />} />
              <SocialLink href={social.linkedin} icon={<FaLinkedinIn size={14} />} />
              <SocialLink href={social.instagram} icon={<FaInstagram size={14} />} />
              <SocialLink href={social.tiktok} icon={<FaTiktok size={14} />} />
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {serviceNames.map((name) => (
                <li key={name}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {address && (
                <li className="flex items-start gap-3">
                  <FiMapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm leading-relaxed">{address}</span>
                </li>
              )}
              {phone1 && (
                <li className="flex items-center gap-3">
                  <FiPhone size={15} className="text-blue-400 flex-shrink-0" />
                  <a href={`tel:${phone1}`} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                    {phone1}
                  </a>
                </li>
              )}
              {phone2 && (
                <li className="flex items-center gap-3">
                  <FiPhone size={15} className="text-blue-400 flex-shrink-0" />
                  <a href={`tel:${phone2}`} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                    {phone2}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FiMail size={15} className="text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors break-all"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CXO Global Alliance. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-700">·</span>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
