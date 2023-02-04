import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "fullcalendar";
import selectedDay from "../../atoms/selected-day";
import { useRecoilValue, useSetRecoilState } from "recoil";
import isModal from "../../atoms/is-modal";
import isAdding from "../../atoms/is-adding";
import { calendarService, emptyDate } from "../../services/calendar.service";
import currentDateList from "../../atoms/current-date-list";
import isLoading from "../../atoms/is-loading";
import { useEffect, useState } from "react";
import allDates from "../../atoms/all-dates";
import snackbar from "../../atoms/snackbar";
import loggedInUser from "../../atoms/logged-in-user";

function Calendar() {
  const setDay = useSetRecoilState(selectedDay);
  const setIsLoading = useSetRecoilState(isLoading);
  const loggedUser = useRecoilValue(loggedInUser);
  const setIsModalOpen = useSetRecoilState(isModal);
  const setSnackbar = useSetRecoilState(snackbar);
  const setIsAdd = useSetRecoilState(isAdding);
  const setCurrentDateList = useSetRecoilState(currentDateList);
  const [eventList, setEventList] = useState([{}]);
  const dates = useRecoilValue(allDates);

  useEffect(() => {
    if (Object.values(loggedUser).length) {
      if (dates) {
        let eventList = [
          {
            start: "",
            title: "",
            backgroundColor: "#36AFD4",
            borderColor: "#36AFD4",
          },
        ];

        dates.forEach((date) => {
          if (date.switches.some((swtch) => swtch.isTake)) {
            eventList.push({
              borderColor: "#36AFD4",
              backgroundColor: "#36AFD4",
              start: date.date,
              title: "לקיחות",
            });
          }
          if (date.switches.some((swtch) => !swtch.isTake)) {
            eventList.push({
              borderColor: "#2E7D32",
              backgroundColor: "#2E7D32",
              start: date.date,
              title: "מסירות",
            });
          }
        });
        eventList.splice(0, 1);

        setEventList(eventList);
      }
    }
  }, [dates, loggedUser]);

  const isDayPassed = (date: Date) => {
    const now = new Date();
    if (date.getMonth() + 1 > now.getMonth() + 1) {
      if (date.getFullYear() >= now.getFullYear()) {
        return false;
      }
    }
    if (date.getMonth() + 1 === now.getMonth() + 1) {
      if (
        date.getDate() + 1 >= now.getDate() + 1 &&
        date.getFullYear() >= now.getFullYear()
      )
        return false;
    }
    return true;
  };

  const onDateSelect = async ({ start }: DateSelectArg) => {
    if (isDayPassed(start)) {
      setSnackbar({
        isOpen: true,
        msg: "Cannot add switches on previous dates!",
        variant: "error",
      });
      return;
    }
    setIsModalOpen(true);
    setDay(start);
    setIsAdd(false);
    setIsLoading(true);
    const dateList = await calendarService.getDateList(
      start.toLocaleDateString("en-CA")
    );

    if (dateList) {
      setCurrentDateList(dateList);
    } else {
      setCurrentDateList(emptyDate);
    }
    setIsLoading(false);
  };

  return (
    <section className="calendar">
      <FullCalendar
        longPressDelay={0}
        events={eventList}
        selectable={Object.values(loggedUser).length ? true : false}
        select={onDateSelect}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
      />
    </section>
  );
}

export default Calendar;
