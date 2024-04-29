import { Typography, Grid } from "@mui/material";
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
import Loader from "./loader";

export default function ImportFile() {
  // const [excelData, setExcelData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { setGuestsList, guestsList, selectedEventInfo, setIsActivateLogOut } =
    useContext(AppContext);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const FetchData = useFetch();
  // const navigation = useNavigate();
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
      console.log("parsedData", parsedData);
      console.log("selectedEventInfo", selectedEventInfo);
      if (parsedData.length > Number(selectedEventInfo.max_guests_amount)) {
        e.target.value = "";
        setMessage("חרגת ממגבלת המוזמנים שלך");
        setIsOpen(true);
        return;
      }

      const thickGuestsList = addDataToGuestsList(parsedData);
      console.log(thickGuestsList);
      // setExcelData(parsedData);
      if (thickGuestsList.length > 0) {
        storeListOnDb(thickGuestsList);
      } else {
        setMessage("מבנה קובץ לא תקין או ריק");
        setIsOpen(true);
      }
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
      if (err?.response?.data?.isLoginSuccess === false) {
        console.log("here");
        setIsActivateLogOut(true);
      } else {
        console.log(err);
        setMessage("משהו השתבש בשמירת המוזמנים");
        setIsOpen(true);
        dispatch({ type: "ERROR" });
        throw err;
      }
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
        (element.eventId = eventInfoFromSession._id),
        (element.customerId = eventInfoFromSession.customerId);
    });
    console.log(copy);
    return copy;
  }
  if (state.loading) {
    return <Loader />;
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
        <SimpleSnackbar
          isOpen={isOpen}
          handleIsOpen={setIsOpen}
          text={message}
        />
      ) : null}
    </Grid>
  );
}
