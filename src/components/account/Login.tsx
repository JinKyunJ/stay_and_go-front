import api from "../../util/axiosInstance"; // axios 대신 api를 임포트
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import React, { FormEvent, useState } from "react";
import CryptoJS from "crypto-js";

const LoginInput = styled.input`
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

const LinkUl = styled.ul`
  text-align: center;
  padding: 15px 0;
`;

const LinkLi = styled.li`
  display: inline-block;
  font-size: 12px;
  color: #666;
  margin: 0 5px;
`;

const LoginBtn = styled.button`
  background: #f87878;
  color: #fff;
  font-size: 16px;
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 15px;
  cursor: pointer;
`;

const JoinBox = styled.div`
  text-align: center;
  padding-top: 20px;
  & a {
    font-weight: bold;
    margin-left: 5px;
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const encryptPassword = (password: string, key: string): string => {
    const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
    return encryptedPassword;
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // password 를 백엔드에 보내 줄 때 aes-128 양방향 암호화 적용
      // 백엔드에서는 aes-128 을 복호화하고 sha-256 해시화하여 db sha-256 해시 값과 비교시킨다.
      const key = `${process.env.REACT_APP_AES_KEY}`;
      const aesPassword = encryptPassword(password, key);

      const response = await api.post(
        "/login",
        { email, password: aesPassword },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );
      // 여행, 등록숙소 페이지에서 새로고침 시 로그인 상태 확인용 localstorage data 추가
      // : front 에서 강제로 localstorage 를 수정하더라도 그 때는 전역 상태 loginstate 에 저장된 값에 따라
      // 데이터를 출력하기 때문에 빈 값이 나오도록 함.
      localStorage.setItem("is_logined", "true");
      window.location.href = "/";
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <LoginInput
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <LoginInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <LinkUl>
        <LinkLi>
          <Link to="/findId">아이디 찾기</Link>
        </LinkLi>
        |
        <LinkLi>
          <Link to="/findPassword">비밀번호 찾기</Link>
        </LinkLi>
      </LinkUl>
      <LoginBtn type="submit">로그인</LoginBtn>

      <JoinBox>
        아직 회원이 아니세요?
        <Link to="/join">회원가입</Link>
      </JoinBox>
    </form>
  );
};

export default Login;
