import "../styles/home.css";
import { useContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ImportFile from "../components/importFile";
import AppContext from "../context/AppContext";
import ReactVirtualizedTable from "../components/CustomTable";
import CountdownTimer from "../components/CountdownTimer";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import Loader from "../components/loader";
import { useFetch } from "../hooks/useFetch";
import debounce from "lodash/debounce";

export default function HomePage() {
  const [eventInfo, setEventInfo] = useState();
  const [localGuests, setLocalGuests] = useState();
  // const [localEvent, setLocalEvent] = useState(
  //   JSON.parse(sessionStorage.getItem("eventInfo"))
  // );
  const [dateOfEvent, setDateOfEvent] = useState();
  const [IsAttendingService, setIsAttendingService] = useState(false);
  const [filter, setFilter] = useState("");

  const { guestsList, selectedEventInfo, setGuestsList, isLoggedIn, userInfo } =
    useContext(AppContext);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const FetchData = useFetch();

  useEffect(() => {
    console.log("user info", userInfo);
    // if (!isLoggedIn) return navigation("/login");
    const sessionEvent = JSON.parse(sessionStorage.getItem("eventInfo"));
    const eventInformation =
      Object.keys(selectedEventInfo).length > 0
        ? selectedEventInfo
        : sessionEvent;
    if (!!eventInformation === true) {
      setIsAttendingService(
        eventInformation?.serviceType?.value !== 2 ? true : false
      );
      setEventInfo(eventInformation);
      setDateOfEvent(eventInformation.date);
      const filteredList = guestsList?.filter(
        (list) => list.eventId === eventInformation._id
      );
      if (
        filteredList?.length === 0 ||
        filteredList?.data?.length === 0 ||
        filteredList === undefined
      ) {
        dispatch({ type: "START" });
        FetchData(
          `/availableGuests/${eventInformation._id}/${eventInformation.customerId}`,
          "get",
          {}
        )
          .then((res) => {
            dispatch({ type: "SUCCESS", payload: res.data });
            if (res.data.length > 0) {
              setGuestsList([
                { eventId: eventInformation._id, data: res.data },
              ]);
            }
            calculateAmount(res.data);
          })
          .catch((err) => {
            dispatch({ type: "ERROR" });
          });
      } else {
        console.log("fetch avaliable guests not needed", filteredList);
        dispatch({ type: "SUCCESS", payload: filteredList[0] });
      }
    }
  }, [guestsList]);

  const calculateAmount = (data, type) => {
    if (type === "coming") {
      return data.filter((guest) => guest.isComing === true).length;
    } else {
      return data.filter((guest) => guest.isComing === false).length;
    }
  };

  const handleSearch = debounce((value) => {
    setFilter(value);
    filterData(value);
  }, 300);

  const filterData = (value) => {
    const lowerCaseValue = value;
    let filtered;
    filtered = guestsList[0].data.filter((item) =>
      item.name.includes(lowerCaseValue)
    );
    setLocalGuests(filtered);
  };

  const handleDownload = () => {
    const data = localGuests || state.post.data;
    const filteredData = data.map(({ name, phone, isComing, amount }) => ({
      name,
      phone,
      isComing,
      amount,
    }));
    const filename = "רשימת מאשרי הגעה";
    // Convert the object data to CSV format
    const csvContent =
      "\uFEFF" +
      Object.keys(filteredData[0]).join(",") +
      "\n" +
      filteredData.map((item) => Object.values(item).join(",")).join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "data.csv";

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  if (state.loading) return <Loader />;
  if (!!eventInfo === false) return <span> לא נבחר אירוע</span>;
  // return <Loader />;

  return state?.post?.data?.length > 0 ? (
    <div>
      <Box className="summary">
        <Box className="summary-child summary-timer">
          <Typography
            sx={{
              textAlign: "right",
              fontSize: "40px",
              fontFamily: "system-ui",
              fontWeight: 200,
            }}
          >
            מתרגשים יחד איתכם
          </Typography>
          <Box>
            <CountdownTimer targetDate={dateOfEvent} />
          </Box>
        </Box>
        <Box className="summary-child summary-total">
          <Typography sx={{ textAlign: "right" }}>מספר מוזמנים</Typography>
          <b>{state.post.data.length}</b>
        </Box>
        {IsAttendingService ? (
          <>
            <Box className="summary-child summary-approved">
              <Typography sx={{ textAlign: "right" }}>מספר מאשרים</Typography>
              <b>{calculateAmount(state.post.data, "coming")}</b>
            </Box>
            <Box className="summary-child summary-declined">
              <Typography sx={{ textAlign: "right" }}>
                מספר לא מאשרים
              </Typography>
              <b>{calculateAmount(state.post.data, "notComing")}</b>
            </Box>
          </>
        ) : null}
      </Box>
      <Box className="tableWrapper">
        <Typography className="tableTitle">
          <span>מוזמנים</span>
        </Typography>
        <Box className="searchWrapper">
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
              style: {
                borderRadius: "15px",
                padding: "0px 15px",
              },
            }}
            sx={{
              // "& label": {
              //   left: "unset",
              //   right: "1.75rem",
              //   transformOrigin: "right",
              //   fontFamily: "system-ui",
              //   fontSize: "13px",
              // },
              // "& legend": {
              //   textAlign: "right",
              //   fontSize: "0.6rem",
              // },
              // "& .MuiOutlinedInput-root": {
              //   "& fieldset": {
              //     borderColor: "#E5E7EB",
              //   },
              // },
              width: "40%",
              minWidth: "300px",
            }}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="הכנס שם של מוזמן"
            label="שם מוזמן"
            variant="outlined"
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleDownload}
              sx={{ color: "#678579" }}
              label="הורד"
            >
              הורד
              <FileDownloadOutlinedIcon />
            </Button>
            <Button sx={{ color: "#678579" }} label="העלה">
              העלה
              <FileUploadOutlinedIcon />
            </Button>
          </Box>
        </Box>
        <ReactVirtualizedTable data={localGuests || state.post.data} />
      </Box>
    </div>
  ) : (
    <ImportFile />
  );
}
