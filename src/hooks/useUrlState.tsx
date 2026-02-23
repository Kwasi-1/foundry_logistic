import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const appendQuery = useCallback(
    (key: string, value: string) => {
      searchParams.set(key, value);
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const deleteQuery = useCallback(
    (key: string) => {
      searchParams.delete(key);
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const getQueryValue = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  return {
    appendQuery,
    deleteQuery,
    getQueryValue,
  };
};

export default useUrlState;
