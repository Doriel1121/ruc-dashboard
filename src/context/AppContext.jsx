import { createContext, useState } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [guestsList, setGuestsList] = useState([]);
  const [userEventsList, setUserEventsList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [customerId, setCustomerId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isActivateLogOut, setIsActivateLogOut] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(
    JSON.parse(sessionStorage.getItem("eventInfo"))
  );

  const handleReset = (value) => {
    setGuestsList([]);
    setUserEventsList([]);
    setIsLoggedIn(undefined);
    setCustomerId("");
    setUserInfo({});
    setSelectedEventInfo({});
    sessionStorage.clear();
    setIsActivateLogOut(false);
  };

  const values = {
    guestsList,
    setGuestsList,
    isLoggedIn,
    setIsLoggedIn,
    customerId,
    setCustomerId,
    userEventsList,
    setUserEventsList,
    selectedEventInfo,
    setSelectedEventInfo,
    userInfo,
    setUserInfo,
    handleReset,
    isActivateLogOut,
    setIsActivateLogOut,
  };

  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
    // <div>provider</div>
  );
}

export default AppContext;
