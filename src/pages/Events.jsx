import { useFetch } from "../hooks/useFetch";
import { useContext, useState, useReducer } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import "../styles/events.css";
import Loader from "../components/loader";
import { useQuery } from "react-query";
import { Box, Typography } from "@mui/material";
import DownloadFile from "../components/downloadFile";

export default function Events() {
  const {
    userEventsList,
    setSelectedEventInfo,
    selectedEventInfo,
    setUserEventsList,
    setGuestsList,
    customerId,
  } = useContext(AppContext);
  const navigation = useNavigate();
  const FetchData = useFetch();
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [localUserInfo, setLocalUserInfo] = useState();

  const { data: queryEventList, isLoading } = useQuery({
    queryFn: () => fetchAllEvents(),
    queryKey: ["events"],
  });

  // useMemo(() => setGuestsList([]), [selectedEventInfo]);
  const fetchAllEvents = async () => {
    console.log("userEventsList", userEventsList);
    if (userEventsList.length > 0) {
      return userEventsList;
    } else {
      try {
        const sessionUserInfo = JSON.parse(
          sessionStorage.getItem("customerInfo")
        );
        setLocalUserInfo(sessionUserInfo);
        const id = customerId || sessionUserInfo?.userId;
        // if (userEventsList.length === 0) {
        dispatch({ type: "START" });
        const res = await FetchData(`/userEvents/${id}`, "get");
        // .then((res) => {
        dispatch({ type: "SUCCESS" });
        setUserEventsList(res.data.data);
        return res.data.data;
        // })
      } catch (err) {
        // }
        dispatch({ type: "ERROR" });
        console.log(err);
        throw err;
      }
    }
  };

  // useEffect(() => {
  //   console.log("rendered because of session");
  //   const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
  //   setLocalUserInfo(sessionUserInfo);
  // }, []);

  const handleSelectedEvent = (eventInfo) => {
    sessionStorage.setItem("eventInfo", JSON.stringify(eventInfo));
    if (JSON.stringify(eventInfo) !== JSON.stringify(selectedEventInfo)) {
      setGuestsList([]);
      setSelectedEventInfo(eventInfo);
    }
    navigation("/dashboard");
  };

  if (state.loading || isLoading) return <Loader />;
  if (state.error) return "משהו השתבש";

  return (
    <div className="events">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 className="title">
          היי {localUserInfo?.name} יש לך {queryEventList?.length} אירועים
        </h2>
        <Typography
          className="downloadBtn"
          onClick={() =>
            DownloadFile(
              "https://dev-rucoming.pantheonsite.io/wp-content/uploads/2024/02/schema.xlsx",
              "תבנית מוזמנים"
            )
          }
        >
          הורד תבנית
        </Typography>
      </Box>
      <div className="eventsListWrapper">
        {queryEventList?.map((item) => {
          return (
            <div
              onClick={() => handleSelectedEvent(item)}
              className="eventBox"
              key={item._id}
            >
              <div>
                <b className="label type">סוג אירוע: </b>
                <span>{item?.type}</span>
              </div>
              <div>
                <b className="label location">מיקום: </b>
                <span>{item?.location}</span>
              </div>
              <div>
                <b className="label date">תאריך: </b>
                <span>{item?.date}</span>
              </div>
              <div>
                <b className="label amount">מספר מוזמנים: </b>
                <span>
                  {item?.guests_amount === "0" ? (
                    <span style={{ color: "red", fontSize: "14px" }}>
                      עדיין לא אמרת לי מי המוזמנים
                    </span>
                  ) : (
                    item?.guests_amount
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
