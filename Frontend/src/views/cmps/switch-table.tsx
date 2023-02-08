import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Date as SWDate } from "../../models/date";
import { useRecoilValue } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";
import { useState } from "react";

interface RowProps {
  row: SWDate;
  onEdit: Function;
  onDeleteSwitch: Function;
  isForUser: boolean;
  setDeleteHover: Function;
  deleteHover: string;
}

function Row({
  row,
  onEdit,
  onDeleteSwitch,
  deleteHover,
  isForUser,
  setDeleteHover,
}: RowProps) {
  const loggedUser = useRecoilValue(loggedInUser);
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        onClick={() => setOpen(!open)}
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor:
              loggedUser._id === row.owner._id ? "#97AFB9" : "white",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            sx={{ width: { xs: "30px", md: "100px" } }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {isForUser && (
          <TableCell
            align="center"
            sx={{ fontWeight: "700", width: "200px" }}
            component="th"
            scope="row"
          >
            {new Date(row.date).toLocaleDateString("he")}
          </TableCell>
        )}
        <TableCell
          sx={{
            fontWeight: "700",
            padding: "14px",
            width: "150px",
            position: "relative",
          }}
          align="center"
        >
          {`${row.startHour} - ${row.endHour}`}
          {row.retention && loggedUser.role === "Costumer Team" && (
            <img
              style={{
                position: "absolute",
                width: "18px",
                left: "100%",
                top: "47%",
                transform: "translate(-50%,-50%)",
                filter: "invert(0%)",
              }}
              src={require("../../assets/imgs/retention.svg").default}
              alt="retention"
            />
          )}
          {row.retention && loggedUser.role === "Courier Team" && (
            <img
              style={{
                position: "absolute",
                width: "18px",
                left: "100%",
                top: "47%",
                transform: "translate(-50%,-50%)",
                filter: "invert(0%)",
              }}
              src={require("../../assets/imgs/unassign.svg").default}
              alt="retention"
            />
          )}
        </TableCell>
        <TableCell sx={{ width: "150px", fontWeight: "700" }} align="center">
          {row.isTake ? "לוקח" : "מוסר"}{" "}
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", fontWeight: "700" }}>
          {row.flexible ? "כן" : "לא"}
        </TableCell>

        {row.owner._id === loggedUser._id && isForUser ? (
          <TableCell
            align="center"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteHover("");
              onEdit(row);
            }}
            sx={{ cursor: "pointer", width: "150px" }}
          >
            ערוך
          </TableCell>
        ) : null}
        {row.owner._id === loggedUser._id && isForUser ? (
          <TableCell
            align="center"
            onClick={(event) => {
              event.stopPropagation();
              if (row._id !== deleteHover) {
                setDeleteHover(row._id);
              } else {
                onDeleteSwitch(row._id, row.date);
              }
            }}
            sx={{
              transition: "all 0.3s",
              backgroundColor: deleteHover === row._id ? "#ff4d4d" : "#97AFB9",
              cursor: "pointer",
              width: "150px",
            }}
          >
            מחק
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* Shift menu  */}
            <Box sx={{ margin: 0 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: !isForUser
                          ? { xs: "100px", md: "unset" }
                          : { xs: "50px", md: "unset" },
                      }}
                    >
                      שם
                    </TableCell>
                    <TableCell
                      sx={{
                        width: {
                          xs: "100px",
                          md: "unset",
                        },
                        padding: "10px",
                      }}
                    >
                      טלפון
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow key={row._id}>
                    <TableCell
                      sx={{
                        maxWidth: {
                          xs: "100px",
                          md: "unset",
                        },
                        fontWeight: "700",
                      }}
                    >
                      {row.owner.fullName}
                    </TableCell>
                    <TableCell
                      onClick={() =>
                        !isForUser &&
                        window.open(
                          `https://api.whatsapp.com/send?phone=${row.owner.phone.substring(
                            1
                          )}`
                        )
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "700",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                    >
                      {row.owner.phone}{" "}
                      <img
                        style={{
                          position: "static",
                          width: "20px",
                          filter: "invert(0%)",
                        }}
                        src={
                          require("../../assets/imgs/whatsapp-svgrepo-com.svg")
                            .default
                        }
                        alt=""
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ maxWidht: "100px" }} align="center">
                      הערות
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        maxWidth: "100px",
                        wordBreak: "break-all",
                        textAlign: "right",
                        direction: "rtl",
                      }}
                    >
                      {row.comment}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface SwitchTableProps {
  dateList: SWDate[];
  onEdit: Function;
  onDeleteSwitch: Function;
  isForUser: boolean;
  isRetention: boolean;
  isUnassign: boolean;
}

