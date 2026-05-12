import { useState, useEffect } from 'react';
import { getSiteSettings } from '../../../services/siteSettingsService';
import { FiUsers } from 'react-icons/fi';

const AboutSection = () => {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSiteData(data);
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const presidentImage = siteData?.presidentImage || 'https://via.placeholder.com/400x400';
  const presidentName = siteData?.presidentName || 'President Name';
  const presidentDesignation = siteData?.presidentDesignation || 'Designation';
  const presidentMessage = siteData?.presidentMessage || 'Welcome message from our president';
  const missionText = siteData?.missionText || 'Our mission';
  const visionText = siteData?.visionText || 'Our vision';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* President Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Image - Left */}
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg bg-gray-200">
              <img
                src={presidentImage}
                alt={presidentName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Message - Right */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">President's Message</h2>
            <p className="text-lg text-blue-600 font-semibold mb-6">{presidentDesignation}</p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{presidentName}</h3>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-6">
              {presidentMessage}
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="border-t pt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">Our Purpose</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <FiUsers className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <FiUsers className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {visionText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
