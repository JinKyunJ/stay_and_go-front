import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const logoutUser = async () => {
  try {
    const res = await api.post(
      "/users/logout",
      {},
      {
        // 쿠키를 포함시키기 위해 필요
      },
    );
    return res;
  } catch (e) {
    alert(e.response?.data?.message);
    console.log(e);
    return;
  }
};
