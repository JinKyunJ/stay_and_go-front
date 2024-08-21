import api from "../../util/axiosInstance"; // axios 대신 api를 임포트
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, MouseEvent, FormEvent } from "react";

const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
  & + div {
    margin-top: 10px;
  }
`;

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

const LinkUl = styled.ul`
  text-align: center;
  padding: 15px 0;
`;

const LinkLi = styled.li`
  display: inline-block;
  font-size: 12px;
  color: 666;
  margin: 0 5px;
`;

const SubmitBtn = styled.button`
  background: #f87878;
  color: #fff;
  font-size: 16px;
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 15px;
  &:disabled {
    border-color: #ccc;
    background: #ccc;
  }
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

const Findpassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const emailRequestBtn = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const onEmailRequestHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post<{ message: string }>("/users/verify/findpw", { email });
      if (emailRequestBtn.current) {
        e.target.disabled = true;
      }
      alert(response.data.message);
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  // 이메일 인증 확인 버튼 클릭 시
  const onEmailCheckHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post<{ code: number; message: string }>("/users/verify/confirm", { email, secret: code });
      if (res.data.code === 200) {
        navigate("/changePassword", { state: { email } });
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={onEmailCheckHandler}>
      <FlexDiv>
        <LoginInput
          type="email"
          placeholder="이메일"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <RequestBtn onClick={onEmailRequestHandler} ref={emailRequestBtn}>
          인증요청
        </RequestBtn>
      </FlexDiv>
      <FlexDiv>
        <LoginInput
          type="text"
          placeholder="인증번호"
          value={code}
          required
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
      </FlexDiv>
      <LinkUl>
        <LinkLi>
          <Link to="/findId">아이디 찾기</Link>
        </LinkLi>
        |
        <LinkLi>
          <Link to="/login">로그인 하기</Link>
        </LinkLi>
      </LinkUl>
      <SubmitBtn type="submit">인증확인</SubmitBtn>
      <JoinBox>
        아직 회원이 아니세요?
        <Link to="/join">회원가입</Link>
      </JoinBox>
    </form>
  );
};

export default Findpassword;
