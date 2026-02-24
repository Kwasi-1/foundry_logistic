/* eslint-disable react-hooks/exhaustive-deps */
import { onLogout, onUpdateAuthSlice } from "@/store/features/auth.slice";
import { RootState, useAppDispatch } from "@/store/store";
import { jwtDecode } from "jwt-decode";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useSession = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: [`user-session`],
    queryFn: async () => {
      return {};
    },
    enabled: !isEmpty(token?.refresh),
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const data: any = query.state.data;
      const { user } = Object(data || {});
      const expiresIn = user?.expiresIn * 1000;
      return expiresIn ? expiresIn - 60000 : false;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const data: any = query.data;
      const { user } = Object(data);
      if (!user) return;
      const decoded: any = jwtDecode(user.accessToken);

      dispatch(
        onUpdateAuthSlice({
          isAuthenticated: true,
          token: {
            access: user.accessToken,
            refresh: user.refreshToken,
            expiresIn: user.expiresIn,
          },
          organization: user.organization,
          userInfo: {
            id: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
            permissions: decoded.permissions,
          },
        }),
      );
    }
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) {
      const error: any = query.error;
      const errorMessage = error?.response?.data?.message || error?.message;
      const payload = error?.config?.data ? JSON.parse(error.config.data) : {};

      if (payload?.refreshToken !== token?.refresh) return;

      if (["Unknown or invalid refresh token."].includes(errorMessage)) {
        toast.error("session expired");
        dispatch(onLogout());
        navigate("/");
      }
    }
  }, [query.isError, query.error, dispatch, navigate, token?.refresh]);
};

export default useSession;
