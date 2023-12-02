import "../styles/profile.css";
import AppContext from "../context/AppContext";
import { useContext, useEffect, useState, useReducer } from "react";
import CustomerEditEvent from "../components/customerEditEvent";
import Events from "./Events";
import { useFetch } from "../hooks/useFetch";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import Loader from "../components/loader";
import InlineLoader from "../components/InlineLoader";
import AdditionalActions from "../components/additionalActions";
import { useRef } from "react";

export default function ProfilePage() {
  const { userInfo, userEventsList, setUserEventsList } =
    useContext(AppContext);
  const [localUserInfo, setLocalUserInfo] = useState();
  const [localEvenInfo, setLocalEvenInfo] = useState();
  const FetchData = useFetch();
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const selectedEventRef = useRef(null);

  useEffect(() => {
    const customer = JSON.parse(sessionStorage.getItem("customerInfo"));
    const event = JSON.parse(sessionStorage.getItem("eventInfo"));
    console.log("event info", localEvenInfo);
    console.log("session user data", customer);
    setLocalUserInfo(customer);
    if (!!event === true) {
      console.log("is event exist");
      setLocalEvenInfo(event);
    }
    if (userEventsList.length === 0) {
      FetchData(`/userEvents/${customer.userId}`, "get")
        .then((res) => {
          console.log(res);
          const filteredList = res.data.customerEvents.filter(
            (singleEvent) => !isDatePassed(singleEvent.date)
          );
          console.log(filteredList);
          setUserEventsList(filteredList);
          setLocalEvenInfo(res.data.customerEvents[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  function isDatePassed(targetDate) {
    const targetDateObj = new Date(targetDate);
    const currentDate = new Date();
    return targetDateObj < currentDate;
  }

  const saveTemplate = () => {
    const payload = {
      name: "testTemplate",
      eventTypeId: "65057b8b3011d1c1d6b7c668",
      eventOptionId: "64e0d4496c47909abf598201",
    };
    FetchData(`/saveTemplate`, "post", payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (payload) => {
    dispatch({ type: "START" });
    FetchData("/updateEventInfo", "post", payload)
      .then((res) => {
        dispatch({ type: "SUCCESS", payload: res.data });

        console.log(res);
      })
      .catch((err) => {
        dispatch({ type: "ERROR" });
        console.log(err);
      });
  };

  const handleSelectedEvent = (e, data) => {
    console.log(data);
    // selectedEvent.current = data;
    setLocalEvenInfo(data);
    // Focus on the corresponding element using the ref
    selectedEventRef.current.focus();
  };
  return (
    <div className="profileContainer">
      <h2 className="profileTitle"> ברוך הבא {localUserInfo?.name} </h2>
      <h3>אירועים פעילים</h3>
      <div className="eventsListContainer">
        {userEventsList?.map((event) => {
          // console.log(event._id, localEvenInfo._id);
          return (
            <div
              onClick={(e) => handleSelectedEvent(e, event)}
              className={`eventWrapper ${
                localEvenInfo?._id === event._id ? "selected" : ""
              }`}
              key={event._id}
              ref={localEvenInfo?._id === event._id ? selectedEventRef : null}
            >
              <div>
                <label>סוג: </label>
                <span>{event.type}</span>
              </div>
              <div>
                <label>תאריך: </label>
                <span>{event.date}</span>
              </div>
              <div>
                <label>האירוע של : </label>
                <span>
                  {event.type === "חתונה"
                    ? event.broom + " ו" + event.bride
                    : event.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="editInputsWrapper">
        {!!localEvenInfo === true ? (
          state.loading ? (
            <InlineLoader />
          ) : (
            <CustomerEditEvent
              updateEvent={handleUpdate}
              eventInfo={localEvenInfo}
            />
          )
        ) : null}
      </div>
      {/* {localUserInfo?.role === 1 ? (
        <button onClick={saveTemplate}>שמור עיצוב</button>
      ) : null} */}
      <AdditionalActions eventData={localEvenInfo} />
    </div>
  );
}
