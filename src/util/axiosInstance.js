import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // .env 파일에 정의된 API URL을 기본 URL로 설정
  withCredentials: true, // 쿠키를 포함하여 요청할 경우 사용
});

export default api;
