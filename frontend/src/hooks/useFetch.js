import { useState, useEffect, useRef } from 'react';

const useFetch = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fnRef = useRef(fetchFunction);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await fnRef.current();
        if (!cancelled) setData(result);
      } catch (err) {
        console.error('useFetch error:', err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
};

export default useFetch;
