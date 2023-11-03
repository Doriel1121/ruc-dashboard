import { createContext, useState } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [guestsList, setGuestsList] = useState([]);
  const [userEventsList, setUserEventsList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [customerId, setCustomerId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [selectedEventInfo, setSelectedEventInfo] = useState({});

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
  };

  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
    // <div>provider</div>
  );
}

export default AppContext;
