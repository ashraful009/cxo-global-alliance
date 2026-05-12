const StatCard = ({ icon, label, count, color = 'border-blue-500' }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4
                   border-l-4 ${color} hover:bg-gray-750 transition-colors`}>
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-white text-xl">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">
        {count === null || count === undefined ? (
          <span className="w-10 h-6 bg-gray-700 rounded animate-pulse inline-block" />
        ) : (
          count
        )}
      </p>
    </div>
  </div>
);

export default StatCard;
