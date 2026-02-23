/* eslint-disable react-hooks/exhaustive-deps */
import { onResetOrgDetails } from '@/store/features/accounting.setup.details';
import { onLogout } from '@/store/features/auth.slice';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

const useAutoLogout = (timeoutMinutes = 10) => {
  const timer = useRef(null);
  const { logout } = useAuth0();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(onLogout());
    dispatch(onResetOrgDetails());
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(handleLogout, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // start on mount

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer.current);
    };
  }, []);
};

export default useAutoLogout;
