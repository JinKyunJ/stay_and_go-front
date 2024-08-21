import api from "../../util/axiosInstance"; // axios 대신 api를 임포트
import React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styled from "styled-components";
import SlideUpModal from "../layout/SlideUpModal";
import KakaoMap from "../layout/KakaoMap";
import { SlideModal } from "../../atoms/modalAtom";
import loginState from "../../atoms/loginState";
import { tagArr } from "../../util/data/arrayStaticData";
import loading from "../../assets/icons/loading.png";
import kakaoBtnImg from "../../assets/icons/kakao_btn.png";
import { useScript } from "../../api/hooks";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  ContextImageData,
  CSSPropertiesExtended,
  WebpackRequireContext,
} from "../../model/main(with detail, upload)/mainTypes";

const SwiperDiv = styled.div`
  position: relative;
  background: #eee;
  height: 110vw;
  max-height: 700px;
  & .swiper {
    height: 100%;
  }
`;

const ImgDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  & img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  padding: 0 15px 80px;
`;

const Title = styled.h2`
  font-size: 20px;
  padding: 15px 30px 0 0;
  position: relative;
`;

const ShareBtn = styled.button`
  position: absolute;
  right: 0;
  top: 16px;
  padding: 0;
  border: 0;
  background: none;
  & svg {
    vertical-align: top;
  }
`;

const ShareModal = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  border-radius: 5px;
  background: #fff;
  padding: 10px 15px;
  box-sizing: border-box;
  z-index: 12;
  & button {
    border: 0;
    background: none;
    padding: 5px;
  }
  & p {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 2px;
    border-bottom: 1px solid #333;
    margin: 10px 0 10px;
  }
  & div {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  & div > button {
    padding: 0;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #ddd;
  }
  & svg,
  & img {
    vertical-align: top;
    width: 40px;
    height: 40px;
  }
`;
const ModalCloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10x;
  & svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalDim = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 11;
`;

const InfoText = styled.p`
  font-size: 16px;
  padding: 20px 0 0;
  margin: 0;
`;

const MainOptionBox = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 25px 0 0;
  padding: 20px 0 15px;
  border-top: 1px solid #ddd;
`;

const MainOption = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  font-size: 16px;
  & img {
    width: 24px;
    margin-right: 5px;
  }
`;

const RoomInfoDiv = styled.div`
  font-size: 16px;
  padding: 20px 0;
  border-top: 1px solid #ddd;

  & > p {
    font-size: 20px;
    margin: 0;
    padding-bottom: 15px;
  }

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }
  & > button {
    background: none;
    border: none;
    font-size: 16px;
    margin-top: 15px;
    padding: 0;
    text-decoration: underline;
  }
`;

const LocationDiv = styled.div`
  padding: 20px 0;
  border-top: 1px solid #ddd;
  & p {
    font-size: 20px;
    padding: 0 0 20px;
    margin: 0;
  }
`;

const Location = styled.div`
  border-radius: 15px;
  overflow: hidden;
  background: #eee;
  height: 60vw;
  max-height: 400px;
`;

const LocationText = styled.div`
  font-size: 16px;
  padding-top: 10px;
`;

const HostInfoDiv = styled.div`
  padding: 20px 0;
  border-top: 1px solid #ddd;
  & > p {
    font-size: 20px;
    padding-bottom: 20px;
    margin: 0;
  }
`;

const HostInfoBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  gap: 15px;
  & p {
    margin: 0;
    font-size: 16px;
  }
`;

const HostName = styled.div`
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 5px;
`;

const HostImg = styled.div`
  font-size: 36px;
  border-radius: 50%;
  border: 1px solid #ddd;
  width: 70px;
  height: 70px;
  text-align: center;
  line-height: 68px;
`;

const HostPhone = styled.a`
  text-decoration: underline;
  font-size: 16px;
  display: inline-block;
  margin-top: 3px;
  & svg {
    vertical-align: middle;
    margin-right: 5px;
  }
`;

const HostText = styled.div`
  font-size: 16px;
  padding: 10px 0 0 0;

  & > p {
    font-size: 20px;
    margin: 0;
    padding-bottom: 15px;
  }

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    padding: 0;
  }
  & > button {
    background: none;
    border: none;
    font-size: 16px;
    margin-top: 15px;
    padding: 0;
    text-decoration: underline;
  }
`;

const OrderBtnDiv = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px;
  background: #fff;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
  z-index: 1;
`;

const ReservationBtn = styled.button`
  font-size: 16px;
  padding: 0 15px;
  background: #f87878;
  color: #fff;
  height: 50px;
  border: 0;
  border-radius: 15px;
`;

const PriceDiv = styled.div`
  font-size: 16px;
  & p {
    font-size: 14px;
    margin: 0;
  }
