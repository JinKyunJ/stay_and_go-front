import styled from "styled-components";
import { Link } from "react-router-dom";
import loginState from "../../atoms/loginState";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";

const Container = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #EEEEEE;
`
const LeftArea = styled.div`
    width: 200px; 
    height: 50px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin-left: 10px;
`
const TextLogo = styled.p`
    font-size: 23px;
    font-family: "Playwrite BE VLG", sans-serif;
    font-weight: bold;
    color: #FF385C;
`
const RightArea = styled(LeftArea)`
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-right: 10px;
    margin-top: 20px;
`
const LinkDiv = styled.div`
    width: 80px;
    height: 30px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: white;
    transition: background-color 0.5s;

    &:hover{
        background-color: #FFEEF3;
    }
`

const LinkText = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: #FF385C;

    transition: color 0.5s;

    &:hover{
        color: #FF6F8C;
    }
`

const Header = () => {
    const setLoginUser = useSetRecoilState(loginState);
    const loginUser = useRecoilValue(loginState);

    console.log(loginUser);

    useEffect(() => {
        // server 에 getUser 요청 후 결과에 따라 값 부여 !
        // true
        setLoginUser({
            email: "gudrjsdn8825@naver.com",
            nickName: "건우",
            is_admin: false,
            is_logined: false
        });
        // false
        /*
        setLoginUser({
            email: "",
            nickName: "건우",
            is_admin: false,
            is_logined: false
        });
        */
    }, [])

    return (
        <Container>
            <LeftArea>
                <TextLogo>
                    stayandgo
                </TextLogo>
            </LeftArea>
            <RightArea>
                {loginUser.is_logined &&
                    <>
                        <LinkDiv><LinkText to={'/'}>숙소등록</LinkText></LinkDiv>
                        <LinkDiv><LinkText to={'/'}>로그아웃</LinkText></LinkDiv>
                    </>
                ||
                    <>
                        <LinkDiv><LinkText to={'/'}>로그인</LinkText></LinkDiv>
                    </>
                }
            </RightArea>
        </Container>
    )
}

export default Header;