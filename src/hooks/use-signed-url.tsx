import { useMemo } from "react";
import usePosSASToken from "./use-pos-token";
import useSASToken from "./use-sas-token";

export const useSignedImageUrl = (imageUrl?: string) => {
  const isErpImage = imageUrl?.includes("erpapiprod.blob.core.windows.net");

  const { data: posSasToken } = usePosSASToken();
  const { data: sasToken } = useSASToken();

  const signedImageUrl = useMemo(() => {
    if (!imageUrl) return undefined;

    const token = isErpImage ? posSasToken : sasToken;

    return `${imageUrl}${token}`;
  }, [imageUrl, isErpImage, posSasToken, sasToken]);

  return signedImageUrl;
};
