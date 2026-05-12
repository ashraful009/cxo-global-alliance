import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteSettings } from '../../../services/siteSettingsService';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi';

const ContactCTA = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setContactInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 bg-white/20 animate-pulse rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-8 bg-white/20 animate-pulse rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  const phone1 = contactInfo?.phone1;
  const email = contactInfo?.email;
  const address = contactInfo?.officeAddress;
  const socialLinks = contactInfo?.socialLinks || {};

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-blue-100 mb-8">
              Have questions? We'd love to hear from you. Reach out to us and let's start a conversation.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all"
            >
              Send us a Message
            </Link>
          </div>

          {/* Right Side - Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            {phone1 && (
              <div className="flex items-start gap-4">
                <FiPhone className="w-6 h-6 mt-1 flex-shrink-0 text-blue-200" />
                <div>
                  <p className="font-semibold text-lg">Phone</p>
                  <a
                    href={`tel:${phone1}`}
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    {phone1}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex items-start gap-4">
                <FiMail className="w-6 h-6 mt-1 flex-shrink-0 text-blue-200" />
                <div>
                  <p className="font-semibold text-lg">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
            )}

            {/* Address */}
            {address && (
              <div className="flex items-start gap-4">
                <FiMapPin className="w-6 h-6 mt-1 flex-shrink-0 text-blue-200" />
                <div>
                  <p className="font-semibold text-lg">Address</p>
                  <p className="text-blue-100">{address}</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {(socialLinks.facebook || socialLinks.linkedin || socialLinks.instagram) && (
              <div className="flex gap-4 pt-4 border-t border-blue-400">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FiFacebook size={24} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin size={24} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <FiInstagram size={24} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
