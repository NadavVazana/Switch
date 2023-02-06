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

interface RowProps {
  row: SWDate;
  onEdit: Function;
  onDeleteSwitch: Function;
  isForUser: boolean;
}

function Row({ row, onEdit, onDeleteSwitch, isForUser }: RowProps) {
  const loggedUser = useRecoilValue(loggedInUser);
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
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
          <TableCell sx={{ fontWeight: "700" }} component="th" scope="row">
            {new Date(row.date).toLocaleDateString("he")}
          </TableCell>
        )}
        <TableCell
          sx={{ fontWeight: "700", padding: "14px", width: "150px" }}
          align="left"
        >{`${row.startHour} - ${row.endHour}`}</TableCell>
        <TableCell sx={{ width: "150px", fontWeight: "700" }} align="left">
          {row.isTake ? "לוקח" : "מוסר"}{" "}
          {row.retention && (
            <img
              style={{
                position: "static",
                width: "10px",
                filter: "invert(0%)",
              }}
              src={require("../../assets/imgs/retention.svg").default}
              alt=""
            />
          )}
        </TableCell>
        <TableCell sx={{ width: "150px", fontWeight: "700" }}>
          {row.flexible ? "כן" : "לא"}
        </TableCell>

        {row.owner._id === loggedUser._id && isForUser ? (
          <TableCell onClick={() => onEdit(row)} sx={{ cursor: "pointer" }}>
            ערוך
          </TableCell>
        ) : null}
        {row.owner._id === loggedUser._id && isForUser ? (
          <TableCell
            onClick={() => onDeleteSwitch(row._id, row.date, row.owner)}
            sx={{ cursor: "pointer" }}
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
                        fontWeight: "700",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                    >
                      {row.owner.phone}
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
}

function SwitchTable({
  dateList,
  onEdit,
  onDeleteSwitch,
  isForUser,
  isRetention,
}: SwitchTableProps) {
  const [isEarlyHoursUp, setIsEarlyHoursUp] = React.useState(false);
  const [isTakeUp, setIsTakeUp] = React.useState(true);
  const [isEarlyDateUp, setIsEarlyDateUp] = React.useState(true);
  let [sortedDateList, setSortedDateList] = React.useState([...dateList]);

  React.useEffect(() => {
    if (!isRetention) {
      const withRetentions = sortedDateList.filter((date) => !date.retention);
      setSortedDateList(withRetentions);
    } else {
      setSortedDateList([...dateList]);
    }
  }, [dateList, isRetention]);

  const onFilterHours = () => {
    setIsEarlyHoursUp((prevState) => !prevState);

    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (!isEarlyHoursUp) return a.startHour.localeCompare(b.startHour);
        else return b.startHour.localeCompare(a.startHour);
      })
    );
  };

  const onFilterTakes = () => {
    setIsTakeUp((prevState) => !prevState);
    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (!isTakeUp) {
          return +b.isTake - +a.isTake;
        } else {
          return +a.isTake - +b.isTake;
        }
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
      sx={!isForUser ? { overflowX: "hidden" } : { overflowX: "auto" }}
      component={Paper}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10px" }} />
            {isForUser && (
              <TableCell
                sx={{
                  cursor: "pointer",
                  paddingInlineEnd: "0",
                }}
                onClick={onFilterDates}
              >
                תאריך {isEarlyDateUp ? "↑" : "↓"}
              </TableCell>
            )}
            <TableCell
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
              onClick={onFilterTakes}
              sx={{
                width: "50px",
                cursor: "pointer",
                minWidth: "100px",
              }}
            >
              ?מוסר או לוקח {isTakeUp ? "↑" : "↓"}{" "}
            </TableCell>
            <TableCell
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
        <TableBody>
          {sortedDateList.map((date: SWDate) => (
            <Row
              isForUser={isForUser}
              onDeleteSwitch={onDeleteSwitch}
              onEdit={onEdit}
              key={date._id}
              row={date}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SwitchTable;
