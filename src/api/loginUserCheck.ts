import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const loginUserCheck = async () => {
  try {
    const res = await api.get("/users/getuser", {
      // 쿠키를 포함시키기 위해 필요
    });
    return res.data;
  } catch (e) {
    alert(e.response?.data?.message);
    console.log(e);
    return;
  }
};
