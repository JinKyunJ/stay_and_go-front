import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const allUserLoad = async () => {
  try {
    const res = await api.get("/users/alluserdata"); // axios.get 대신 api.get
    return res;
  } catch (e) {
    console.log(e);
    return;
  }
};
