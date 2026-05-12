import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SliderArrow = ({ direction, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      className={`p-2.5 rounded-full border transition-all duration-200 focus:outline-none ${
        disabled
          ? 'border-gray-700 text-gray-700 cursor-not-allowed opacity-40'
          : 'border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400 hover:text-white'
      }`}
    >
      {direction === 'left' ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
    </button>
  );
};

export default SliderArrow;
