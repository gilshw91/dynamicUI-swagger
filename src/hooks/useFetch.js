import { useState, useEffect } from 'react';

export const useFetch = (
  url,
  options = { headers: { Accept: 'application/json' } }
) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, options);

        if (res.status !== 200) {
          setError(`${res.message} [${res.status}]`);
        } else {
          const json = await res.json();
          setError(null);
          setResponse(json);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options), url]);
  return { response, error, loading };
};
