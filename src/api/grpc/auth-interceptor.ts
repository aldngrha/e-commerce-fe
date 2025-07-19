import {
  MethodInfo,
  NextUnaryFn,
  RpcInterceptor,
  RpcOptions,
} from "@protobuf-ts/runtime-rpc";

export const authInterceptor: RpcInterceptor = {
  interceptUnary(
    next: NextUnaryFn,
    method: MethodInfo,
    input: object,
    options: RpcOptions,
  ) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      options.meta = {
        ...options.meta,
        authorization: `Bearer ${accessToken}`,
      };
    }
    return next(method, input, options);
  },
};
