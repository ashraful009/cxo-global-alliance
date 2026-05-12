import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../../services/siteSettingsService';
import { FiArrowRight } from 'react-icons/fi';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        if (data && data.length > 0) {
          setServices(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3 mb-12"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || services.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-600">Comprehensive solutions tailored for executive success</p>
          </div>
          <Link
            to="/services"
            className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View All Services
            <FiArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
            >
              {service.image && (
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center md:hidden">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Services
            <FiArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
