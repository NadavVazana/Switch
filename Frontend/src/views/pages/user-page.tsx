import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";
import snackbar from "../../atoms/snackbar";
import { Date as SWDate } from "../../models/date";
import { LoggedInUser } from "../../models/logged-in-user";
import { calendarService, emptyDate } from "../../services/calendar.service";
import { userService } from "../../services/user.service";
import AddingModal from "../cmps/adding-modal";
import SwitchTable from "../cmps/switch-table";
import UserSideMenu from "../cmps/user-side-menu";

export const UserPage = () => {
  const loggedUser = useRecoilValue(loggedInUser);
  const setLoggedUser = useSetRecoilState(loggedInUser);
  const [dates, setDates] = useState([emptyDate]);
  const navigate = useNavigate();
  const setSnackbar = useSetRecoilState(snackbar);
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const initialForm = {
    firstName: loggedUser.firstName,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    phone: loggedUser.phone,
    img: loggedUser.img,
  };

  const [profileForm, setProfileForm] = useState(initialForm);

  const initialEditForm = {
    isTake: false,
    startHour: "",
    endHour: "",
    flexible: false,
    comment: "",
  };
  const [formData, setFormData] = useState(initialEditForm);

  const onDeleteSwitch = async (dateId: string, date: string) => {
    await calendarService.deleteSwitch(date, dateId);
    setSnackbar({
      isOpen: true,
      msg: "Switch has been deleted!",
      variant: "success",
    });

    const allDates = await calendarService.getDateListByOwnerId(loggedUser._id);
    if (allDates) {
      setDates(allDates);
    }
  };

  const onEditProfile = async (ev: FormEvent) => {
    ev.preventDefault();
    if (
      !`${profileForm.phone}`.startsWith("05") ||
      `${profileForm.phone}`.length !== 10 ||
      isNaN(+`${profileForm.phone}`)
    ) {
      setSnackbar({
        isOpen: true,
        msg: "Phone number not valid..",
        variant: "error",
      });
      return;
    }
    const updatedUser = await userService.updateUser({
      ...profileForm,
      _id: loggedUser._id,
    });

    if (!updatedUser) {
      setSnackbar({
        isOpen: true,
        msg: "Could not update details. try again later..",
        variant: "error",
      });
      return;
    }
    setIsProfileModal(false);
    setSnackbar({
      isOpen: true,
      msg: "Profile has been updated successfully!",
      variant: "success",
    });
    setLoggedUser(updatedUser);
  };

  useEffect(() => {
    if (Object.keys(loggedUser).length) {
      (async function fetch() {
        let dates = await calendarService.getDateListByOwnerId(loggedUser._id);

        if (!dates) {
          dates = [emptyDate];
        } else {
          setDates(dates);
        }
      })();
    }
  }, [loggedUser]);

  const onLogout = async () => {
    await userService.logout();
    navigate("/");
    setLoggedUser({} as LoggedInUser);
  };

  const onCloseModal = () => {
    setIsEditing(false);
  };

  const onEdit = (row: SWDate) => {
    setIsEditing(true);
    setCurrentDay(row.date);
    setCurrentId(row._id);
    setFormData({
      isTake: row.isTake,
      startHour: row.startHour,
      endHour: row.endHour,
      flexible: row.flexible,
      comment: row.comment,
    });
  };

  const onAdding = async (ev: FormEvent) => {
    ev.preventDefault();

    const date = {
      ...formData,
      _id: currentId,
      date: currentDay,
      owner: {
        _id: loggedUser._id,
        phone: loggedUser.phone,
        fullName: `${loggedUser.firstName} ${loggedUser.lastName}`,
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
      const allDates = await calendarService.getDateListByOwnerId(
        loggedUser._id
      );

      if (allDates) {
        setDates(allDates);
      }
      setIsEditing(false);
    }
  };

  return (
    <section className="user-page">
      {isEditing && (
        <AddingModal
          onAdding={onAdding}
          formData={formData}
          setFormData={setFormData}
          isUserPage={true}
          onCloseModal={onCloseModal}
        />
      )}
      <UserSideMenu setIsProfileModal={setIsProfileModal} onLogout={onLogout} />
      <Typography
        sx={{ textAlign: "center", marginBlock: "20px" }}
        variant="h4"
      >
        Welcome {loggedUser.firstName}
      </Typography>
      {dates.length > 0 && dates[0] !== emptyDate && (
        <SwitchTable
          dateList={dates}
          onDeleteSwitch={onDeleteSwitch}
          onEdit={onEdit}
          isForUser={true}
        />
      )}

      <Button
        variant="contained"
        sx={{
          position: "fixed",
          left: "10px",
          bottom: { xs: "20px", md: "unset" },
          top: { xs: "unset", md: "20px" },
        }}
        onClick={() => navigate("/")}
      >
        חזור לעמוד הבית
      </Button>

      {isProfileModal && (
        <div className="profile-modal">
          <form onSubmit={onEditProfile}>
            <TextField
              sx={{ backgroundColor: "white", width: "60%" }}
              onChange={(event) =>
                setProfileForm((prevState) => ({
                  ...prevState,
                  firstName: event.target.value,
                }))
              }
              value={profileForm.firstName}
              placeholder="First Name"
            />
            <TextField
              sx={{ backgroundColor: "white", width: "60%" }}
              onChange={(event) =>
                setProfileForm((prevState) => ({
                  ...prevState,
                  lastName: event.target.value,
                }))
              }
              value={profileForm.lastName}
              placeholder="Last Name"
            />
            <TextField
              sx={{ backgroundColor: "white", width: "60%" }}
              onChange={(event) =>
                setProfileForm((prevState) => ({
                  ...prevState,
                  phone: event.target.value,
                }))
              }
              value={profileForm.phone}
              placeholder="Phone Number"
            />
            <TextField
              sx={{ backgroundColor: "white", width: "60%" }}
              onChange={(event) =>
                setProfileForm((prevState) => ({
                  ...prevState,
                  img: event.target.value,
                }))
              }
              placeholder="Profile Image URL"
            />
            <Box sx={{ paddingTop: "20px" }}>
              <Button
                sx={{
                  backgroundColor: "#36AFD4",
                }}
                type="submit"
                variant="contained"
              >
                אישור
              </Button>
            </Box>
          </form>
        </div>
      )}
      {isProfileModal && (
        <div
          onClick={() => setIsProfileModal(false)}
          className="black-screen-profile"
        ></div>
      )}
    </section>
  );
};
