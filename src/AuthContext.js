import { createContext, useState, useContext, useEffect } from "react";
import { Cookies } from "react-cookie";

// Context 생성
const AuthContext = createContext();

// AuthProvider 생성
export function AuthProvider({ children }) {
  const cookies = new Cookies();
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.get("accessToken"));
  const [token, setToken] = useState(cookies.get("accessToken") || ""); // 쿠키에서 accessToken 가져옴

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const storedToken = cookies.get("accessToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const saveToken = (newToken) => {
    setToken(newToken);
    cookies.set("accessToken", newToken, { path: "/", sameSite: "Lax" }); // ✅ sameSite 추가
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    cookies.remove("accessToken", { path: "/" }); // 쿠키 삭제
    setIsLoggedIn(false);
    console.log("로그아웃 실행됨:", { token: "", isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 토큰을 쉽게 가져올 수 있도록 커스텀 훅 생성
export function useAuth() {
  return useContext(AuthContext);
}
