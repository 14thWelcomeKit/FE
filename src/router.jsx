import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import MyPage from "./pages/MyPage";
import Check from "./pages/Check";
import Bingo from "./pages/Bingo";
import Introduce from "./pages/Introduce";
import Login from "./pages/Login";
import SignUp from "./pages/Sign";
import QRCodeScanner from "./pages/QRScanner";
import ChangePassword from "./pages/ChangePassword";
import ProfileImage from "./pages/ProfileImage";

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* 호환성: 과거 코드에서 /main 으로 이동하던 부분 처리 */}
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/check" element={<Check />} />
        <Route path="/bingo" element={<Bingo />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/qrcodescanner" element={<QRCodeScanner />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/change-profile" element={<ProfileImage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
