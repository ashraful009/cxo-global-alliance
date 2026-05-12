import { getAllFacilities } from '../../../services/facilityService';
import useFetch from '../../../hooks/useFetch';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import SkeletonCard from '../../ui/SkeletonCard/SkeletonCard';

const FacilitiesSection = () => {
  const { data, loading, error } = useFetch(getAllFacilities);
  const facilities = data || [];

  if (loading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="h-10 bg-gray-800 animate-pulse rounded w-56 mx-auto mb-3"></div>
            <div className="h-5 bg-gray-800 animate-pulse rounded w-72 mx-auto mb-5"></div>
            <div className="flex justify-center">
              <div className="h-1 bg-gray-800 animate-pulse rounded w-14"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Facilities Overview" subtitle="Everything you need under one roof" />
          <p className="text-center text-red-400 mt-2">Failed to load data. Please try again.</p>
        </div>
      </section>
    );
  }

  if (facilities.length === 0) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Facilities Overview" subtitle="Everything you need under one roof" />
          <p className="text-center text-gray-500 mt-2">No facilities available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          title="Facilities Overview"
          subtitle="Everything you need under one roof"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                         hover:border-blue-500/50 group"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 mb-4 group-hover:bg-blue-400 transition-colors"></div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">{facility.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{facility.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FacilitiesSection;
