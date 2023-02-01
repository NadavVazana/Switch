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
import Typography from "@mui/material/Typography";
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
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {isForUser && (
          <TableCell component="th" scope="row">
            {new Date(row.date).toLocaleDateString("he")}
          </TableCell>
        )}
        <TableCell component="th" scope="row">
          {row.owner.fullName}
        </TableCell>
        <TableCell
          sx={{ cursor: "pointer" }}
          onClick={() =>
            window.open(
              `https://api.whatsapp.com/send?phone=${row.owner.phone.substring(
                1
              )}`
            )
          }
        >
          {row.owner.phone}
        </TableCell>
        <TableCell align="left">{`${row.startHour} - ${row.endHour}`}</TableCell>
        <TableCell align="left">{row.isTake ? "לוקח" : "מוסר"}</TableCell>
        {row.owner._id === loggedUser._id ? (
          <TableCell onClick={() => onEdit(row)} sx={{ cursor: "pointer" }}>
            ערוך
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
        {row.owner._id === loggedUser._id ? (
          <TableCell
            onClick={() => onDeleteSwitch(row._id, row.date, row.owner)}
            sx={{ cursor: "pointer" }}
          >
            מחק
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* Shift menu  */}
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Shifts
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>התחלת משמרת</TableCell>
                    <TableCell>סוף משמרת</TableCell>
                    <TableCell align="right">?גמיש</TableCell>
                    <TableCell align="right">?מוסר או לוקח</TableCell>
                    <TableCell align="right">הערות</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.startHour}
                    </TableCell>
                    <TableCell>{row.endHour}</TableCell>
                    <TableCell align="right">
                      {row.flexible ? "כן" : "לא"}
                    </TableCell>
                    <TableCell align="right">
                      {row.isTake ? "לוקח" : "מוסר"}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: "150px",
                        wordBreak: "break-all",
                      }}
                      align="right"
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
}

function SwitchTable({
  dateList,
  onEdit,
  onDeleteSwitch,
  isForUser,
}: SwitchTableProps) {
  const [isEarlyHoursUp, setIsEarlyHoursUp] = React.useState(false);
  const [isTakeUp, setIsTakeUp] = React.useState(true);
  const [isNameUp, setIsNameUp] = React.useState(false);
  const [isUserUp, setIsUserUp] = React.useState(true);
  const [isEarlyDateUp, setIsEarlyDateUp] = React.useState(true);
  const [sortedDateList, setSortedDateList] = React.useState([...dateList]);
  const loggedUser = useRecoilValue(loggedInUser);

  React.useEffect(() => {
    setSortedDateList([...dateList]);
  }, [dateList]);

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

  const onFilterNames = () => {
    setIsNameUp((prevState) => !prevState);

    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (!isNameUp) {
          return a.owner.fullName.localeCompare(b.owner.fullName);
        } else {
          return b.owner.fullName.localeCompare(a.owner.fullName);
        }
      })
    );
  };

  const onFilterUser = () => {
    setIsUserUp((prevState) => !prevState);

    setSortedDateList(
      sortedDateList.sort((a, b) => {
        if (isUserUp) {
          if (loggedUser._id === a.owner._id) return 1;
          else return -1;
        } else {
          if (loggedUser._id === b.owner._id) return 1;
          else return -1;
        }
      })
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
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
              onClick={onFilterNames}
              sx={{
                cursor: "pointer",
                paddingInlineEnd: "0",
                minWidth: "50px",
              }}
            >
              שם {isNameUp ? "↑" : "↓"}
            </TableCell>
            <TableCell sx={{ minWidth: "100px" }}>מספר טלפון</TableCell>
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
              ?מוסר או לוקח {isTakeUp ? "↑" : "↓"}
            </TableCell>
            <TableCell
              onClick={onFilterUser}
              sx={{
                cursor: "pointer",
                paddingInlineEnd: "0",
                minWidth: "100px",
              }}
            >
              ההחלפות שלי {isUserUp ? "↑" : "↓"}
            </TableCell>
            <TableCell></TableCell>
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
