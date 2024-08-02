//나의숙소 예약관리 페이지
import React from "react";
import SubHeader from "../components/layout/SubHeader";
import MainFooter from "../components/layout/MainFooter";
import { motion } from "framer-motion";
import MyAccommodationReserve from "../components/myAccReserve/MyAccReserve";

const MyAccReservePage = () => {

  return (
    <>
    <SubHeader />
    <motion.div
      initial={{ opacity: 0, transform: 'translateX(100%)'}}
      animate={{ opacity: 1, transform: 'translateX(0)'}}
      transition={{ duration: 0.3 }}>
        <MyAccommodationReserve />
    </motion.div>
    <MainFooter />
    </>
  );
};

export default MyAccReservePage;
