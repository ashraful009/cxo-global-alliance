const EmptyState = ({ message = 'No items found.', icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && <div className="text-gray-600 mb-4 text-5xl">{icon}</div>}
      <p className="text-gray-500 text-base">{message}</p>
    </div>
  );
};

export default EmptyState;
