import api from "../util/axiosInstance"; // axios 대신 api를 임포트

class GetTravelLoad {
  // 지난 여행 페이지 정보 불러오기
  async getReservePastPage({ mymode }) {
    try {
      const res = await api.post(
        `/reserve/getreservepast/page`,
        {
          mymode,
        },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );
      return res.data.result;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  // 지난 여행 리스트 정보 불러오기
  async getReservePastRead({ nowpage, mymode }) {
    try {
      const res = await api.post(
        `/reserve/getreservepast/page/read`,
        {
          mymode,
          nowpage,
        },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );
      return /*posts*/ res.data.result;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  // 다가오는 여행 페이지 정보 불러오기
  async getReserveUpcomingPage({ mymode }) {
    try {
      const res = await api.post(
        `/reserve/getreserveupcoming/page`,
        {
          mymode,
        },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );
      return res.data.result;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  // 다가오는 여행 리스트 정보 불러오기
  async getReserveUpcomingRead({ nowpage, mymode }) {
    try {
      const res = await api.post(
        `/reserve/getreserveupcoming/page/read`,
        {
          mymode,
          nowpage,
        },
        {
          // 쿠키를 포함시키기 위해 필요
        },
      );
      return /*posts*/ res.data.result;
    } catch (e) {
      console.log(e);
      return;
    }
  }
}

const getTravelLoad = new GetTravelLoad();
export default getTravelLoad;
