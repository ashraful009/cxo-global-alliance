import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout/Layout';
import { getFacilities } from '../../services/siteSettingsService';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getFacilities()
      .then((data) => setFacilities(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="bg-gray-950 pt-[70px] py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Facilities</h1>
            <p className="text-gray-400 text-lg max-w-3xl">
              Discover our world-class venues and infrastructure designed to support executive collaboration.
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-400 py-20">Failed to load facilities. Please try again later.</p>
          ) : facilities.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No facilities available at the moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md
                             hover:shadow-xl hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500 mb-4 group-hover:bg-blue-400 transition-colors" />
                  <h3 className="text-lg font-semibold text-white mb-3">{facility.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{facility.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Facilities;
