import { Box, Typography, Grid, TextField } from "@mui/material";
import * as React from "react";
import { useState, useContext, useReducer } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx";
import AppContext from "../context/AppContext";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import axios from "axios";

export default function ImportFile() {
  const [excelData, setExcelData] = useState(null);
  const { setGuestsList, guestsList } = useContext(AppContext);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const handleFileChange = (e) => {
    console.log("here");
    console.log(e);
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event?.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);

      const thickGuestsList = addDataToGuestsList(parsedData);
      console.log("with is coming", thickGuestsList);
      // const eventInfoFromSession = eventFromSession();

      // setGuestsList({
      //   eventId: eventInfoFromSession._id,
      //   data: thickGuestsList,
      // });
      setExcelData(parsedData);
      storeListOnDb(thickGuestsList);
    };
    reader.readAsBinaryString(file);
  };

  const storeListOnDb = (payload) => {
    dispatch({ type: "START" });
    axios
      .post("http://localhost:3000/eventGuests", payload)
      .then((res) => {
        const eventInfoFromSession = eventFromSession();

        console.log(guestsList);
        if (guestsList.length > 0) {
          console.log("guestsList.length", guestsList.length, guestsList);
          guestsList.map((list, index) => {
            if (list?.eventId !== eventInfoFromSession._id) {
              if (index === guestsList.length - 1) {
                console.log("guestsList last", guestsList.length, guestsList);
                setGuestsList((prev) => {
                  prev, { eventId: eventInfoFromSession._id, data: payload };
                });
              }
            }
          });
        } else {
          setGuestsList([{ eventId: eventInfoFromSession._id, data: payload }]);
        }
        console.log("guestsList", guestsList);
        // setGuestsList({ eventId: eventInfoFromSession._id, data: payload });
        dispatch({ type: "SUCCESS", payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: "ERROR" });
      });
  };
  const eventFromSession = () => {
    return JSON.parse(sessionStorage.getItem("eventInfo"));
  };

  function addDataToGuestsList(parsedData) {
    const eventInfoFromSession = eventFromSession();
    console.log(eventInfoFromSession);
    const copy = JSON.parse(JSON.stringify(parsedData));
    copy.forEach((element) => {
      (element.isComing = null),
        (element.amount = 2),
        (element.eventId = eventInfoFromSession._id),
        (element.customerId = eventInfoFromSession.customerId);
    });
    console.log("payload", copy);
    return copy;
  }

  return (
    <Grid item xs={12} sm={4} md={6}>
      <p className="text">
        רשימת מוזמנים
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit"> מבנה קובץ EXCEL לדוגמה</Typography>
              <table>
                <thead>
                  <tr>
                    <td>
                      <b>שם</b>
                    </td>
                    <td>
                      <b>טלפון</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ישראל</td>
                    <td>ישראלי</td>
                  </tr>
                  <tr>
                    <td>ישראלה</td>
                    <td>ישראליה</td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          }
        >
          <span className="tooltip">**מבנה</span>
        </HtmlTooltip>
      </p>{" "}
      {/* <CustomTextField
                  isRequired={true}
                  name="רשימת מוזמנים"
                  classAttr={'customFieldStyle'}
                  label="רשימת מוזמנים"
                  type="file"
                  uniqKey={0}
                /> */}
      <TextField
        required
        type="file"
        className="customFieldStyle"
        inputProps={{
          accept:
            ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        }}
        onChange={handleFileChange}
      />
    </Grid>
  );
}
