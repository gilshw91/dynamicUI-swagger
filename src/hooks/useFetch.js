import { useState, useEffect } from "react";

export const useFetch = (
  url,
  options = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  }
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
          let msg = `${res.message} [${res.status}]`;
          switch (res.status) {
            case 404:
              msg = "Not Found";
              break;
            default:
              break;
          }
          setError(msg);
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
    if (url) {
      doFetch();
    } else {
      setError(null);
      setResponse(null);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options), url]);
  return { response, error, loading };
};
