import { useEffect, useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok } from 'react-icons/fa';
import Layout from '../../components/common/Layout/Layout';
import PageBanner from '../../components/ui/PageBanner/PageBanner';
import { getSiteSettings, submitContactForm } from '../../services/siteSettingsService';
import { useToast } from '../../context/ToastContext';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

const SocialLink = ({ href, icon }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center
                 text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
    >
      {icon}
    </a>
  ) : null;

const ContactInfo = ({ icon, label, children }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-blue-600/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-blue-400">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
    </div>
  </div>
);

const Contact = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | CXO Global Alliance';
  }, []);

  useEffect(() => {
    getSiteSettings()
      .then((data) => setSettings(data || {}))
      .catch(() => setSettings({}));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) {
      e.message = 'Message is required';
    } else if (form.message.trim().length < 20) {
      e.message = 'Message must be at least 20 characters';
    }
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length > 0) { setErrors(e_); return; }

    setSubmitting(true);
    try {
      await submitContactForm(form);
      showToast('Message sent successfully! We will get back to you soon.', 'success');
      setForm(EMPTY_FORM);
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ name, label, required, type = 'text', rows }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={submitting}
          rows={rows}
          placeholder={`Enter your ${label.toLowerCase()}...`}
          className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white placeholder-gray-600
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                      resize-none disabled:opacity-60
                      ${errors[name] ? 'border-red-500' : 'border-gray-700'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={submitting}
          placeholder={`Enter your ${label.toLowerCase()}...`}
          className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white placeholder-gray-600
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                      disabled:opacity-60
                      ${errors[name] ? 'border-red-500' : 'border-gray-700'}`}
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  const social = settings?.socialLinks || {};

  return (
    <Layout>
      <div className="bg-gray-950 min-h-screen pt-[70px]">

        <PageBanner
          title="Contact Us"
          subtitle="We'd love to hear from you"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left — Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
              <p className="text-gray-400 text-sm mb-8">
                Fill out the form below and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Field name="name" label="Full Name" required />
                <Field name="email" label="Email" required type="email" />
                <Field name="subject" label="Subject" required />
                <Field name="message" label="Message" required rows={5} />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
                             text-white font-semibold py-3 rounded-lg transition-colors
                             flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Right — Office Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
              <p className="text-gray-400 text-sm mb-8">
                Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6">
                {settings?.officeAddress && (
                  <ContactInfo icon={<FiMapPin size={16} />} label="Office Address">
                    {settings.officeAddress}
                  </ContactInfo>
                )}

                {(settings?.phone1 || settings?.phone2) && (
                  <ContactInfo icon={<FiPhone size={16} />} label="Phone">
                    {settings.phone1 && (
                      <a href={`tel:${settings.phone1}`} className="hover:text-blue-400 transition-colors block">
                        {settings.phone1}
                      </a>
                    )}
                    {settings.phone2 && (
                      <a href={`tel:${settings.phone2}`} className="hover:text-blue-400 transition-colors block">
                        {settings.phone2}
                      </a>
                    )}
                  </ContactInfo>
                )}

                {settings?.email && (
                  <ContactInfo icon={<FiMail size={16} />} label="Email">
                    <a href={`mailto:${settings.email}`} className="hover:text-blue-400 transition-colors">
                      {settings.email}
                    </a>
                  </ContactInfo>
                )}

                <ContactInfo icon={<FiClock size={16} />} label="Working Hours">
                  Sunday – Thursday: 9AM – 6PM
                </ContactInfo>
              </div>

              {/* Social Links */}
              {(social.facebook || social.linkedin || social.instagram || social.tiktok) && (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-2">
                    <SocialLink href={social.facebook} icon={<FaFacebookF size={14} />} />
                    <SocialLink href={social.linkedin} icon={<FaLinkedinIn size={14} />} />
                    <SocialLink href={social.instagram} icon={<FaInstagram size={14} />} />
                    <SocialLink href={social.tiktok} icon={<FaTiktok size={14} />} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map embed */}
          <div className="mt-16">
            <div className="rounded-2xl overflow-hidden border border-gray-800 h-[350px]">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.157!2d90.4020!3d23.7935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70f574e49a7%3A0xb7b75e40d00e26b6!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale opacity-80"
              />
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Contact;
