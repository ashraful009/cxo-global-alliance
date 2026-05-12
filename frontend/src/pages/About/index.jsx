import { useEffect, useState } from 'react';
import { FiTarget, FiEye } from 'react-icons/fi';
import Layout from '../../components/common/Layout/Layout';
import PageBanner from '../../components/ui/PageBanner/PageBanner';
import { getSiteSettings } from '../../services/siteSettingsService';

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-emerald-600',
  'bg-orange-600', 'bg-rose-600', 'bg-teal-600',
];
const getAvatarColor = (name) =>
  AVATAR_COLORS[(name || 'P').charCodeAt(0) % AVATAR_COLORS.length];

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    document.title = 'About Us | CXO Global Alliance';
  }, []);

  useEffect(() => {
    getSiteSettings()
      .then((data) => setSettings(data || {}))
      .catch(() => setSettings({}));
  }, []);

  const mission = settings?.missionText || '';
  const vision = settings?.visionText || '';
  const presidentName = settings?.presidentName || '';
  const presidentDesignation = settings?.presidentDesignation || '';
  const presidentImage = settings?.presidentImage || '';
  const presidentMessage = settings?.presidentMessage || '';

  return (
    <Layout>
      <div className="bg-gray-950 min-h-screen pt-[70px]">

        <PageBanner
          title="About Us"
          subtitle="Learn about our mission, vision and leadership"
        />

        {/* Mission & Vision */}
        {(mission || vision) && (
          <section className="py-20 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Mission & Vision</h2>
                <span className="block w-12 h-1 bg-blue-500 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission */}
                {mission && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8
                                  hover:border-blue-500/40 transition-colors duration-300 group">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-5">
                      <FiTarget size={22} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-gray-400 leading-relaxed">{mission}</p>
                  </div>
                )}

                {/* Vision */}
                {vision && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8
                                  hover:border-blue-500/40 transition-colors duration-300 group">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-5">
                      <FiEye size={22} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                    <p className="text-gray-400 leading-relaxed">{vision}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* President's Message */}
        {presidentMessage && (
          <section className="py-20 bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">

                {/* Photo */}
                <div className="flex-shrink-0">
                  {presidentImage ? (
                    <img
                      src={presidentImage}
                      alt={presidentName}
                      className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover ring-4 ring-gray-700"
                    />
                  ) : (
                    <div
                      className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center
                                  text-white text-5xl font-bold ring-4 ring-gray-700 select-none
                                  ${getAvatarColor(presidentName)}`}
                    >
                      {(presidentName || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
                    President&apos;s Message
                  </p>
                  <blockquote className="relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-blue-500/20 font-serif leading-none select-none">
                      &ldquo;
                    </span>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic pl-4">
                      {presidentMessage}
                    </p>
                  </blockquote>
                  {presidentName && (
                    <div className="mt-6 pl-4">
                      <p className="text-white font-bold text-base">{presidentName}</p>
                      {presidentDesignation && (
                        <p className="text-gray-500 text-sm">{presidentDesignation}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Executive Committee Placeholder */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Executive Committee 2025–2027
              </h2>
              <span className="block w-12 h-1 bg-blue-500 rounded-full mx-auto" />
            </div>

            <div className="max-w-md mx-auto bg-gray-900 border border-gray-800 border-dashed
                            rounded-2xl p-12 text-center">
              <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiTarget size={22} className="text-gray-500" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our executive committee details will be available soon.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default About;
