import React, { FormEventHandler } from "react";
import { TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Switch from "@mui/material/Switch";
import { useRecoilValue } from "recoil";
import selectedDay from "../../atoms/selected-day";
import loggedInUser from "../../atoms/logged-in-user";

interface FormData {
  isTake: boolean;
  startHour: string;
  endHour: string;
  flexible: boolean;
  comment: string;
  retention: boolean;
}

interface AddingModalProps {
  onAdding: FormEventHandler<HTMLFormElement>;
  setIsAdd?: Function;
  onCloseModal: Function;
  isUserPage: boolean;
  setFormData: Function;
  formData: FormData;
}
const AddingModal = ({
  formData,
  onAdding,
  setFormData,
  isUserPage,
  setIsAdd,
  onCloseModal,
}: AddingModalProps) => {
  const loggedUser = useRecoilValue(loggedInUser);

  const day = useRecoilValue(selectedDay);
  return (
    <React.Fragment>
      <section className="adding-modal">
        <Typography sx={{ paddingTop: "10px" }} variant="h5">
          {day.toLocaleDateString("he")}
        </Typography>
        <form onSubmit={onAdding}>
          <FormControl>
            <RadioGroup
              value={formData.isTake ? "take" : "give"}
              onChange={(event) =>
                setFormData((prevState: FormData) => ({
                  ...prevState,
                  isTake: event.target.defaultValue === "give" ? false : true,
                }))
              }
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={formData.isTake ? "take" : "give"}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="take"
                control={<Radio sx={{ color: "white" }} />}
                label="לוקח"
              />
              <FormControlLabel
                value="give"
                control={<Radio sx={{ color: "white" }} />}
                label="מוסר"
              />
            </RadioGroup>
            <FormControlLabel
              label="?גמיש"
              control={
                <Switch
                  checked={formData.flexible}
                  sx={{ color: "white" }}
                  onChange={(event) =>
                    setFormData((prevState: FormData) => ({
                      ...prevState,
                      flexible: event.target.checked,
                    }))
                  }
                />
              }
            />

            <Box sx={{}}>
              <Typography>:משמרת מתחילה ב</Typography>
              <TextField
                sx={{ backgroundColor: "white" }}
                value={formData.startHour}
                required
                onChange={(event) =>
                  setFormData((prevState: FormData) => ({
                    ...prevState,
                    startHour: event.target.value,
                  }))
                }
                type={"time"}
              />
            </Box>

            <Box sx={{}}>
              <Typography>:משמרת נגמרת ב</Typography>
              <TextField
                sx={{ backgroundColor: "white" }}
                value={formData.endHour}
                required
                onChange={(event) =>
                  setFormData((prevState: FormData) => ({
                    ...prevState,
                    endHour: event.target.value,
                  }))
                }
                type={"time"}
              />
            </Box>
            {loggedUser.role === "Costumer Team" && (
              <FormControlLabel
                label="?ריטנשן"
                control={
                  <Switch
                    checked={formData.retention}
                    sx={{ color: "white" }}
                    onChange={(event) =>
                      setFormData((prevState: FormData) => ({
                        ...prevState,
                        retention: event.target.checked,
                      }))
                    }
                  />
                }
              />
            )}
            {loggedUser.role === "Courier Team" && (
              <FormControlLabel
                label="?אנאסיין"
                control={
                  <Switch
                    checked={formData.retention}
                    sx={{ color: "white" }}
                    onChange={(event) =>
                      setFormData((prevState: FormData) => ({
                        ...prevState,
                        retention: event.target.checked,
                      }))
                    }
                  />
                }
              />
            )}

            <TextareaAutosize
              style={{
                gridColumn: "1/-1",
                width: "100%",
                maxWidth: "73%",
                minWidth: "73%",
                maxHeight: "120px",
                minHeight: "120px",
              }}
              maxLength={350}
              maxRows={5}
              value={formData.comment}
              dir={"rtl"}
              onChange={(event) =>
                setFormData((prevState: FormData) => ({
                  ...prevState,
                  comment: event.target.value,
                }))
              }
              placeholder="הערות"
            />
          </FormControl>
          <Button
            onClick={() => {
              if (!isUserPage && setIsAdd) {
                setIsAdd(false);
              } else {
                onCloseModal();
              }
            }}
            sx={{
              width: "20%",
              position: "absolute",
              bottom: "20px",
              left: "25%",
              transform: "translate(-25%)",
            }}
            variant="contained"
            color="error"
          >
            ביטול
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "20%",
              backgroundColor: "#36AFD4",
              position: "absolute",
              bottom: "20px",
              left: "75%",
              transform: "translate(-75%)",
            }}
          >
            אישור
          </Button>
        </form>
      </section>
      <div onClick={() => onCloseModal()} className="black-screen"></div>
    </React.Fragment>
  );
};

export default AddingModal;
