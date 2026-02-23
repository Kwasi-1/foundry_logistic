import { useLocation } from 'react-router-dom';

export const usePage = () => {
  const { pathname } = useLocation();

  return pathname.split('/').pop() || '';
};
