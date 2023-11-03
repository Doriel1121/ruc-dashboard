import { useFetch } from "../hooks/useFetch";
import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import "../styles/events.css";

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

  useEffect(() => {
    const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
    const id = customerId || sessionUserInfo?.userId;
    // const cookies = Cookies.get();
    // if (cookies && cookies.login_session) {
    // setIsLoggedIn(true);
    if (userEventsList.length === 0) {
      FetchData(`/userEvents/${id}`, "get")
        .then((res) => {
          console.log(res);
          setUserEventsList(res.data.customerEvents);
        })
        .catch((err) => {
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

  return (
    <div>
      <h2>
        היי {userInfo.name} יש לך {userEventsList.length} אירועים
      </h2>
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
  );
}
