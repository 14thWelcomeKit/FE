import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactQRScanner from "react-qr-scanner";
import { IoMdClose } from "react-icons/io";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import AttendanceAdmin from "../components/AttendanceAdmin";
import AttendanceMember from "../components/AttendanceMember";
import { useAuth } from "../AuthContext";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";

const AttendancePage = styled(PageContainer)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 2rem;
  overflow: visible;
`;

const PageHeader = styled.section`
  width: 100%;
  max-width: 85rem;
  margin: 3rem auto 0;
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  color: #ffff;
  font-family: Montserrat;
  font-size: 3.7rem;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  margin: 0;
  color: #ffff;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 160%;
`;

const Content = styled.main`
  display: flex;
  width: 100%;
  max-width: 85rem;
  margin: 0 auto;
  flex-direction: column;
  gap: 1.5rem;
`;

const Panel = styled.section`
  padding: 2rem;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.25rem;
  }
`;

const MessageBox = styled.div`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  box-sizing: border-box;
  background: ${(props) =>
    props.$type === "success" ? "#d4edda" : "#f8d7da"};
  color: ${(props) =>
    props.$type === "success" ? "#155724" : "#721c24"};
  font-family: Pretendard;
`;

const EmptyText = styled.p`
  margin: 0;
  color: #ffff;
  font-family: Pretendard;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
`;

const Modal = styled.div`
  display: flex;
  width: 40rem;
  max-width: 100%;
  max-height: 90vh;
  padding: 1.25rem;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  box-sizing: border-box;
  background: #ffff;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  display: flex;
  align-self: flex-end;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const CloseIcon = styled(IoMdClose)`
  width: 2rem;
  height: 2rem;
`;

const QrImage = styled.img`
  width: 95%;
  max-width: 100%;
  max-height: calc(90vh - 6rem);
  height: auto;
  object-fit: contain;
`;

const ScannerContainer = styled.div`
  width: 100%;
  max-width: 25rem;
  margin: 1rem 0;
`;

function extractQrToken(qrData) {
  if (!qrData) return "";
  const raw = String(qrData).trim();

  try {
    const token = new URL(raw).searchParams.get("token");
    if (token) return token;
  } catch {
    // QR 값이 전체 URL이 아닌 경우 기존 값을 계속 확인한다.
  }

  const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw;
  const token = new URLSearchParams(query).get("token");
  return token || raw;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ko-KR");
}

function formatDate(value) {
  if (!value) return "-";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(value);
  return `${match[1]}. ${Number(match[2])}. ${Number(match[3])}.`;
}

