import { onLogout } from "@/store/auth/auth.slice";
import { useAppDispatch } from "@/store/store";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";

const useAutoLogout = (timeoutMinutes = 10) => {
  const timer = useRef(null);
  const { logout } = useAuth0();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(onLogout());
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(handleLogout, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "click", "keydown", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer.current);
    };
  }, []);
};

export default useAutoLogout;
