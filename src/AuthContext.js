import { createContext, useState, useContext, useEffect } from "react";
import { Cookies } from "react-cookie";
import axiosInstance, { AUTH_UNAUTHORIZED_EVENT } from "./axiosInstance";

// Context 생성
const AuthContext = createContext();
const cookies = new Cookies();

// AuthProvider 생성
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.get("accessToken"));
  const [token, setToken] = useState(cookies.get("accessToken") || ""); // 쿠키에서 accessToken 가져옴
  const [userType, setUserType] = useState(null);
  const [checkedToken, setCheckedToken] = useState(null);
  const [userInfoError, setUserInfoError] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUserType(null);
      setCheckedToken(null);
      setUserInfoError(false);
      setToken("");
      setIsLoggedIn(false);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    setUserType(null);
    setCheckedToken(null);
    setUserInfoError(false);

    if (!token) {
      return () => {
        cancelled = true;
      };
    }

    const fetchUserType = async () => {
      try {
        const response = await axiosInstance.get("/user/info");

        if (!cancelled) {
          setUserType(response.data?.userType ?? null);
          setUserInfoError(false);
        }
      } catch (error) {
        if (!cancelled) {
          setUserType(null);
          setUserInfoError(error.response?.status !== 401);
        }
      } finally {
        if (!cancelled) {
          setCheckedToken(token);
        }
      }
    };

    fetchUserType();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isUserInfoLoading = Boolean(token) && checkedToken !== token;
  const isAdmin =
    Boolean(token) && checkedToken === token && userType === "ADMIN";

  const saveToken = (newToken) => {
    setUserType(null);
    setCheckedToken(null);
    setUserInfoError(false);
    setToken(newToken);
    cookies.set("accessToken", newToken, { path: "/", sameSite: "Lax" }); // ✅ sameSite 추가
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserType(null);
    setCheckedToken(null);
    setUserInfoError(false);
    setToken("");
    cookies.remove("accessToken", { path: "/" }); // 쿠키 삭제
    setIsLoggedIn(false);
    console.log("로그아웃 실행됨:", { token: "", isLoggedIn: false });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        userType,
        isAdmin,
        isUserInfoLoading,
        userInfoError,
        saveToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 토큰을 쉽게 가져올 수 있도록 커스텀 훅 생성
export function useAuth() {
  return useContext(AuthContext);
}
