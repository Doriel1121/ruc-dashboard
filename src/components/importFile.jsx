import { Typography, Grid, TextField } from "@mui/material";
import * as React from "react";
import { useState, useContext, useReducer } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx";
import AppContext from "../context/AppContext";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import { useMutation, useQueryClient } from "react-query";
import { useFetch } from "../hooks/useFetch";
import SimpleSnackbar from "./SnackBar";
import InputFileUpload from "./uploadButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ImportFile() {
  const [excelData, setExcelData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setGuestsList, guestsList, selectedEventInfo } =
    useContext(AppContext);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const FetchData = useFetch();

  const queryClient = useQueryClient();

  const { mutateAsync: updateGuestsList } = useMutation({
    mutationFn: (e) => handleFileChange(e),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

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

  const handleFileChange = async (e) => {
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
      console.log("selectedEventInfo", selectedEventInfo);
      if (parsedData.length > Number(selectedEventInfo.max_guests_amount)) {
        e.target.value = "";
        setIsOpen(true);
        return;
      }

      const thickGuestsList = addDataToGuestsList(parsedData);
      setExcelData(parsedData);
      storeListOnDb(thickGuestsList);
    };
    reader.readAsBinaryString(file);
  };

  const storeListOnDb = async (payload) => {
    dispatch({ type: "START" });
    try {
      const res = await FetchData("/eventGuests", "post", payload);
      const eventInfoFromSession = eventFromSession();
      if (guestsList.length > 0) {
        guestsList.map((list, index) => {
          if (list?.eventId !== eventInfoFromSession._id) {
            if (index === guestsList.length - 1) {
              setGuestsList((prev) => {
                prev, { eventId: eventInfoFromSession._id, data: payload };
              });
            }
          }
        });
      } else {
        setGuestsList([{ eventId: eventInfoFromSession._id, data: payload }]);
      }
      // setGuestsList({ eventId: eventInfoFromSession._id, data: payload });
      dispatch({ type: "SUCCESS", payload: res.data });
      // })
    } catch (err) {
      console.log(err);
      dispatch({ type: "ERROR" });
      throw err;
    }
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
    return copy;
  }

  return (
    <Grid
      sx={{
        height: "100%",
        flexDirection: "column-reverse",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      item
      xs={12}
      sm={4}
      md={6}
    >
      <Typography sx={{ fontSize: "14px" }} className="text">
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit"> מבנה קובץ csv לדוגמה</Typography>
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
          <span className="tooltip">מבנה</span>
        </HtmlTooltip>
      </Typography>
      <InputFileUpload updateGuestsList={updateGuestsList} />
      {isOpen ? (
        <SimpleSnackbar isOpen={isOpen} handleIsOpen={setIsOpen} />
      ) : null}
    </Grid>
  );
}
