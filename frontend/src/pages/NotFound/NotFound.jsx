import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';

const NotFound = () => {
  useEffect(() => { document.title = '404 | CXO Global Alliance'; }, []);
  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 pt-[70px] flex flex-col items-center justify-center px-4">
        <p className="text-8xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 text-sm mb-8 text-center max-w-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium
                     text-sm transition-colors duration-200"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
