const PageBanner = ({ title, subtitle, backgroundImage }) => {
  return (
    <div className="relative h-64 md:h-72 flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background */}
      {backgroundImage ? (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-950/75" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-gray-950 to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-4 flex justify-center">
          <span className="block w-12 h-1 bg-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
