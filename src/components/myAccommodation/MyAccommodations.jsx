import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  Button,
  ListContainer,
} from "./MyAccommodationsStyle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccommodationItem from "./AccommodationItem"; // 분리한 숙소아이템 컴포넌트 가져오기

const MyAccommodations = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [checkedButtons, setCheckedButtons] = useState([]);

  /** 나의 숙소 데이터 가져오기 */
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get("/accommodations/"); // 임시 엔드포인트
        if (Array.isArray(response.data)) {
          setAccommodations(response.data);
        } else {
          // 가져올 숙소데이터가 없을때 더미 데이터 사용
        setAccommodations([
          {
            id: 1,
            title: "제주의 집",
            description: "[제주애서 하루] 제주 힐링 여행",
            price: "370000",
            imageUrl: "https://a0.muscache.com/im/pictures/d0945841-4745-40d5-a877-de7a28150c19.jpg?im_w=720",
          },
          {
            id: 2,
            title: "부산의 집",
            description: "[부산에서 하루] 부산 힐링 여행",
            price: "420000",
            imageUrl:
              "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTc0MjgwMTc0OTgwMjIwNDUz/original/57709248-4e52-493b-83d5-4ad7737165a0.jpeg?im_w=320",
          },
          {
            id: 3,
            title: "여수의 집",
            description: "[여수에서 하루] 여수 힐링 여행",
            price: "640000",
            imageUrl:
              "https://a0.muscache.com/im/pictures/miso/Hosting-859232603817409995/original/419280ee-b2f6-49a9-b0f6-74f71e8c9c03.jpeg?im_w=320",
          },
          {
            id: 4,
            title: "제주의 집2",
            description: "[제주애서 하루] 제주 힐링 여행",
            price: "370000",
            imageUrl: "https://a0.muscache.com/im/pictures/d0945841-4745-40d5-a877-de7a28150c19.jpg?im_w=720",
          },
          {
            id: 5,
            title: "부산의 집2",
            description: "[부산에서 하루] 부산 힐링 여행",
            price: "420000",
            imageUrl:
              "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTc0MjgwMTc0OTgwMjIwNDUz/original/57709248-4e52-493b-83d5-4ad7737165a0.jpeg?im_w=320",
          },
          {
            id: 6,
            title: "여수의 집2",
            description: "[여수에서 하루] 여수 힐링 여행",
            price: "640000",
            imageUrl:
              "https://a0.muscache.com/im/pictures/miso/Hosting-859232603817409995/original/419280ee-b2f6-49a9-b0f6-74f71e8c9c03.jpeg?im_w=320",
          },
        ]);
        }
      } catch (error) {
        console.error("숙소 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    fetchAccommodations();
  }, []);

  /** 각 숙소 클릭 시 상세 페이지로 이동 */
  const onClickHandleDetail = (id) => {
    navigate(`/accommodation/${id}`);
  };

  /** 체크박스 클릭 시 해당 숙소 checked 상태 변경 */
  const onChangeHandleCheckBox = (checked, id) => {
    setCheckedButtons((prev) => (checked ? [...prev, id] : prev.filter((buttonId) => buttonId !== id)));
  };

  /** 등록삭제 버튼 클릭 시 */
  const onClickHandleDelete = () => {
    setAccommodations((prevAccommodations) => {
      const newAccommodations = prevAccommodations.filter((item) => !checkedButtons.includes(item.id));
      return newAccommodations;
    });
    setCheckedButtons([]); // 체크박스 카운트 리셋
  };

  /** 수정 버튼 클릭 시 */
  const onClickHandleEdit = () => {
    if (checkedButtons.length === 1) {
      navigate(`/accommodations/edit/${checkedButtons[0]}`); // 임시 경로
    }
  };

  const isDisable = checkedButtons.length !== 1;

  return (
    <Container>
      <Header>
        <Button onClick={onClickHandleDelete}>등록 삭제</Button>
        <Button onClick={onClickHandleEdit} disabled={isDisable}>
          수정
        </Button>
      </Header>
      <ListContainer>
        {Array.isArray(accommodations) && accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <AccommodationItem
              key={accommodation.id}
              accommodation={accommodation}
              checkedButtons={checkedButtons}
              onClickHandleDetail={onClickHandleDetail}
              onChangeHandleCheckBox={onChangeHandleCheckBox}
            />
          ))
        ) : (
          <p>나의 숙소 데이터가 없습니다.</p>
        )}
      </ListContainer>
    </Container>
  );
};

export default MyAccommodations;
