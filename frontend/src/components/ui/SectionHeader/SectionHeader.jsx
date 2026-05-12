const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-5 flex justify-center">
        <span className="block w-14 h-1 bg-blue-500 rounded-full"></span>
      </div>
    </div>
  );
};

export default SectionHeader;
