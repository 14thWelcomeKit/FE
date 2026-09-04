import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
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
import Gallery from "./pages/Gallery";
import GalleryCreate from "./pages/GalleryCreate";
import GalleryDetail from "./pages/GalleryDetail";
import GalleryEdit from "./pages/GalleryEdit";
import { useAuth } from "./AuthContext";

function RequireAuth() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RequireAdmin() {
  const { isAdmin, isUserInfoLoading } = useAuth();

  if (isUserInfoLoading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/gallery" replace />;
  }

  return <Outlet />;
}

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 없이 접근 가능 */}
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/setting" element={<Setting />} />

        {/* 로그인한 사용자만 접근 가능 */}
        <Route element={<RequireAuth />}>
          <Route path="/gallery/:galleryId" element={<GalleryDetail />} />

          <Route element={<RequireAdmin />}>
            <Route path="/gallery/create" element={<GalleryCreate />} />
            <Route path="/gallery/:galleryId/edit" element={<GalleryEdit />} />
          </Route>

          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-profile" element={<ProfileImage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/check" element={<Check />} />
          <Route path="/qrcodescanner" element={<QRCodeScanner />} />
          <Route path="/bingo" element={<Bingo />} />
          <Route path="/board" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
