import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState } from "recoil";
import snackbar from "../../atoms/snackbar";
import { Alert } from "@mui/material";

function UserMessage() {
  const [snack, setSnack] = useRecoilState(snackbar);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({ isOpen: false, msg: "", variant: "error" });
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.isOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        action={action}
      >
        <Alert variant="filled" severity={snack.variant || "error"}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserMessage;
