import React, { useState, useEffect } from "react";
import ReactQRScanner from "react-qr-scanner";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";

function extractQrToken(qrData) {
  if (!qrData) return "";
  const raw = String(qrData).trim();

  try {
    const token = new URL(raw).searchParams.get("token");
    if (token) return token;
  } catch {
    // QR 값이 전체 URL이 아닌 경우
  }

  const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw;
  const token = new URLSearchParams(query).get("token");
  return token || raw;
}

const QRScanner = () => {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    if (result) {
      sendQRDataToServer(result);
    }
  }, [result]);

  const sendQRDataToServer = async (qrData) => {
    try {
      const token = extractQrToken(qrData);
      const response = await axiosInstance.post("/attendance/success", null, {
        params: { token },
      });

      setMessage(`서버 응답: ${response.data.message}`);
    } catch (error) {
      console.error("서버 요청 실패:", error);
      setMessage(getApiErrorMessage(error, "서버 요청 실패"));
    }
  };

  return (
    <div>
      <h3>Scan QR Code</h3>
      <ReactQRScanner
        delay={300}
        facingMode={"environment"}
        onError={handleError}
        onScan={handleScan}
      />
      <div>{result && <p>Scanned result: {result}</p>}</div>
      <div>{message && <p>{message}</p>}</div>
    </div>
  );
};

export default QRScanner;
