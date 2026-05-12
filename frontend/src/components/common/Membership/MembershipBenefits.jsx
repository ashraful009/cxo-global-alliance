import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteSettings } from '../../../services/siteSettingsService';
import { FiCheck } from 'react-icons/fi';

const MembershipBenefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const data = await getSiteSettings();
        if (data?.membershipBenefits && data.membershipBenefits.length > 0) {
          setBenefits(data.membershipBenefits);
        } else {
          // Default benefits if none configured
          setBenefits([
            {
              title: 'Exclusive Networking',
              description: 'Connect with top executives and industry leaders',
              icon: 'FiUsers',
            },
            {
              title: 'Premium Events',
              description: 'Access to exclusive executive sessions and conferences',
              icon: 'FiCalendar',
            },
            {
              title: 'Business Opportunities',
              description: 'Find partnerships and collaboration opportunities',
              icon: 'FiBriefcase',
            },
            {
              title: '24/7 Support',
              description: 'Dedicated support team available to assist members',
              icon: 'FiHeadphones',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch membership benefits:', err);
        // Set default benefits on error
        setBenefits([
          {
            title: 'Exclusive Networking',
            description: 'Connect with top executives and industry leaders',
          },
          {
            title: 'Premium Events',
            description: 'Access to exclusive executive sessions',
          },
          {
            title: 'Business Opportunities',
            description: 'Find partnerships and collaborations',
          },
          {
            title: '24/7 Support',
            description: 'Dedicated support team available',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Membership Benefits
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join CXO Global Alliance and unlock exclusive benefits designed for executive leaders.
          </p>
        </div>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors">
                <FiCheck className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/membership"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Learn More About Membership
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MembershipBenefits;
