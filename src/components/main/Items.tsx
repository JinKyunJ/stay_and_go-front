import React, { useRef, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import mainPostLoad from "../../api/mainPostLoad";
import main_no_data from "../../assets/images/main_no_data.png";
import OneItem from "./OneItem";
import loading from "../../assets/icons/loading.png";
import Pagination from "../layout/Pagination";
import { ItemsProps, NoItemProps, PageType, PostType } from "../../model/main(with detail, upload)/mainTypes";

const Container = styled.div`
  width: 100%;
  height: 100%; // default
  margin-top: 20px;
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: center;
`;
// 피드백 반영 (NoItem 스타일드컴포넌트 작성)
const NoItemContainer = styled.div`
  padding-top: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const NoItem = styled.div.attrs<NoItemProps>((props) => ({
  style: {
    backgroundImage: `url(${props.$main_no_data})`,
  },
}))`
  width: 100px;
  height: 100px;
`;
const NoItemSpan = styled.span`
  font-size: 20px;
  color: #e61e51;
`;
const Loading_div = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40%;
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

const Items: React.FC<ItemsProps> = ({ page, setPage, startSearch, category }) => {
  // 숙소 아이템 목록 상태
  const [posts, setPosts] = useState<PostType[] | null>(null);
  // is loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 메인 첫 페이지 진입 시 search x, category x 인 전체 데이터를 가져옴
  // 1. 일단 페이지 정보를 먼저 세팅 (페이지 정보는 case1. 검색 버튼으로 검색 시작, case2. category 변동 에만 추가로 필요함)
  // 2. 이후 페이지 조절 시 페이지에 맞도록 포스트 검색 진행
  useEffect(() => {
    if (page && page.page === 1) {
      mainPostLoad.getPostsPage({ search: startSearch, category, mymode: false }).then((res) => {
        setPage(res);
      });
      mainPostLoad.getPostsRead({ nowpage: page.page, search: startSearch, category, mymode: false }).then((res) => {
        setPosts(res);
      });
      setIsLoading(true);
    } else if (page && page.page > 1) {
      mainPostLoad.getPostsRead({ nowpage: page.page, search: startSearch, category, mymode: false }).then((res) => {
        setPosts(res);
      });
      setIsLoading(true);
    }
  }, [startSearch, category, page.page]);

  // posts 가 load 될 때 로딩 stop
  useEffect(() => {
    if (isLoading) {
      // 실제 로딩은 매우 빨라서 loading 이 보이지 않아 최소 시간 0.15 초 정도는 로딩화면이 보이게 함.
      setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }
  }, [posts]);

  return (
    <Container>
      {(!isLoading && (
        <>
          {posts && posts.map((v, i) => <OneItem key={i} v={v} startSearch={startSearch} />)}
          {(posts && posts.length === 0 && (
            <NoItemContainer>
              <NoItem $main_no_data={main_no_data}></NoItem>
              <NoItemSpan>데이터가 존재하지 않습니다</NoItemSpan>
            </NoItemContainer>
          )) || <Pagination page={page} setPage={setPage} />}
        </>
      )) || (
        <Loading_div>
          <Loading_img src={loading} style={{ animation: "spin 0.5s 3 linear" }} />
        </Loading_div>
      )}
    </Container>
  );
};

export default Items;
