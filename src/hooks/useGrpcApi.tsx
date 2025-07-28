import { useState } from "react";
import {
  FinishedUnaryCall,
  RpcError,
  type UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.ts";
import { BaseResponse } from "../../pb/common/base_response.ts";

interface GrpcBaseResponse {
  base?: BaseResponse;
}

interface CallApiArgs<T extends object, U extends GrpcBaseResponse> {
  useDefaultError?: boolean;
  defaultError?: (e: FinishedUnaryCall<T, U>) => void;
  useDefaultAuthError?: boolean;
  defaultAuthError?: (e: RpcError) => void;
}

export function useGrpcApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const callApi = async <T extends object, U extends GrpcBaseResponse>(
    api: UnaryCall<T, U>,
    args?: CallApiArgs<T, U>,
  ) => {
    try {
      setIsLoading(true);
      const res = await api;

      if (res.response.base?.isError ?? true) {
        throw res;
      }
      return res;
    } catch (error) {
      if (error instanceof RpcError) {
        if (error.code === "UNAUTHENTICATED") {
          if (args?.useDefaultAuthError ?? true) {
            logout();
            localStorage.removeItem("accessToken");
            Swal.fire({
              icon: "error",
              title: "Error",
              showConfirmButton: false,
            });
            navigate("/");
          }
          if (args?.useDefaultAuthError === false && args?.defaultAuthError) {
            args.defaultAuthError(error);
          }
          throw error;
        }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        args?.useDefaultError === false
      ) {
        if (args?.defaultError) {
          args.defaultError(error as FinishedUnaryCall<T, U>);
        }
      }

      if (args?.useDefaultError ?? true) {
        Swal.fire({
          title: "Gagal",
          text: "Login gagal, silakan coba beberapa saat lagi",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callApi,
    isLoading,
  };
}
