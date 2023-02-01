import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import allDates from "../../atoms/all-dates";
import { calendarService } from "../../services/calendar.service";
import Calendar from "../cmps/calendar";
import Header from "../cmps/header";
import SetSwitchModal from "../cmps/modal";

function HomePage() {
  const setAllDates = useSetRecoilState(allDates);
  useEffect(() => {
    (async function fetch() {
      const dates = await calendarService.getAllDates();
      if (dates) {
        setAllDates(dates);
      }
    })();
  }, [setAllDates]);

  return (
    <React.Fragment>
      <Header />
      <Calendar />
      <SetSwitchModal />
    </React.Fragment>
  );
}

export default HomePage;
