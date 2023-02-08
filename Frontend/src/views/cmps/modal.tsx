import selectedDaySelector from "../../selectors/selected-day";
import { useRecoilValue, useSetRecoilState } from "recoil";
import isModal from "../../atoms/is-modal";
import { useRecoilState } from "recoil";
import SwitchTable from "./switch-table";
import isAdding from "../../atoms/is-adding";
import React, { FormEvent } from "react";
import { useState } from "react";
import currentDateList from "../../atoms/current-date-list";
import { Date as SWDate, Owner } from "../../models/date";
import { calendarService, emptyDate } from "../../services/calendar.service";
import loggedInUserSelector from "../../selectors/logged-in-user";
import snackbar from "../../atoms/snackbar";
import Loader from "./loader";
import isLoadingSelector from "../../selectors/is-loading";
import allDates from "../../atoms/all-dates";
import AddingModal from "./adding-modal";
import { FormControlLabel, Switch } from "@mui/material";

function SetSwitchModal() {
  const selectedDay = useRecoilValue(selectedDaySelector);
  const [isOpen, setIsOpen] = useRecoilState(isModal);
  const isLoad = useRecoilValue(isLoadingSelector);
  const setCurrentDateList = useSetRecoilState(currentDateList);
  const [isAdd, setIsAdd] = useRecoilState(isAdding);
  let [dateList, setDateList] = useRecoilState(currentDateList);
  const [isEditMode, setIsEditMode] = useState(false);
  const loggedInUser = useRecoilValue(loggedInUserSelector);
  const setSnackbar = useSetRecoilState(snackbar);
  const setDatesList = useSetRecoilState(allDates);
  const [isRetention, setIsRetention] = useState(true);
  const [isUnassign, setIsUnassign] = useState(true);

  const [currentId, setCurrentId] = useState("");
  const initialForm = {
    isTake: true,
    startHour: "",
    endHour: "",
    flexible: false,
    comment: "",
    retention: false,
  };
  const [formData, setFormData] = useState(initialForm);

  const onAdding = async (ev: FormEvent) => {
    ev.preventDefault();

    if (
      (selectedDay.getDate() === new Date().getDate() &&
        new Date(formData.startHour).getHours() < new Date().getHours()) ||
      new Date(formData.endHour).getHours() < new Date().getHours()
    ) {
      setSnackbar({
        isOpen: true,
        msg: "Can't set previous hours",
        variant: "error",
      });
      return;
    }
    if (isEditMode) {
      editSwitch();
    } else {
      if (!Object.values(loggedInUser).length) {
        setSnackbar({ isOpen: true, msg: "Login First!", variant: "error" });
        return;
      }
      let data = {
        ...formData,
        date: selectedDay.toLocaleDateString("en-CA"),
        owner: {
          _id: loggedInUser._id,
          phone: loggedInUser.phone,
          fullName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
          role: loggedInUser.role,
        },
      };
      const dates = await calendarService.getDateListByOwnerId(
        loggedInUser._id
      );
      if (!formData.isTake && dates) {
        const canAdd = dates.filter(
          (date) =>
            date.date === selectedDay.toLocaleDateString("en-CA") &&
            !date.isTake
        );

        if (canAdd.length >= 2) {
          setSnackbar({
            isOpen: true,
            msg: "Can add only 2 give switches for a date!",
            variant: "error",
          });
          setIsOpen(false);
          return;
        }
      }

      const addedDate = await calendarService.addDate(data);
      if (!addedDate) {
        setSnackbar({
          isOpen: true,
          msg: "Could'nt add a shift..",
          variant: "error",
        });
        return;
      } else {
        let allDatesList = await calendarService.getAllDates();

        if (allDatesList) {
          setDatesList(allDatesList);
        }
        setSnackbar({
          isOpen: true,
          msg: "Shift has been added!",
          variant: "success",
        });
        const switches = [...dateList.switches, addedDate];
        const dates = { ...dateList, switches };

        setDateList(dates);
        setIsAdd(false);
      }
    }
  };

  const onDeleteSwitch = async (dateId: string, date: string, owner: Owner) => {
    if (owner._id !== loggedInUser._id) {
      setSnackbar({
        isOpen: true,
        msg: "Only user's switches can be delete!",
        variant: "error",
      });
      return;
    }
    await calendarService.deleteSwitch(date, dateId);
    const switches = dateList.switches.filter(
      (date: SWDate) => date._id !== dateId
    );
    const dates = { ...dateList, switches: switches };
    setDateList(dates);
    setIsAdd(false);
    setSnackbar({
      isOpen: true,
      msg: "Switch has been deleted!",
      variant: "success",
    });
    const allDatesList = await calendarService.getAllDates();

    if (allDatesList) {
      setDatesList(allDatesList);
    }
  };

  const editSwitch = async () => {
    const date = {
      ...formData,
      _id: currentId,
      date: selectedDay.toLocaleDateString("en-CA"),
      owner: {
        _id: loggedInUser._id,
        phone: loggedInUser.phone,
        fullName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      },
    };

    const updatedDate = await calendarService.updateDate(date);

    if (!updatedDate) {
      setSnackbar({
        isOpen: true,
        msg: "Could'nt update your shift...",
        variant: "error",
      });
    } else {
      setSnackbar({
        isOpen: true,
        msg: "Shift has been updated!",
        variant: "success",
      });
      const allDates = await calendarService.getDateList(date.date);
      if (allDates) {
        setDateList(allDates);
      }
      setIsAdd(false);
    }
  };

  const onEdit = (row: SWDate) => {
    if (row.owner._id !== loggedInUser._id) {
      setSnackbar({
        isOpen: true,
        msg: "Only user's switches can be edited!",
        variant: "error",
      });
      return;
    }
    setIsAdd(true);
    setCurrentId(row._id);

    setIsEditMode(true);
    setFormData({
      isTake: row.isTake,
      startHour: row.startHour,
      endHour: row.endHour,
      flexible: row.flexible,
      comment: row.comment,
      retention: row.retention,
    });
  };

  const onPressAdd = async () => {
    const dates = await calendarService.getDateListByOwnerId(loggedInUser._id);
    if (!dates) {
      setSnackbar({
        isOpen: true,
        msg: "Could'nt add a switch. try again later...",
        variant: "error",
      });
      return;
    }

    setIsAdd(true);
    setIsEditMode(false);
    setFormData(initialForm);
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setCurrentDateList(emptyDate);
  };

  return isOpen ? (
    !isAdd ? (
      <React.Fragment>
        <section className="set-switch-modal">
          <h1>{selectedDay.toLocaleDateString("he")}</h1>
          {isLoad ? (
            <Loader />
          ) : (
            <div>
              {" "}
              {loggedInUser.role === "Costumer Team" && (
                <FormControlLabel
                  sx={{ position: "absolute", top: "20px", left: "20px" }}
                  label="ריטנשן"
                  control={
                    <Switch
                      value={isRetention}
                      defaultChecked={true}
                      onChange={(event) => setIsRetention(event.target.checked)}
                    />
                  }
                />
              )}
              {loggedInUser.role === "Courier Team" && (
                <FormControlLabel
                  sx={{ position: "absolute", top: "20px", left: "20px" }}
                  label="אנאסיין"
                  control={
                    <Switch
                      value={isUnassign}
                      defaultChecked={true}
                      onChange={(event) => setIsUnassign(event.target.checked)}
                    />
                  }
                />
              )}
              <img
                onClick={() => onPressAdd()}
                src={require("../../assets/imgs/plus-svgrepo-com.svg").default}
                alt="add-shift"
              />
              <SwitchTable
                isUnassign={isUnassign}
                isRetention={isRetention}
                onDeleteSwitch={onDeleteSwitch}
                onEdit={onEdit}
                dateList={dateList.switches}
                isForUser={false}
              />{" "}
            </div>
          )}
        </section>
        <div
          onClick={() => {
            onCloseModal();
            setIsRetention(true);
          }}
          className="black-screen"
        ></div>
      </React.Fragment>
    ) : (
      <AddingModal
        setFormData={setFormData}
        formData={formData}
        isUserPage={false}
        onCloseModal={onCloseModal}
        setIsAdd={setIsAdd}
        onAdding={onAdding}
      />
    )
  ) : (
    <React.Fragment></React.Fragment>
  );
}

export default SetSwitchModal;
