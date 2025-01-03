export const ApiResponse = (
  message: string,
  success: boolean,
  data: any = null
) => {
  return {
    message,
    success,
    data,
  };
};
