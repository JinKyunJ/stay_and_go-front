import React, {useEffect, useState} from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 60px;
    background-color: white;
    
    border-bottom: 2px solid #EEEEEE;
    padding-top: 10px;
`
const ItemDiv = styled.div`
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 5px;
    // x축 scroll 작업
    overflow-x: auto;
    // oneline
    flex-wrap: nowrap;
    // 스크롤 시 하나씩 넘기기	
	scroll-snap-type: x mandatory;
    /* 끝에서 바운스 되도록 */
    -webkit-overflow-scrolling: touch;
    /* 스크롤바 숨기기 */
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none; 
`

const Item = styled.div`
    width: 25%;
    height: 98%;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // 스크롤 시 하나씩 넘기기(아이템)
    scroll-snap-align: start;
    // + "이미지 크기 고정" 작업(div > img 구조 + div 에서 flex-frow, shrink, basis(절대 크기) 설정 !)
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 75px;
    cursor: pointer;
`
const ItemTitle = styled.span`
    font-size: 12px;
    color: #797979;
`
const ItemImg = styled.img`
    width: 24px;
    height: 24px;
`


const Category = ({setCategory}) => {
    // 태그 배열 및 상태 정의
    const tagArr = ["전체", "멋진 수영장", "한적한 시골", "해변 근처", "캠핑장", "한옥", "최고의 전망"
        , "산 근처", "방", "호수 근처", "통나무집", "캠핑카", "특이한 숙소", "농장", "디자인", "섬", "예술 공간"];
    const [tag, setTag] = useState(tagArr[0]);

    // 태그(카테고리) 변경될 때 setCategory 작업으로 category 상태 변경
    useEffect(() => {
        setCategory(tag);
    },[tag])

    // mainCatetory 디렉토리 이미지 가져오기
    const importAllImages = (v) => {
        return v.keys().map((key) => ({
            src: v(key),
            name: key.match(/[^/]+$/)[0], // 파일 이름만 추출
          }));
    };
    const images = importAllImages(require.context('../../assets/icons/mainCategory', false, /\.(png|jpe?g|gif)$/));

    // 파일 이름 순으로 정렬
    const sortedImages = images.sort((a, b) => {
        const aNumber = parseInt(a.name.split('_')[0], 10);
        const bNumber = parseInt(b.name.split('_')[0], 10);
        return aNumber - bNumber;
    });
    // 아이템 클릭 시 태그 상태 변화
    const onClickImage = (index) => {
        setTag(tagArr[index]);
    };

    return (
        <Container>
            <ItemDiv>
                {sortedImages.map((v, i) => (
                    <Item key={i} onClick={() => onClickImage(i)} style={tag === tagArr[i] ? {borderBottom: "2px solid #333"} : {borderBottom: "none"}}>
                        <ItemImg src={v.src} />
                        <ItemTitle style={tag === tagArr[i] ? {fontWeight: "bold"} : {fontWeight: "500"}}>{tagArr[i]}</ItemTitle>
                    </Item>
                ))}
            </ItemDiv>

        </Container>
    );
}

export default Category;