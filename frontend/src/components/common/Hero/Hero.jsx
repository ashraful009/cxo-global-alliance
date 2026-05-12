import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHeroSettings } from '../../../services/siteSettingsService';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getHeroSettings();
        if (data) {
          setHeroData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch hero settings:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-[70px]">
        <div className="text-center w-full max-w-4xl px-4 space-y-6">
          <div className="h-16 bg-gray-700/50 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-700/50 rounded lg w-full mx-auto animate-pulse mt-6"></div>
          <div className="h-6 bg-gray-700/50 rounded lg w-5/6 mx-auto animate-pulse"></div>
          <div className="flex justify-center gap-4 mt-10">
            <div className="h-14 w-40 bg-gray-700/50 rounded-md animate-pulse"></div>
            <div className="h-14 w-40 bg-gray-700/50 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback defaults if API fails or returns no data
  const text = heroData?.heroText || "Welcome to CXO Global Alliance";
  const subtext = heroData?.heroSubtext || "Connect · Collaborate · Lead";
  const mediaType = heroData?.heroMediaType || "image";
  const mediaUrl = heroData?.heroMediaUrl || "";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F172A] overflow-hidden pt-[70px]">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full z-0">
        {mediaType === 'video' && mediaUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : mediaType === 'image' && mediaUrl ? (
          <img
            src={mediaUrl}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-[#0A0F1E]"></div>
        )}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-[fadeInUp_1s_ease-out]">
          {text}
        </h1>
        
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-white max-w-3xl font-light leading-relaxed mb-10 animate-[fadeInUp_1s_ease-out_0.3s_both]">
          {subtext}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-[fadeInUp_1s_ease-out_0.6s_both]">
          <Link
            to="/membership"
            className="w-full sm:w-auto px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
          >
            Join Us
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-[#0A0F1E] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