`;

const Loading_div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-size: 18px;
`;
const Loading_img = styled.img`
  /* 회전 애니메이션 */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const RoomDetails = () => {
  const navigate = useNavigate();
  const setSlideModal = useSetRecoilState(SlideModal);
  const slideModal = useRecoilValue(SlideModal);
  const userState = useRecoilValue(loginState);
  const [roomInfo, setRoomInfo] = useState({
    title: "",
    contents: "",
    main_image: "",
    price: 0,
    sub_images: [""],
    max_adult: 0,
    max_child: 0,
    max_baby: 0,
    room_num: 0,
    main_location: "",
    category: [""],
    sub_location: "",
    author: { name: "", photo: "", email: "", nickname: "", phone: "" },
    host_intro: "",
  });
  const { id } = useParams();
  const sortedImages = useRef<ContextImageData[]>();
  const [query, setQuery] = useSearchParams();
  const [footerPrice, setFooterPrice] = useState(0);
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [moveup, setMoveup] = useState(0);

  let totalDate = useRef(0);
  const location = useLocation();
  // link를 타고 들어온 건지, 공유하기 링크를 타고 들어온건지 판단 state
  const [is_notLink, setIs_notLink] = useState(false);

  // kakao SDK 스크립트 로드 상태 확인
  const status = useScript("https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js");

  // kakao sdk 초기화하기
  // status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
  useEffect(() => {
    if (status === "ready" && window.Kakao && moveup === -1) {
      // 중복 initialization 방지
      if (!window.Kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY);
      }
    }
  }, [status]);

  // mainCatetory 디렉토리 이미지 가져오기
  const importImages = (v: WebpackRequireContext): ContextImageData[] => {
    return v.keys().map((key) => {
      const match = key.match(/[^/]+$/);
      return {
        src: v(key),
        name: match ? match[0] : "unknown", // 파일 이름만 추출
      };
    });
  };
  const images = importImages(
    require.context("../../assets/icons/mainCategory", false, /\.(png|jpe?g|gif)$/) as WebpackRequireContext,
  );
  // 파일 이름 순으로 정렬
  sortedImages.current = images.sort((a, b) => {
    const aNumber = parseInt(a.name.split("_")[0], 10);
    const bNumber = parseInt(b.name.split("_")[0], 10);
    return aNumber - bNumber;
  });

  const onOpenShareModal = () => {
    setIsOpenShareModal(true);
    // 모달 떠 있는 동안 바디 스크롤 막기
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style["touch-action"] = "none";
  };

  const onCloseShareModal = () => {
    setIsOpenShareModal(false);
    // 바디 스크롤
    document.body.style.height = "auto";
    document.body.style.overflow = "initial";
    document.body.style["touch-action"] = "initial";
  };

  // 주소 카카오톡에 공유
  const handleKakaoButton = () => {
    // 크롬 브라우저 > 개발자모드 > 모바일 설정 지원하지 않음
    if (window.Kakao && window.Kakao.Share && moveup === -1) {
      window.Kakao.Share.createDefaultButton({
        container: "#kakaoShareBtn",
        objectType: "feed",
        content: {
          title: roomInfo.title,
          description: roomInfo.contents.substring(0, 190) + "...",
          imageUrl: roomInfo.main_image,
          link: {
            // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "보러가기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true,
      });
    } else {
      console.error("Kakao SDK is not ready.");
    }
  };

  useEffect(() => {
    // 방 정보 가져오기
    (async () => {
      try {
        const response = await api.get(`/post/read/${id}`);
        const data = response.data.data;
        setRoomInfo(data);
      } catch (error) {
        console.error(error);
      }
    })();
    // location 객체를 useEffect를 통해 받고 해당 컴포넌트에 사용할 state에 set
    setIs_notLink(location.state ? location.state.is_notLink : false);
  }, [id]);

  useEffect(() => {
    // 검색 정보 가져오기
    if (query.get("adult") === "0") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setMoveup(1);
      return;
    }
    setMoveup(-1);
    const startDate = new Date(query.get("startDate") as string);
    const endDate = new Date(query.get("endDate") as string);

    // endDate와 startDate를 밀리초 단위의 타임스탬프로 변환
    const startDateTimestamp = startDate.getTime();
    const endDateTimestamp = endDate.getTime();

    totalDate.current = (endDateTimestamp - startDateTimestamp) / (1000 * 60 * 60 * 24);

    if (roomInfo) {
      setFooterPrice(Math.floor((roomInfo.price * totalDate.current) / 100) * 100);
    }
  }, [roomInfo, query]);

  useEffect(() => {
    if (moveup === 1) {
      alert("예약 정보를 설정해주세요.");
      navigate("/");
    }
  }, [moveup]);

  const onReservate = async () => {
    try {
      const response = await api.post(
        "/reserve/write",
        {
          post_nanoid: id,
          email: userState.email,
          amount: footerPrice,
          start_date: query.get("startDate"),
          end_date: query.get("endDate"),
          adult: query.get("adult"),
          child: query.get("child"),
          baby: query.get("baby"),
        },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );

      if (response.data.code === 200) {
        alert("예약이 완료되었습니다.");
        navigate("/travel");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // roomInfo가 null일 경우 로딩 상태를 표시
  if (!roomInfo) {
    return (
      <Loading_div>
        <Loading_img src={loading} style={{ animation: "spin 0.5s 3 linear" }} />
      </Loading_div>
    );
  }

  const customStyle: CSSPropertiesExtended = {
    "--swiper-pagination-bottom": "10px",
    "--swiper-theme-color": "#fff",
    "--swiper-pagination-bullet-inactive-color": "#fff",
    "--swiper-pagination-bullet-inactive-opacity": "0.4",
  };

  return (
    <>
      <SwiperDiv>
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            console.log(swiper.realIndex);
          }}
          onSwiper={(swiper) => {
            console.log(swiper.realIndex);
          }}
          pagination={{ clickable: true }}
          style={customStyle}
        >
          <SwiperSlide key={`slide0`}>
            <ImgDiv>
              <img src={roomInfo.main_image}></img>
            </ImgDiv>
          </SwiperSlide>
          {roomInfo.sub_images.map((img, i) => {
            return (
              <SwiperSlide key={`slide${i + 1}`}>
                <ImgDiv>
                  <img src={img}></img>
                </ImgDiv>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </SwiperDiv>

      <Container>
        <Title>
          [{roomInfo.title}]
          <ShareBtn type="button" style={{ cursor: "pointer" }} onClick={onOpenShareModal}>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#333">
              <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
            </svg>
          </ShareBtn>
          {isOpenShareModal && (
            <>
              <ModalDim />
              <ShareModal>
                <ModalCloseBtn style={{ cursor: "pointer" }} onClick={onCloseShareModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <rect width="20" height="20" fill="url(#pattern0_2_619)" />
                    <defs>
                      <pattern id="pattern0_2_619" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image0_2_619" transform="scale(0.0104167)" />
                      </pattern>
                      <image
                        id="image0_2_619"
                        width="96"
                        height="96"
                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAzVJREFUeF7t3O1t2zAUhWEKXCTdwIAWSDZpJykyiUdJBrAAb1ANYgGFCgkwAssiKV6ec9PTv3Z6xfcJ/SEr7oL+QQt00OkaHgQA/iUQgADABcDjtQMEAC4AHq8dIABwAfB47QABgAuAx2sHCABcADxeO0AA4ALg8doBAgAXAI/XDhAAuAB4vHbAdwc4nU4vMcbf0zS9X6/XEbzepPHLMX9M0/RmfcymO2BZyDmE8BpCGFssKKnwkzstx/xnuYv5MZsBfIm/Ltl8QUcAvsRvcswmABvxmyyoFGAjvvkxVwfYiW++oBKAnfimx1wdoO/7+TH/Z0IIioejxPjrcj6HYXhLWFvyXaoDrK8gQggvCUcBRciMP3Zd9+tyuXwmrCv5LtUB5skeEBjiz61MANgRWOKbArAiMMU3B2BDYIvfBIAFgTF+MwA0Amv8pgAoBOb4zQFaI7DHhwC0QvAQHwZgjeAlPhTACsFTfDhAbQRv8SkAaiF4jE8DcBTBa3wqgFKE+edijOtnuHungU1OKe8NfXa72dnQ0oPKPZWd+LnDfDh08el2wIqWiZBiTRmfFqDg4egZAm18aoBKCNTx6QEOItDHdwFQiOAivjeA1Jea/17xeLgM0gVA5pus+ydjFwh07wPuCx6Iv/439Ai0ABXiu0CgBKgYnx6BDiAz/voHH/SXQW69U6QCyI0/X6t5u93GGONH4jkhuucEGoCS+OuFspnnjqgQKACOxC88gUeDAAeoEd8zAhSgZnyvCDAAi/geESAAlvG9ITQHaBHfE0JTgJbxvSA0A0DE94DQBAAZnx3BHIAhPjOCKQBTfFYEMwDG+IwIJgDM8dkQqgN4iM+EUB2g7/v56oWkD0gsvnvh2SVyj27LPJX9bb6sg+q6nUSEcRiGH7nAe/evvgMSLqSiip/4cGQS3/S6oI3fKsr4Owhm8U0BHuwE6vgbCKbxzQHuEM5d173X/rKjvcfX0tuX3Xuu/e1Yj47H5DmgdOH/488JAKwuAAGAC4DHawcIAFwAPF47QADgAuDx2gECABcAj9cOEAC4AHi8doAAwAXA47UDBAAuAB6vHSAAcAHweO0AAYALgMf/BSG73n/ZKYWZAAAAAElFTkSuQmCC"
                      />
                    </defs>
                  </svg>
                </ModalCloseBtn>
                <p>공유하기</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                  <CopyToClipboard
                    className="Toram"
                    text={window.location.href}
                    onCopy={() => alert("주소가 클립보드에 복사되었습니다.")}
                  >
                    <button type="button" style={{ cursor: "pointer" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        viewBox="0 -960 960 960"
                        width="30px"
                        fill="#333"
                      >
                        <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                      </svg>
                    </button>
                  </CopyToClipboard>

                  <button type="button" style={{ cursor: "pointer" }} onClick={handleKakaoButton} id="kakaoShareBtn">
                    <img src={kakaoBtnImg} />
                  </button>
                </div>
              </ShareModal>
            </>
          )}
        </Title>
        <InfoText>
          {roomInfo.price.toLocaleString()}원 / {roomInfo.main_location}
          <br />
          최대 인원 {roomInfo.max_adult + roomInfo.max_baby + roomInfo.max_child}명 * 침실 {roomInfo.room_num}개
        </InfoText>
        <MainOptionBox>
          {roomInfo.category.map((cate, i) =>
            tagArr.map((tag, ii) => {
              if (tag === cate) {
                return (
                  <MainOption key={i}>
                    <img src={sortedImages.current ? sortedImages.current[ii].src : ""} />
                    {cate}
                  </MainOption>
                );
              }
            }),
          )}
        </MainOptionBox>

        <RoomInfoDiv>
          <p>숙소 소개</p>
          {/* whiteSpace: "pre-wrap" 줄 바꿈 출력 css */}
          <div style={{ whiteSpace: "pre-wrap" }}>{roomInfo.contents}</div>
          <button
            type="button"
            onClick={() =>
              setSlideModal((prev) => ({
                isOpen: true,
                title: "숙소 소개",
                text: roomInfo.contents,
              }))
            }
          >
            더보기 &gt;
          </button>
        </RoomInfoDiv>

        <LocationDiv>
          <p>숙소 위치</p>
          <Location>
            <KakaoMap moveup={moveup} address={roomInfo.sub_location} title={roomInfo.title} />
          </Location>
          <LocationText>{roomInfo.sub_location}</LocationText>
        </LocationDiv>

        <HostInfoDiv>
          <p>호스트 소개</p>
          <HostInfoBox>
            <HostImg>{roomInfo.author.photo}</HostImg>
            <div>
              <HostName>
                {roomInfo.author.nickname}({roomInfo.author.name})
              </HostName>
              <p>
                <a href={`mailto:${roomInfo.author.email}`}>{roomInfo.author.email}</a>
              </p>
              <HostPhone href={`tel:${roomInfo.author.phone}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#333">
                  <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                </svg>
                {roomInfo.author.phone}
              </HostPhone>
            </div>
          </HostInfoBox>
          <HostText>
            {/* whiteSpace: "pre-wrap" 줄 바꿈 출력 css */}
            <div style={{ whiteSpace: "pre-wrap" }}>{roomInfo.host_intro}</div>
            <button
              type="button"
              onClick={() =>
                setSlideModal((prev) => ({
                  isOpen: true,
                  title: "호스트 소개",
                  text: roomInfo.host_intro,
                }))
              }
            >
              더보기 &gt;
            </button>
          </HostText>
        </HostInfoDiv>
      </Container>

      <OrderBtnDiv>
        {/* 아이템을 직접 눌러서 온건지 링크로 들어온 건지에 따라 보여줌 */}
        {is_notLink && !userState.is_logined && (
          <>
            <PriceDiv>
              <b>로그인이 필요합니다.</b>
            </PriceDiv>
            <ReservationBtn onClick={() => navigate("/login")}>로그인하기</ReservationBtn>
          </>
        )}
        {is_notLink && userState.is_logined && (
          <>
            <PriceDiv>
              <b>{footerPrice.toLocaleString()}원</b> / {totalDate.current}박
              <p>
                {query.get("startDate")?.substring(5)}~{query.get("endDate")?.substring(5)}
              </p>
            </PriceDiv>
            <ReservationBtn onClick={onReservate}>예약하기</ReservationBtn>
          </>
        )}
      </OrderBtnDiv>

      {slideModal.isOpen && <SlideUpModal title={slideModal.title} text={slideModal.text} />}
    </>
  );
};

export default RoomDetails;
