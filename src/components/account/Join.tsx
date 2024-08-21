import api from "../../util/axiosInstance"; // axios 대신 api를 임포트
import styled from "styled-components";
import React, { useState, useRef, useEffect, ChangeEvent, FormEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordRegex, PhoneNumberRegex } from "./Regex";
import { JoinUserInfo } from "../../model/user/user";
import CryptoJS from "crypto-js";

const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;
const RequestBtn = styled.button`
  color: #f87878;
  background: #fff;
  height: 50px;
  width: 120px;
  border: 1px solid #f87878;
  border-radius: 15px;
  &:disabled {
    color: #bbb;
    border-color: #ddd;
  }
  cursor: pointer;
`;

const JoinInput = styled.input`
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 15px;
  width: 100%;
  height: 50px;
  padding: 0 15px;
  ::placeholder {
    color: #666;
  }
  & + input {
    margin-top: 10px;
  }
`;
const JoinBtn = styled.button`
  background: #f87878;
  color: #fff;
  font-size: 16px;
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 15px;
  margin-top: 15px;
  cursor: pointer;
`;

const MessageDiv = styled.div`
  font-size: 12px;
  color: red;
  padding: 5px 0;
`;

const Join: React.FC = () => {
  const [userInfo, setUserInfo] = useState<JoinUserInfo>({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    phone: "",
    code: "",
    nickName: "",
  });
  const [passwordCheckError, setPasswordCheckError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordError2, setPasswordError2] = useState<string>("");

  const navigate = useNavigate();
  const emailCodeInput = useRef<HTMLInputElement>(null);
  const emailRequestBtn = useRef<HTMLButtonElement>(null);
  const emailOkBtn = useRef<HTMLButtonElement>(null);

  // 인풋 입력 시 상태 변경
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((userInfoObj) => {
      const inputName = e.target.name;
      let inputValue = e.target.value;

      if (inputName === "phone") {
        // 문자 입력 제거
        // 000-0000-0000 형태로 리턴
        inputValue = PhoneNumberRegex(inputValue);
      }

      if (inputName === "password") {
        if (inputValue.length > 0 && inputValue.length < 10) {
          setPasswordError("10자 이상 입력해주세요.");
        } else {
          setPasswordError("");

          /** 영문, 숫자, 특수문자(공백 제외) 포함 여부 확인 / 정규표현식 사용 */
          const [hasLetter, hasNumber, hasSpecialChar] = PasswordRegex(inputValue);
          const isValidCombination = [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length >= 2;
          // filter() 이용해서 각각 2개 이상 조합 참, 거짓인지 확인

          if (!isValidCombination) {
            setPasswordError2("영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합");
          } else {
            setPasswordError2("");
          }
        }
      }

      if (inputName === "passwordCheck") {
        if (userInfo.password !== inputValue) {
          setPasswordCheckError("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordCheckError("");
        }
      }

      return { ...userInfoObj, [inputName]: inputValue };
    });
  };

  // password인풋 값 수정 시 passwordCheck 유효성 검사
  useEffect(() => {
    if (userInfo.password !== userInfo.passwordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckError("");
    }
  }, [userInfo]);

  const encryptPassword = (password: string, key: string): string => {
    const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
    return encryptedPassword;
  };

  //회원가입 완료 버튼 클릭 시
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!userInfo.nickName || userInfo.nickName.length < 2) {
        alert("닉네임을 2 글자 이상 입력해주세요.");
        return;
      }

      if (!!passwordCheckError || !!passwordError2 || !!passwordError) {
        alert("비밀번호를 확인해주세요.");
        return false;
      }

      // password 를 백엔드에 보내 줄 때 aes-128 양방향 암호화 적용
      // 백엔드에서는 aes-128 을 복호화하고 sha-256 해시화하여 db sha-256 해시 값과 비교시킨다.
      const key = `${process.env.REACT_APP_AES_KEY}`;
      const aesPassword = encryptPassword(userInfo.password, key);

      await api
        .post("/users", {
          email: userInfo.email,
          password: aesPassword,
          name: userInfo.name,
          nickname: userInfo.nickName,
          phone: userInfo.phone,
        })
        .then((res) => {
          navigate("/joinEnd");
        })
        .catch((e) => {
          alert(e?.response?.data?.message);
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message);
    }
  };

  // 이메일 요청 버튼 클릭 시
  const onEmailRequestHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/verify", {
        email: userInfo.email,
      });
      if (response.data.code == 200) {
        if (emailRequestBtn.current && emailCodeInput.current) {
          e.target.disabled = true;
          emailCodeInput.current.readOnly = false;
        }
      }
      alert(response.data.message);
      // 이메일 인증 요청 시 버튼 비활성화
    } catch (error) {
      e.target.disabled = false;
      alert(error?.response?.data?.message);
    }
  };

  // 이메일 인증 확인 버튼 클릭 시
  const onEmailCheckHandler = async (e) => {
    try {
      const response = await api.post("/users/verify/confirm", {
        email: userInfo.email,
        secret: userInfo.code,
      });
      // 이메일 인증 요청 시 버튼 비활성화
      if (emailOkBtn.current && emailCodeInput.current) {
        e.target.disabled = true;
        emailCodeInput.current.readOnly = true;
        emailOkBtn.current.style.cursor = "default";
      }
      alert(response.data.message);
    } catch (error) {
      //emailRequestBtn.current.disabled = false;
      e.target.disabled = false;
      alert(error?.response?.data?.message); // 확인 !!
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <FlexDiv>
        <JoinInput
          type="email"
          placeholder="이메일"
          name="email"
          value={userInfo.email}
          onChange={(e) => {
            onChangeHandler(e);
          }}
          required
        />
        <RequestBtn type="button" onClick={onEmailRequestHandler} ref={emailRequestBtn}>
          인증요청
        </RequestBtn>
      </FlexDiv>
      <FlexDiv>
        <JoinInput
          type="text"
          placeholder="인증번호"
          name="code"
          value={userInfo.code}
          onChange={(e) => {
            onChangeHandler(e);
          }}
          ref={emailCodeInput}
          required
        />
        <RequestBtn type="button" onClick={onEmailCheckHandler} ref={emailOkBtn}>
          인증확인
        </RequestBtn>
      </FlexDiv>

      <JoinInput
        type="text"
        placeholder="이름"
        name="name"
        value={userInfo.name}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        required
      />

      <JoinInput
        type="password"
        placeholder="비밀번호"
        name="password"
        value={userInfo.password}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        required
      />
      {passwordError && <MessageDiv>{passwordError}</MessageDiv>}
      {passwordError2 && <MessageDiv>{passwordError2}</MessageDiv>}

      <JoinInput
        type="password"
        placeholder="비밀번호 확인"
        name="passwordCheck"
        value={userInfo.passwordCheck}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        required
      />
      {passwordCheckError && <MessageDiv>{passwordCheckError}</MessageDiv>}

      <JoinInput
        type="text"
        placeholder="휴대폰번호"
        name="phone"
        maxLength={13}
        // 정규표현식 사용으로 value값에 undefined가 들어가는 경우가 있어 undefined일 경우 빈 문자열을 값으로 가진다.
        value={userInfo.phone || ""}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        required
      />
      <JoinInput
        type="text"
        placeholder="닉네임"
        name="nickName"
        value={userInfo.nickName}
        onChange={(e) => {
          onChangeHandler(e);
        }}
      />
      <JoinBtn type="submit">가입하기</JoinBtn>
    </form>
  );
};

export default Join;
