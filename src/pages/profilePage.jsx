import React from "react";
import AppContext from "../context/AppContext";
import { useContext, useEffect, useState, useReducer } from "react";

export default function ProfilePage() {
  const { guestsList, selectedEventInfo, setGuestsList, isLoggedIn, userInfo } =
    useContext(AppContext);
  return (
    <div>
      PROFILE
      {userInfo.role === 1 ? "יש ברשותך הרשאות מנהל" : "משתמש"}
    </div>
  );
}