export default function Attendance() {
  const { userType, isAdmin, isUserInfoLoading } = useAuth();
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myAttendancePagination, setMyAttendancePagination] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20,
    first: true,
    last: true,
  });
  const [modalType, setModalType] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [updatingAttendanceIds, setUpdatingAttendanceIds] = useState(() => new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const updatingAttendanceIdsRef = useRef(new Set());
  const selectedSessionIdRef = useRef(null);
  const sessionDetailsRequestIdRef = useRef(0);
  const myAttendanceRequestIdRef = useRef(0);
  const isScanSubmitting = useRef(false);

  const showMessage = useCallback((text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const fetchTodayAttendance = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "/attendance/today/attendance"
      );
      setTodayAttendance(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      const isSessionNotFound =
        error.response?.status === 404 &&
        error.response?.data?.errorCode === "SESSION_NOT_FOUND";

      if (isSessionNotFound) {
        setTodayAttendance([]);
        return;
      }

      showMessage(
        getApiErrorMessage(error, "오늘 출석 정보를 불러오지 못했습니다.")
      );
    }
  }, [showMessage]);

  const fetchMyAttendance = useCallback(async (page = 0) => {
    const requestId = ++myAttendanceRequestIdRef.current;
    try {
      const response = await axiosInstance.get(
        "/attendance/my-attendance",
        { params: { page, size: 20 } }
      );
      if (requestId !== myAttendanceRequestIdRef.current) return;
      const data = response.data;
      setMyAttendance(Array.isArray(data?.content) ? data.content : []);
      setMyAttendancePagination({
        number: Number.isInteger(data?.number) ? data.number : page,
        totalPages: Number.isInteger(data?.totalPages) ? data.totalPages : 0,
        totalElements: Number.isInteger(data?.totalElements)
          ? data.totalElements
          : 0,
        size: Number.isInteger(data?.size) ? data.size : 20,
        first: typeof data?.first === "boolean" ? data.first : page === 0,
        last: typeof data?.last === "boolean" ? data.last : true,
      });
    } catch (error) {
      if (requestId !== myAttendanceRequestIdRef.current) return;
      showMessage(
        getApiErrorMessage(error, "내 출석 내역을 불러오지 못했습니다.")
      );
    }
  }, [showMessage]);

  useEffect(() => {
    let isMounted = true;

    if (isUserInfoLoading) {
      setIsAttendanceLoading(true);
      return () => {
        isMounted = false;
      };
    }

    const loadPage = async () => {
      try {
        if (isAdmin) {
          const sessionsResponse = await axiosInstance.get(
            "/attendance/sessions"
          );
          if (!isMounted) return;
          setSessions(
            Array.isArray(sessionsResponse.data) ? sessionsResponse.data : []
          );
        } else if (userType === "BABY_LION") {
          await Promise.all([
            fetchTodayAttendance(),
            fetchMyAttendance(0),
          ]);
          if (!isMounted) return;
        } else {
          showMessage("사용자 역할을 확인할 수 없습니다.");
        }
      } catch (error) {
        if (isMounted) {
          showMessage(
            getApiErrorMessage(error, "출석 정보를 불러오지 못했습니다.")
          );
        }
      } finally {
        if (isMounted) setIsAttendanceLoading(false);
      }
    };

    setIsAttendanceLoading(true);
    loadPage();
    return () => {
      isMounted = false;
    };
  }, [fetchMyAttendance, fetchTodayAttendance, isAdmin, isUserInfoLoading, showMessage, userType]);

  useEffect(() => {
    return () => {
      if (qrImage) URL.revokeObjectURL(qrImage);
    };
  }, [qrImage]);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get("/attendance/sessions");
      setSessions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "출석 세션 목록을 불러오지 못했습니다.")
      );
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    const requestId = ++sessionDetailsRequestIdRef.current;
    setIsDetailsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/attendance/sessions/${sessionId}`
      );
      if (requestId !== sessionDetailsRequestIdRef.current) return;
      setSessionDetails(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (requestId !== sessionDetailsRequestIdRef.current) return;
      setSessionDetails([]);
      showMessage(
        getApiErrorMessage(error, "세션 상세 정보를 불러오지 못했습니다.")
      );
    } finally {
      if (requestId === sessionDetailsRequestIdRef.current) {
        setIsDetailsLoading(false);
      }
    }
  };

  const handleSessionSelect = (sessionId) => {
    setOpenDropdownId(null);
    setSelectedSessionId(sessionId);
    selectedSessionIdRef.current = sessionId;
    fetchSessionDetails(sessionId);
  };

  const handleCreateSession = async (event) => {
    event.preventDefault();
    if (!sessionDate) {
      showMessage("출석 세션의 날짜와 시간을 선택해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/attendance/sessions", {
        sessionDate: `${sessionDate}:00`,
      });
      setSessionDate("");
      showMessage("출석 세션이 생성되었습니다.", "success");
      await fetchSessions();
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "출석 세션 생성에 실패했습니다.")
      );
    }
  };

  const handleDeleteSession = async (event, sessionId) => {
    event.stopPropagation();
    if (!window.confirm("이 출석 세션을 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/attendance/sessions/${sessionId}`);
      if (selectedSessionIdRef.current === sessionId) {
        selectedSessionIdRef.current = null;
        sessionDetailsRequestIdRef.current += 1;
        setSelectedSessionId(null);
        setSessionDetails([]);
        setIsDetailsLoading(false);
      }
      showMessage("출석 세션이 삭제되었습니다.", "success");
      await fetchSessions();
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "출석 세션 삭제에 실패했습니다.")
      );
    }
  };

  const handleStatusChange = async (attendanceId, status) => {
    if (updatingAttendanceIdsRef.current.has(attendanceId)) return;

    const sessionId = selectedSessionIdRef.current;
    updatingAttendanceIdsRef.current.add(attendanceId);
    setUpdatingAttendanceIds(new Set(updatingAttendanceIdsRef.current));

    try {
      await axiosInstance.patch(`/attendance/${attendanceId}/status`, {
        status,
      });
      showMessage("출석 상태가 변경되었습니다.", "success");
      const refreshRequests = [fetchSessions()];
      if (selectedSessionIdRef.current === sessionId && sessionId != null) {
        refreshRequests.push(fetchSessionDetails(sessionId));
      }
      await Promise.all(refreshRequests);
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "출석 상태 변경에 실패했습니다.")
      );
    } finally {
      updatingAttendanceIdsRef.current.delete(attendanceId);
      setUpdatingAttendanceIds(new Set(updatingAttendanceIdsRef.current));
    }
  };

  const openQrModal = async () => {
    setModalType("qr");
    setMessage(null);
    try {
      const response = await axiosInstance.get("/attendance/generate-qr", {
        responseType: "blob",
      });
      setQrImage(URL.createObjectURL(response.data));
    } catch (error) {
      showMessage(getApiErrorMessage(error, "QR 코드를 불러오지 못했습니다."));
    }
  };

  const openScanModal = () => {
    setModalType("scan");
    setScanResult(null);
    setMessage(null);
    isScanSubmitting.current = false;
  };

  const closeModal = () => {
    setModalType(null);
    setQrImage(null);
    setScanResult(null);
    setMessage(null);
    isScanSubmitting.current = false;
  };

  const sendQrDataToServer = async (qrData) => {
    try {
      const token = extractQrToken(qrData);
      const response = await axiosInstance.post("/attendance/success", null, {
        params: { token },
      });
      showMessage(
        response.data?.message || "출석 처리가 완료되었습니다.",
        "success"
      );
      await Promise.all([
        fetchTodayAttendance(),
        fetchMyAttendance(0),
      ]);
    } catch (error) {
      showMessage(getApiErrorMessage(error, "출석 처리에 실패했습니다."));
      isScanSubmitting.current = false;
      setScanResult(null);
    }
  };

  const handleScan = (data) => {
    if (!data?.text || isScanSubmitting.current) return;
    isScanSubmitting.current = true;
    setScanResult(data.text);
    sendQrDataToServer(data.text);
  };

  const handleScannerError = (error) => {
    console.error("QR scanner error:", error);
    showMessage(`카메라 접근에 실패했습니다: ${error.message}`);
  };

  const handleRefreshAttendance = async () => {
    if (isRefreshing) return;
  
    setIsRefreshing(true);
  
    try {
      const requests = [fetchSessions()];
      const sessionId = selectedSessionIdRef.current;
  
      if (sessionId != null) {
        requests.push(fetchSessionDetails(sessionId));
      }
  
      await Promise.all(requests);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isBabyLion = userType === "BABY_LION";
  const selectedSession = sessions.find(
    (session) => session.sessionId === selectedSessionId
  );

  return (
    <>
      <Header />
      <AttendancePage>
        <PageHeader>
          <Title>
            {userType ? (isAdmin ? "출석 관리" : "QR 출석체크") : "출석"}
          </Title>
          <Description>
            {userType
              ? isAdmin
                ? "출석 세션을 생성하고 구성원의 출석 현황을 관리할 수 있습니다."
                : "QR 코드를 스캔하고 나의 출석 현황을 확인할 수 있습니다."
              : "출석 정보를 확인하고 있습니다."}
          </Description>
        </PageHeader>

        <Content>
          {message && (
            <MessageBox role="status" $type={messageType}>
              {message}
            </MessageBox>
          )}

          {isAttendanceLoading && <Panel><EmptyText>출석 정보를 불러오는 중입니다.</EmptyText></Panel>}

          {!isAttendanceLoading && isAdmin && (
            <AttendanceAdmin
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              selectedSession={selectedSession}
              sessionDetails={sessionDetails}
              sessionDate={sessionDate}
              isDetailsLoading={isDetailsLoading}
              isRefreshing={isRefreshing}
              openDropdownId={openDropdownId}
              updatingAttendanceIds={updatingAttendanceIds}
              onSessionDateChange={(event) => setSessionDate(event.target.value)}
              onCreateSession={handleCreateSession}
              onDeleteSession={handleDeleteSession}
              onSessionSelect={handleSessionSelect}
              onStatusChange={handleStatusChange}
              onDropdownToggle={setOpenDropdownId}
              onDropdownClose={(attendanceId) =>
                setOpenDropdownId((currentId) =>
                  currentId === attendanceId ? null : currentId
                )
              }
              onOpenQrModal={openQrModal}
              onRefreshAttendance={handleRefreshAttendance}
              formatDateTime={formatDateTime}
            />
          )}

          {!isAttendanceLoading && isBabyLion && (
            <AttendanceMember
              todayAttendance={todayAttendance}
              myAttendance={myAttendance}
              pagination={myAttendancePagination}
              onOpenScanModal={openScanModal}
              onPageChange={fetchMyAttendance}
              formatDate={formatDate}
            />
          )}
        </Content>
      </AttendancePage>

      {modalType && (
        <ModalOverlay onClick={closeModal}>
          <Modal role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <CloseButton type="button" onClick={closeModal} aria-label="닫기">
              <CloseIcon />
            </CloseButton>

            {modalType === "qr" &&
              (qrImage ? (
                <QrImage src={qrImage} alt="출석용 QR 코드" />
              ) : (
                <p>QR 코드를 불러오는 중입니다.</p>
              ))}

            {modalType === "scan" && (
              <>
                {!scanResult && (
                  <ScannerContainer>
                    <ReactQRScanner
                      delay={300}
                      constraints={{
                        video: { facingMode: { ideal: "environment" } },
                      }}
                      onError={handleScannerError}
                      onScan={handleScan}
                      style={{ width: "100%" }}
                    />
                  </ScannerContainer>
                )}
                {scanResult && !message && <p>스캔 완료: 처리 중...</p>}
              </>
            )}

            {message && (
              <MessageBox role="status" $type={messageType}>
                {message}
              </MessageBox>
            )}
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
}
