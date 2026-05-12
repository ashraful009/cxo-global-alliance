import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiUsers, FiStar, FiAward, FiTrendingUp, FiShield,
} from 'react-icons/fi';
import Layout from '../../components/common/Layout/Layout';
import PageBanner from '../../components/ui/PageBanner/PageBanner';

const WHO_CAN_JOIN = [
  {
    icon: <FiTrendingUp size={22} />,
    title: 'C-Level Executives',
    description: 'CEOs, COOs, CFOs, CTOs and other C-Suite leaders driving organizational excellence.',
  },
  {
    icon: <FiStar size={22} />,
    title: 'Founders & Co-Founders',
    description: 'Visionary entrepreneurs who have built and scaled successful ventures.',
  },
  {
    icon: <FiBriefcase size={22} />,
    title: 'Managing Directors',
    description: 'Senior executives responsible for leading and managing key business operations.',
  },
  {
    icon: <FiUsers size={22} />,
    title: 'Business Owners',
    description: 'Established business owners with proven track records of success.',
  },
  {
    icon: <FiAward size={22} />,
    title: 'Senior Directors',
    description: 'Senior-level directors and VP-level professionals shaping industry direction.',
  },
  {
    icon: <FiShield size={22} />,
    title: 'Board Members',
    description: 'Experienced board members contributing strategic oversight and governance.',
  },
];

const MEMBERSHIP_TYPES = [
  {
    title: 'General Member',
    tag: 'Standard',
    tagColor: 'bg-gray-700 text-gray-300',
    borderColor: 'border-gray-700 hover:border-gray-500',
  },
  {
    title: 'Life Member',
    tag: 'Premium',
    tagColor: 'bg-blue-600/30 text-blue-300',
    borderColor: 'border-blue-800/50 hover:border-blue-500',
  },
];

const Membership = () => {
  useEffect(() => {
    document.title = 'Membership | CXO Global Alliance';
  }, []);

  return (
    <Layout>
      <div className="bg-gray-950 min-h-screen pt-[70px]">

        <PageBanner
          title="Membership"
          subtitle="Join our exclusive network of global business leaders"
        />

        {/* Who Can Join */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Who Can Join?</h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto">
                CXO Global Alliance is open to senior business leaders who meet the following criteria.
              </p>
              <span className="block w-12 h-1 bg-blue-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHO_CAN_JOIN.map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6
                             hover:border-blue-500/40 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-11 h-11 bg-blue-600/15 rounded-xl flex items-center justify-center mb-4
                                  group-hover:bg-blue-600/25 transition-colors">
                    <span className="text-blue-400">{item.icon}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Membership Plans</h2>
              <span className="block w-12 h-1 bg-blue-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {MEMBERSHIP_TYPES.map((plan) => (
                <div
                  key={plan.title}
                  className={`bg-gray-950 border rounded-2xl p-8 text-center
                               transition-all duration-300 ${plan.borderColor}`}
                >
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${plan.tagColor}`}>
                    {plan.tag}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-4">{plan.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">Details coming soon</p>
                  <div className="border-t border-gray-800 pt-5">
                    <p className="text-gray-500 text-xs">
                      Contact us for current membership fees and benefits
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interested in Joining?
            </h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              Take the next step toward joining our exclusive network of global business leaders.
              Reach out to us to learn more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white
                           font-semibold rounded-xl transition-colors duration-200 text-sm"
              >
                Contact Us
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3 border border-gray-700 hover:border-gray-500
                           text-gray-300 hover:text-white font-semibold rounded-xl transition-colors
                           duration-200 text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Membership;
