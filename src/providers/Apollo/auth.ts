const getToken = () => localStorage.getItem("token") || "";

export const auth = () => {
  const token = getToken();
  return {
    ...(token?.length && {
      authorization: getToken(),
    }),
  };
};
