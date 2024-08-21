import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const findIDUser = async (name: string, phone: string) => {
  try {
    const res = await api.post("/users/findid", {
      name: name,
      phone: phone,
    });
    return res;
  } catch (e) {
    alert(e.response?.data?.message);
    console.log(e);
    return;
  }
};
