const getToken = () => localStorage.getItem("token") || "";

export const auth = () => {
  const token = getToken();
  return {
    ...(token?.length && {
      Authorization: `Bearer ${token}`,
    }),
  };
};
