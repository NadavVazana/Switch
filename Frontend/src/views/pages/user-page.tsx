import { Button, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";
import snackbar from "../../atoms/snackbar";
import { Date as SWDate } from "../../models/date";
import { LoggedInUser } from "../../models/logged-in-user";
import { calendarService, emptyDate } from "../../services/calendar.service";
import { cloudService } from "../../services/cloudinary-service";
import { userService } from "../../services/user.service";
import AddingModal from "../cmps/adding-modal";
import Loader from "../cmps/loader";
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
  const [isLoading, setIsLoading] = useState(false);

  const initialForm = {
    firstName: loggedUser.firstName,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    phone: loggedUser.phone,
    img: loggedUser.img,
    role: loggedUser.role,
  };

  const [profileForm, setProfileForm] = useState(initialForm);
  useEffect(() => {
    setProfileForm(initialForm);
  }, [loggedUser]);

  const initialEditForm = {
    isTake: false,
    startHour: "",
    endHour: "",
    flexible: false,
    comment: "",
    retention: false,
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
    userService.updateStorage({ ...profileForm, _id: loggedUser._id });

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
    setSnackbar({
      isOpen: true,
      msg: "Logged out successfully!",
      variant: "error",
    });
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
      retention: row.retention,
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

  const handleUpload = async (ev: any) => {
    setIsLoading(true);
    const url = await cloudService.uploadImg(ev);
    if (url) {
      setIsLoading(false);
      setSnackbar({
        isOpen: true,
        msg: "Image has been uploaded!",
        variant: "success",
      });
      setProfileForm((prevState) => ({ ...prevState, img: url }));
    } else {
      setIsLoading(false);
      setSnackbar({
        isOpen: true,
        msg: "There's been a problem with uploading the img",
        variant: "error",
      });
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
        sx={{
          textAlign: "center",
          marginBlock: "20px",
          fontWeight: "700",
          paddingInlineStart: { xs: "20px", md: "unset" },
          fontSize: { xs: "18px", md: "25px" },
        }}
        variant="h4"
      >
        Welcome {loggedUser.firstName}
      </Typography>
      {dates.length > 0 && dates[0] !== emptyDate && (
        <SwitchTable
          isUnassign={true}
          isRetention={true}
          dateList={dates}
          onDeleteSwitch={onDeleteSwitch}
          onEdit={onEdit}
          isForUser={true}
        />
      )}

      <Button
        variant="contained"
        sx={{
          position: "absolute",
          left: "10px",
          bottom: { xs: "unset", md: "unset" },
          top: { xs: "10px", md: "20px" },
        }}
        onClick={() => navigate("/")}
      >
        ←
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

            <label
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              htmlFor="upload"
            >
              <Typography color="white">Profile Picture:</Typography>
              <img
                style={{ width: "60px" }}
                src={
                  require("../../assets/imgs/upload-1-svgrepo-com.svg").default
                }
                alt="upload-profile-pic"
              />
            </label>
            <input
              style={{ display: "none" }}
              id="upload"
              onInput={handleUpload}
              type="file"
            />
            <Button
              sx={{
                backgroundColor: "#36AFD4",
              }}
              variant="contained"
              type="submit"
            >
              אישור
            </Button>
            <Button
              onClick={() => setIsProfileModal(false)}
              color="error"
              type="button"
              variant="contained"
            >
              ביטול
            </Button>
          </form>
        </div>
      )}
      {isProfileModal && (
        <div
          onClick={() => {
            setIsProfileModal(false);
          }}
          className="black-screen-profile"
        ></div>
      )}
      {isLoading && (
        <div
          style={{ zIndex: "100000", cursor: "unset" }}
          className="black-screen"
        ></div>
      )}
      {isLoading && <Loader />}
    </section>
  );
};
