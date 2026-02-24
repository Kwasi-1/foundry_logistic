import { IDecoded } from "@/types";
import { queryFn } from "@/services/query.api";
import { onUpdateAuthSlice } from "@/store/features/auth.slice";
import store from "@/store/store";
import { variables } from "@/utils/env";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import useMutateApi from "@/hooks/useMutateApi";
import { useEffect } from "react";

type IUseQueryApi = Partial<{
  url: any;
  key: any;
  params: any;
  header: any;
  disabled?: boolean;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}>;

const useQueryApi = ({
  key,
  onSuccess,
  onError,
  params,
  url,
  header,
  disabled = false,
}: IUseQueryApi) => {
  const { mutateAsync: refreshToken } = useMutateApi({
    key: ["refresh"],
    url: variables().BASE_URL + "/auth/session/refresh",
    onSuccess(data) {
      const decoded: IDecoded = jwtDecode(data.access_token);
      const user = decoded.user_info;

      store.dispatch(
        onUpdateAuthSlice({
          isAuthenticated: true,
          token: {
            access: data.access_token,
            refresh: "",
            expiresIn: data.expires_in,
          },
          userInfo: {
            id: user.user_id,
            name: user.name,
            email: user.email,
          },
        }),
      );
    },
  });

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data }: any = await queryFn({
        params,
        header,
        url,
      });

      return data;
    },
    enabled: !disabled,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      onSuccess?.(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useEffect(() => {
    const handleError = async () => {
      if (query.isError && query.error) {
        const error: any = query.error;
        const responseData = error?.response?.data;
        const responseMessage = responseData?.message;

        if (["jwt expired"].includes(responseMessage)) {
          await refreshToken({
            refreshToken: store.getState().auth.token.refresh,
          });
        }

        onError?.(error);
      }
    };
    handleError();
  }, [query.isError, query.error, onError, refreshToken]);

  return query;
};

export default useQueryApi;


