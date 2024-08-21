import api from "../util/axiosInstance"; // axios 대신 api를 임포트

export const myPostUpload = async (formData) => {
  try {
    const res = await api.post("/post/write", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // 쿠키를 포함시키기 위해 필요
    });
    return res;
  } catch (e) {
    alert(e.response?.data?.message);
    console.log(e);
    return;
  }
};
