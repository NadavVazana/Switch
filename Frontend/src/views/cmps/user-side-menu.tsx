import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

type Anchor = "top" | "left" | "bottom" | "right";

interface UserSideMenuProps {
  setIsProfileModal: Function;
  onLogout: Function;
}
export default function UserSideMenu({
  setIsProfileModal,
  onLogout,
}: UserSideMenuProps) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Edit Profile"].map((text, index) => (
          <ListItem
            onClick={() => {
              setIsProfileModal(true);
            }}
            key={text}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <img
                  style={{ width: "30px" }}
                  src={
                    require("../../assets/imgs/edit-profile-svgrepo-com.svg")
                      .default
                  }
                  alt="edit-profile"
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Logout"].map((text, index) => (
          <ListItem
            onClick={() => {
              onLogout();
            }}
            key={text}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <img
                  style={{ width: "30px" }}
                  src={
                    require("../../assets/imgs/logout-svgrepo-com.svg").default
                  }
                  alt=""
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <img
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "40px",
          }}
          onClick={toggleDrawer("right", true)}
          src={require("../../assets/imgs/menu-svgrepo-com.svg").default}
          alt="side-menu"
        />
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
