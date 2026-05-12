const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`rounded-xl overflow-hidden bg-gray-800 animate-pulse ${className}`}>
      <div className="h-52 bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
