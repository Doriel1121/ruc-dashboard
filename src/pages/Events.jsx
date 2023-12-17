import { useFetch } from "../hooks/useFetch";
import { useContext, useEffect, useState, useReducer } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import "../styles/events.css";
import Loader from "../components/loader";

export default function Events() {
  const {
    userEventsList,
    setSelectedEventInfo,
    setUserEventsList,
    customerId,
    userInfo,
  } = useContext(AppContext);
  const navigation = useNavigate();
  const FetchData = useFetch();
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [localUserInfo, setLocalUserInfo] = useState();

  useEffect(() => {
    const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
    setLocalUserInfo(sessionUserInfo);
    const id = customerId || sessionUserInfo?.userId;
    // const cookies = Cookies.get();
    // if (cookies && cookies.login_session) {
    // setIsLoggedIn(true);
    if (userEventsList.length === 0) {
      dispatch({ type: "START" });
      FetchData(`/userEvents/${id}`, "get")
        .then((res) => {
          dispatch({ type: "SUCCESS" });
          console.log(res);
          setUserEventsList(res.data.customerEvents);
        })
        .catch((err) => {
          dispatch({ type: "ERROR" });
          console.log(err);
        });
    }
    // } else {
    //   setIsLoggedIn(false);
    //   navigation("/login");
    // }
  }, []);

  const handleSelectedEvent = (eventInfo) => {
    sessionStorage.setItem("eventInfo", JSON.stringify(eventInfo));
    console.log(sessionStorage.getItem("eventInfo"));
    setSelectedEventInfo(eventInfo);
    navigation("/dashboard");
  };

  if (state.loading) return <Loader />;
  if (state.error) return "משהו השתבש";

  return (
    <div className="events">
      <h2 className="title">
        היי {localUserInfo?.name} יש לך {userEventsList?.length} אירועים
      </h2>
      <div className="eventsListWrapper">
        {userEventsList?.map((item) => {
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
                <span>{item?.invited_amount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
