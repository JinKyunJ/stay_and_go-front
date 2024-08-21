import api from "../util/axiosInstance"; // axios 대신 api를 임포트

/** 이메일 인증번호 전송 API 함수 */
export async function sendEmailCertification(email: string) {
  try {
    const response = await api.post("http://localhost:3000/users/verify", {
      email,
    });

    if (response.status === 200) {
      return response.data; // 변수에 할당하지 않고 데이터 반환
    } else {
      alert("이메일 인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      throw new Error(response.data.message || "이메일 인증번호 전송 실패");
    }
  } catch (error) {
    alert("오류가 발생했습니다. 나중에 다시 시도해주세요");
    console.error(error);
  }
}

/** 이메일 인증번호 확인 API 함수 */
export async function certificationCode(email: string, code: string) {
  try {
    const response = await api.post("http://localhost:3000/users/verify/confirm", {
      email,
      code,
    });

    if (response.status === 200) {
      return response.data; // 변수에 할당하지 않고 데이터 반환
    } else {
      alert("이메일 인증번호 확인에 실패했습니다. 다시 시도해주세요.");
      throw new Error(response.data.message || "이메일 인증번호 확인 실패");
    }
  } catch (error) {
    alert("오류가 발생했습니다. 나중에 다시 시도해주세요");
    console.error(error);
  }
}
