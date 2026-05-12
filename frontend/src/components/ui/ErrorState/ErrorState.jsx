const ErrorState = ({ message = 'Failed to load data. Please try again.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-red-400 text-base mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white
                     hover:border-gray-500 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
