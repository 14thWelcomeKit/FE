import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Introduce from "./pages/Introduce";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import ProfileImage from "./pages/ProfileImage";
import ChangePassword from "./pages/ChangePassword";
import Check from "./pages/Check";
import QRCodeScanner from "./pages/QRScanner";
import Bingo from "./pages/Bingo";
import Board from "./pages/Board";
import Setting from "./pages/Setting";

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/change-profile" element={<ProfileImage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/check" element={<Check />} />
        <Route path="/qrcodescanner" element={<QRCodeScanner />} />
        <Route path="/bingo" element={<Bingo />} />
        <Route path="/board" element={<Board />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
