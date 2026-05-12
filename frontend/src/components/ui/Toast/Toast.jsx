import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const STYLES = {
  success: { bar: 'bg-emerald-500', icon: <FiCheckCircle className="text-emerald-400" size={18} /> },
  error:   { bar: 'bg-red-500',     icon: <FiXCircle className="text-red-400" size={18} /> },
  info:    { bar: 'bg-blue-500',    icon: <FiInfo className="text-blue-400" size={18} /> },
};

const Toast = ({ message, type = 'info', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 3000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [onClose]);

  const { bar, icon } = STYLES[type] || STYLES.info;

  return (
    <div
      className={`flex items-start gap-3 bg-gray-800 border border-gray-700 text-white
                  px-4 py-3 rounded-lg shadow-2xl min-w-[280px] max-w-sm
                  transition-all duration-300
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${bar}`} />
      <span className="flex-shrink-0 mt-0.5">{icon}</span>
      <p className="flex-1 text-sm leading-snug">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors mt-0.5"
        aria-label="Close"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;
