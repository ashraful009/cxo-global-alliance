const STYLES = {
  upcoming: 'bg-green-500 text-white',
  closed: 'bg-red-500 text-white',
};

const LABELS = {
  upcoming: 'Upcoming',
  closed: 'Closed',
};

const Badge = ({ type }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${STYLES[type]}`}
    >
      {LABELS[type]}
    </span>
  );
};

export default Badge;
