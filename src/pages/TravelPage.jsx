import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import Header from "../components/layout/SubHeader";
import Footer from "../components/layout/MainFooter";
import loginState from "../atoms/loginState";
import NoReservation from "../components/travel/NoReservation";
import TravelCategory from "../components/travel/TravelCategory";
import TravelUpcomingCategory from "../components/travel/TravelUpcomingCategory";
import getTravelLoad from "../api/getTravelLoad";
import loading from "../assets/icons/loading.png";
import Select from 'react-select';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SelectDiv = styled.div`
  display: flex;
  justify-content: end;
  width: calc(100% - 30px);
  border: 1px solid #ddd;
  border-radius: 10px;
  margin: 10px auto 0;
  & > div {
    width: 100%;
    border-radius: 10px;
    > div {
      width: 100%;
      border-radius: 10px;
    }
  };
`
// react-select css
const selectCustom = {
  option: (provided, state) => {
    let backgroundColor = 'white';
    let color = '#333';
    if(state.isSelected){
        backgroundColor = '#F0586F';
        color = 'white';
    } else if(state.isFocused){
        backgroundColor = '#F07C8C';
        color = 'white';
    }
  return {
    ...provided,
    backgroundColor,
    color,
    padding: 20,
    border: "none",
    fontSize: "16px"
  }},
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: 'none',
    width: "220px",
    fontSize: "16px"
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    fontSize: "16px"
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333',
    fontSize: "16px"
  }),
};
const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
`;
const Title = styled.h1`
  font-size: 20px;
  line-height: 24px;
  margin: 25px 0 0 15px;
  width: 320px;
`;
const Loading_div = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 40%;
`
const Loading_img = styled.img`
    /* 회전 애니메이션 */
    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
`

const TravelPage = () => {
  // 로그인 상태 확인
  const loginUser = useRecoilValue(loginState);
  const navigate = useNavigate();
  // 페이지네이션 정의 (초기 1페이지만 지정함(perPage 수정은 server 에서 담당)
  const defaultPage = {
    page: 1,
    perPage: 0,
    total: 0,
    totalPage: 0,
  }
  const [upcomingPage, setUpcomingPage] = useState(defaultPage);
  const [pastPage, setPastPage] = useState(defaultPage);
  // 로딩 상태 정의
  const [isingLoading, setIsIngLoading] = useState(false);
  const [isPastLoading, setIsPastLoading] = useState(false);
  //오늘 날짜 기준으로 지난여행, 다가오는여행 상태 세팅
  const [pastTravelData, setPastTravelData] = useState([]);
  const [upcomingTravelData, setUpcomingTravelData] = useState([]);

  // react-select 에는 key 값이 없어서 미리 option 정의
  const option = [{value: "다가오는 여행", label: "다가오는 여행"},
                  {value: "지난 여행", label: "지난 여행"}];
  // react-select box value 설정하기 위함
  const [selectValue, setSelectValue] = useState(option[0]);

  // 첫 화면 진입 및 page 와 datalist read
  useEffect(() => {
    // page
    if(!localStorage.getItem('is_logined') || localStorage.getItem('is_logined') === "false"){
      navigate('/loginHome');
      return;
    }
    else {
      getTravelLoad.getReservePastPage({mymode: true})
      .then(res => {
        setPastPage(res || defaultPage);
      })
      .catch(e => {
        console.log(e);
      });
      getTravelLoad.getReserveUpcomingPage({mymode: true})
      .then(res => {
        setUpcomingPage(res || defaultPage);
      })
      .catch(e => {
        console.log(e);
      });
      // list
      getTravelLoad.getReservePastRead({nowpage: 1, mymode: true})
      .then(res => {
        setPastTravelData(res || []);
      })
      .catch(e => {
        console.log(e);
      });
      getTravelLoad.getReserveUpcomingRead({nowpage: 1, mymode: true})
      .then(res => {
        setUpcomingTravelData(res || []);
      })
      .catch(e => {
        console.log(e);
      });
      
      setIsIngLoading(true);
      setIsPastLoading(true);
    }
  },[selectValue]);

  // 현재 여행 페이지 컨트롤
  useEffect(() => {
    if(loginUser.is_logined){
      getTravelLoad.getReserveUpcomingRead({nowpage: upcomingPage.page, mymode: true})
      .then(res => {
        setUpcomingTravelData(res);
      })
      .catch(e => {
        console.log(e);
      });
      setIsIngLoading(true);
    }
  },[upcomingPage.page]);

  // 현재 여행 data 가 load 될 때 로딩 stop
  useEffect(() => {
    if(isingLoading){
        // 실제 로딩은 매우 빨라서 loading 이 보이지 않아 최소 시간 0.15 초 정도는 로딩화면이 보이게 함.
        setTimeout(() => {
            setIsIngLoading(false);
        }, 150);
    }
  },[upcomingTravelData]);

  // 지난 여행 페이지 컨트롤
  useEffect(() => {
    if(loginUser.is_logined){
      getTravelLoad.getReservePastRead({nowpage: pastPage.page, mymode: true})
      .then(res => {
        setPastTravelData(res);
      })
      .catch(e => {
        console.log(e);
      });
      setIsPastLoading(true);
    }
  },[pastPage.page]);

  // 지난 여행 data 가 load 될 때 로딩 stop
  useEffect(() => {
    if(isPastLoading){
        // 실제 로딩은 매우 빨라서 loading 이 보이지 않아 최소 시간 0.15 초 정도는 로딩화면이 보이게 함.
        setTimeout(() => {
            setIsPastLoading(false);
        }, 150);
    }
  },[pastTravelData]);

  // 지난 여행 또는 다가오는 여행 선택지
  const onChangeSelect = (e) => {
    setSelectValue(e);
  };


  return (
    <>
      <Header user={loginUser} />
      <motion.div 
      initial={{ opacity: 0, position: 'relative', left: '100%' }}
      animate={{ opacity: 1, position: 'relative', left: '0' }}
      transition={{ duration: 0.3 }}>
        <SelectDiv>
          <Select styles={selectCustom} options={option} onChange={onChangeSelect} value={selectValue} />
        </SelectDiv>
        
        <MainContainer>
        <Container style={selectValue.value === "다가오는 여행" ? {display:"block"} : {display:"none"}}>
          <Title>다가오는 여행</Title>
          {isingLoading &&
            <Loading_div>
            <Loading_img src={loading} style={{animation: "spin 0.5s 3 linear"}} />
            </Loading_div>
          ||
            <TravelUpcomingCategory setSelectValue={setSelectValue} upcomingPage={upcomingPage} setUpcomingPage={setUpcomingPage} title="다가오는 여행" upcomingTravelData={upcomingTravelData} noReservation={<NoReservation />}/>
          }
        </Container>
        <Container style={selectValue.value === "지난 여행" ? {display:"block"} : {display:"none"}}>
          <Title>지난 여행</Title>
          {isPastLoading &&
            <Loading_div>
              <Loading_img src={loading} style={{animation: "spin 0.5s 3 linear"}} />
            </Loading_div>
          ||
            <TravelCategory pastPage={pastPage} setPastPage={setPastPage} title="지난 여행" pastTravelData={pastTravelData} noReservation={<NoReservation />}/>
          }
        </Container>
        </MainContainer>
      </motion.div>
      <Footer user={loginUser} />
    </>
  );
};

export default TravelPage;
