import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Read } from "./pages/Read";
import { Write } from "./pages/Write";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Read />} />
        <Route path="/write" exact element={<Write />} />
      </Routes>
    </BrowserRouter>
  );
};
