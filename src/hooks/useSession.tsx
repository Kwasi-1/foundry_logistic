/* eslint-disable react-hooks/exhaustive-deps */
// import { mutateFn } from '@/services/mutation.api';
// import { onLogout, onUpdateAuthSlice } from '@/store/features/auth.slice';
import { onLogout, onUpdateAuthSlice } from '@/store/features/auth.slice';
import { RootState, useAppDispatch } from '@/store/store';
import { jwtDecode } from 'jwt-decode';
import { isEmpty } from 'lodash';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useSession = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useQuery({
    queryKey: [`user-session`],
    queryFn: async () => {
      return {};
    },
    onSuccess: (data) => {
      const { user } = Object(data);
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
        })
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message;

      const payload = JSON.parse(error?.config?.data);

      if (payload?.refreshToken !== token?.refresh) return;

      if (['Unknown or invalid refresh token.'].includes(errorMessage)) {
        toast.error('session expired');
        dispatch(onLogout());
        navigate('/');
      }
    },

    enabled: !isEmpty(token?.refresh),
    refetchOnWindowFocus: false,
    refetchInterval(data) {
      const { user } = Object(data);
      const expiresIn = user?.expiresIn * 1000;
      return expiresIn - 60000;
    },
    retry: false,
  });
};

export default useSession;
