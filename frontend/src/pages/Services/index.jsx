import { useEffect, useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import Layout from '../../components/common/Layout/Layout';
import PageBanner from '../../components/ui/PageBanner/PageBanner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ErrorState from '../../components/ui/ErrorState/ErrorState';
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard';
import { getServices } from '../../services/siteSettingsService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = 'Services | CXO Global Alliance';
  }, []);

  const fetchServices = () => {
    setLoading(true);
    setError(false);
    getServices()
      .then((data) => setServices(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  return (
    <Layout>
      <div className="bg-gray-950 min-h-screen pt-[70px]">

        <PageBanner
          title="Our Services"
          subtitle="Comprehensive solutions for executive growth and business excellence"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} className="h-80" />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={fetchServices} />
          ) : services.length === 0 ? (
            <EmptyState message="No services available at the moment." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden
                             transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl
                             hover:shadow-blue-950/20 group"
                >
                  {/* Image or placeholder */}
                  {service.image ? (
                    <div className="h-52 overflow-hidden bg-gray-800">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gray-800 flex items-center justify-center">
                      <FiBriefcase size={40} className="text-gray-600" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Services;
