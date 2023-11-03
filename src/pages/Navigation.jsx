import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "./Events";
import HomePage from "./HomePage";
import TemporaryDrawer from "../components/Drawer";

export default function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<TemporaryDrawer />} />
      <Route path="/events" element={<Events />} />
      <Route path="/account" element={<Events />} />
    </Routes>
  );
}
