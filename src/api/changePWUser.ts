import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const changePWUser = async (email: string, password: string) => {
  try {
    const res = await api.put("/users/", {
      email,
      password,
    });
    return res;
  } catch (e) {
    alert(e.response?.data?.message);
    console.log(e);
    return;
  }
};
