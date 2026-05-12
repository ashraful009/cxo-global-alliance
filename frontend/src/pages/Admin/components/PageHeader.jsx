const PageHeader = ({ title, buttonLabel, onButtonClick }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <h1 className="text-xl font-bold text-white">{title}</h1>
    {buttonLabel && (
      <button
        onClick={onButtonClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                   text-white text-sm font-semibold rounded-lg transition-colors duration-200"
      >
        + {buttonLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
