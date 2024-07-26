import { useState, useEffect } from "react";
import { SlideModal } from "../../atoms/modalAtom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

// 모달 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: none;
  z-index: 101;
  transition: background-color 0.3s ease-in-out;
  &.open {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;
// 모달 컨테이너 div
const ModalContainer = styled.div`
  position: fixed;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  background-color: #fff;
  transition: top 0.3s ease-in-out;
  padding: 0 15px;
  &.open {
    top: 0;
  }
`;
// 모달 헤더
const ModalHeader = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
`;
// 모달 닫기
const ModalCloseBtn = styled.button`
  border: 0;
  background: none;
  padding: 5px 0;
`;

const RoomModal = ({ children }) => {
  const setSlideModal = useSetRecoilState(SlideModal);
  const slideModal = useRecoilValue(SlideModal);
  const [isSlideUp, setIsSlideUp] = useState(false);
  console.log("hi");

  // 모달 슬라이드 업 애니메이션 0.1초 후 실행
  useEffect(() => {
    let timer;
    if (slideModal) {
      timer = setTimeout(() => setIsSlideUp(true), 100);
    } else {
      clearTimeout(timer);
    }
  }, [slideModal]);

  const onCloseModal = () => {
    setIsSlideUp(false);
    setTimeout(() => {
      setSlideModal(false);
    }, 200);
  };

  return (
    <ModalOverlay className={isSlideUp ? "open" : null}>
      <ModalContainer className={isSlideUp ? "open" : null}>
        <ModalHeader>
          <ModalCloseBtn onClick={onCloseModal}>
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
                <pattern
                  id="pattern0_2_619"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
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
        </ModalHeader>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RoomModal;