function SwitchTable({
  dateList,
  isUnassign,
  onEdit,
  onDeleteSwitch,
  isForUser,
  isRetention,
}: SwitchTableProps) {
  const [isEarlyHoursUp, setIsEarlyHoursUp] = React.useState(false);
  const [isEarlyDateUp, setIsEarlyDateUp] = React.useState(true);
  let [sortedDateList, setSortedDateList] = React.useState([...dateList]);
  const [takeOrGive, setTakeOrGive] = React.useState("לוקח");
  const [deleteHover, setDeleteHover] = useState("");
  const loggedUser = useRecoilValue(loggedInUser);

  window.addEventListener("click", (event) => {
    event.stopPropagation();
    setDeleteHover("");
  });

  React.useEffect(() => {
    if (loggedUser.role === "Costumer Team") {
      if (!isRetention) {
        const withRetentions = sortedDateList.filter((date) => !date.retention);
        setSortedDateList(withRetentions);
      } else {
        setSortedDateList([...dateList]);
      }
    } else {
      if (!isUnassign) {
        const withRetentions = sortedDateList.filter((date) => !date.retention);
        setSortedDateList(withRetentions);
      } else {
        setSortedDateList([...dateList]);
      }
    }
  }, [dateList, isRetention, isUnassign]);

  const onFilterHours = () => {
    setIsEarlyHoursUp((prevState) => !prevState);

    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (!isEarlyHoursUp) return a.startHour.localeCompare(b.startHour);
        else return b.startHour.localeCompare(a.startHour);
      })
    );
  };

  const onFilterDates = () => {
    setIsEarlyDateUp((prevState) => !prevState);
    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (!isEarlyDateUp) {
          return a.date.localeCompare(b.date);
        } else {
          return b.date.localeCompare(a.date);
        }
      })
    );
  };

  return (
    <TableContainer
      sx={
        !isForUser
          ? { overflowX: "hidden", position: "static" }
          : { overflowX: "auto" }
      }
      component={Paper}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10px" }} />
            {isForUser && (
              <TableCell
                align="center"
                sx={{
                  minWidth: "60px",
                  cursor: "pointer",
                  paddingInlineEnd: "0",
                }}
                onClick={onFilterDates}
              >
                תאריך {isEarlyDateUp ? "↑" : "↓"}
              </TableCell>
            )}
            <TableCell
              align="center"
              onClick={onFilterHours}
              sx={{
                cursor: "pointer",
                paddingInlineEnd: "0",
                minWidth: "100px",
              }}
            >
              שעות {isEarlyHoursUp ? "↑" : "↓"}
            </TableCell>

            <TableCell
              align="center"
              onClick={() =>
                setTakeOrGive((prevState) => {
                  if (prevState === "לוקח") return "מוסר";
                  else return "לוקח";
                })
              }
              sx={{
                width: "50px",
                cursor: "pointer",
                minWidth: "100px",
              }}
            >
              {takeOrGive} ←
            </TableCell>
            <TableCell
              align="center"
              sx={{
                cursor: "pointer",
                paddingInlineEnd: "0",
                minWidth: "60px",
              }}
            >
              גמיש
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: "static" }}>
          {sortedDateList.map((date: SWDate) => {
            if (takeOrGive === "לוקח" && date.isTake) {
              return (
                <Row
                  deleteHover={deleteHover}
                  setDeleteHover={setDeleteHover}
                  isForUser={isForUser}
                  onDeleteSwitch={onDeleteSwitch}
                  onEdit={onEdit}
                  key={date._id}
                  row={date}
                />
              );
            } else if (takeOrGive === "מוסר" && !date.isTake) {
              return (
                <Row
                  deleteHover={deleteHover}
                  setDeleteHover={setDeleteHover}
                  isForUser={isForUser}
                  onDeleteSwitch={onDeleteSwitch}
                  onEdit={onEdit}
                  key={date._id}
                  row={date}
                />
              );
            } else {
              return null;
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SwitchTable;
