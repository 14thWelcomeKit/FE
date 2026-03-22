import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies(); // ✅ 전역에서 쿠키 인스턴스 생성

const rawBase = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: rawBase,
});

// 요청 인터셉터 (Authorization 헤더 자동 추가)
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = cookies.get("accessToken"); // ✅ 전역 쿠키 인스턴스에서 가져옴

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      console.warn(
        "⚠️ 토큰이 없음. 인증 요청이 정상적으로 동작하지 않을 수 있음."
      );
    }

    // 특정 엔드포인트 캐시 무효화 (배포 환경 stale 문제 방지)
    if (config.url && config.url.includes("/manito/my")) {
      config.headers["Cache-Control"] = "no-cache";
      config.headers["Pragma"] = "no-cache";
      config.headers["Expires"] = "0";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
