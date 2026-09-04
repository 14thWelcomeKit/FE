import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactQRScanner from "react-qr-scanner";
import { IoMdClose } from "react-icons/io";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import AttendanceStatusDropdown, {
  ATTENDANCE_STATUS_LABELS,
} from "../components/AttendanceStatusDropdown";
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

const PanelTitle = styled.h2`
  margin: 0 0 1.25rem;
  color: #ffff;
  font-family: Pretendard;
  font-size: 1.5rem;
`;

const SelectedSessionDate = styled.p`
  margin: -0.75rem 0 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: Pretendard;
  font-size: 1rem;
  line-height: 140%;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  min-height: 3.25rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 3.125rem;
  background: #ffff;
  color: var(--orange);
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--orange);
    color: #ffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const MobileAttendanceButton = styled(Button)`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: block;
  }
`;

const DateInput = styled.input`
  min-height: 3.25rem;
  padding: 0.65rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3.125rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  color: #ffff;
  color-scheme: dark;
  font-family: Pretendard;
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

const SessionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 19.5rem);
  justify-content: start;
  gap: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const SessionCard = styled.div`
  width: 19.5rem;
  min-height: 10rem;
  padding: 1.25rem;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--orange)" : "transparent")};
  border-radius: 1rem;
  box-sizing: border-box;
  background: ${(props) =>
    props.$selected
      ? "rgba(255, 244, 237, 0.96)"
      : "rgba(255, 255, 255, 0.9)"};
  box-shadow: ${(props) =>
    props.$selected ? "0 0 0 3px rgba(255, 96, 0, 0.18)" : "none"};
  color: var(--black);
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${(props) =>
      props.$selected ? "var(--orange)" : "rgba(255, 96, 0, 0.55)"};
  }

  &:focus-visible {
    outline: 2px solid var(--orange);
    outline-offset: 3px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
  }
`;

const SessionDate = styled.strong`
  display: block;
  margin-bottom: 0.75rem;
  font-family: Pretendard;
  font-size: 1.05rem;
`;

const CountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-family: Pretendard;
  font-size: 0.9rem;
`;

const DeleteButton = styled(Button)`
  min-height: 2.5rem;
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  background: #721c24;
  color: #ffff;
  font-size: 0.875rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 1rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 48rem;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.86);
  color: var(--black);
  font-family: Pretendard;

  th,
  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(28, 28, 28, 0.1);
    text-align: center;
  }

  th {
    background: rgba(255, 96, 0, 0.1);
    color: #50372d;
    font-size: 0.95rem;
    font-weight: 600;
  }

  tbody tr {
    transition: background-color 0.15s ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.48);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  color: #ffff;
  font-family: Pretendard;
`;

const MobileEmptyText = styled(EmptyText)`
  display: block;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const AttendanceCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const AttendanceCard = styled.article`
  display: flex;
  min-height: 8.5rem;
  padding: 1.25rem;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 1rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.88);
  color: var(--black);
  font-family: Pretendard;
`;

const AttendanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  color: #6a6a6a;
  font-size: 0.9rem;
`;

const InfoValue = styled.strong`
  color: var(--black);
  text-align: right;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid rgba(255, 96, 0, 0.45);
  border-radius: 3.125rem;
  background: rgba(255, 96, 0, 0.1);
  color: var(--orange);
  font-family: Pretendard;
  font-size: 0.9rem;
  font-weight: 600;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const HistoryItem = styled.div`
  display: flex;
  min-height: 3.75rem;
  padding: 0.75rem 1rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.9rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.86);
  color: var(--black);
  font-family: Pretendard;
`;

const HistoryDate = styled.strong`
  font-size: 1rem;
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

function getStatusLabel(status) {
  return ATTENDANCE_STATUS_LABELS[status] || status || "-";
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
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [myAttendance, setMyAttendance] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [updatingAttendanceIds, setUpdatingAttendanceIds] = useState(
    () => new Set()
  );
  const updatingAttendanceIdsRef = useRef(new Set());
  const sessionDetailsRequestIdRef = useRef(0);
  const isScanSubmitting = useRef(false);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

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
          const [todayResponse, historyResponse] = await Promise.all([
            axiosInstance.get("/attendance/today/attendance"),
            axiosInstance.get("/attendance/my-attendance"),
          ]);
          if (!isMounted) return;
          setTodayAttendance(todayResponse.data);
          setMyAttendance(historyResponse.data);
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
  }, [isAdmin, isUserInfoLoading, userType]);

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
    fetchSessionDetails(sessionId);
  };

  const fetchMemberAttendance = async () => {
    try {
      const [todayResponse, historyResponse] = await Promise.all([
        axiosInstance.get("/attendance/today/attendance"),
        axiosInstance.get("/attendance/my-attendance"),
      ]);
      setTodayAttendance(todayResponse.data);
      setMyAttendance(historyResponse.data);
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "내 출석 정보를 불러오지 못했습니다.")
      );
    }
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
      if (selectedSessionId === sessionId) {
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

    updatingAttendanceIdsRef.current.add(attendanceId);
    setUpdatingAttendanceIds(new Set(updatingAttendanceIdsRef.current));

    try {
      await axiosInstance.patch(`/attendance/${attendanceId}/status`, {
        status,
      });
      showMessage("출석 상태가 변경되었습니다.", "success");
      await Promise.all([
        fetchSessionDetails(selectedSessionId),
        fetchSessions(),
      ]);
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
      await fetchMemberAttendance();
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
            <>
              <Panel>
                <PanelTitle>출석 운영</PanelTitle>
                <ActionRow as="form" onSubmit={handleCreateSession}>
                  <DateInput
                    type="datetime-local"
                    value={sessionDate}
                    onChange={(event) => setSessionDate(event.target.value)}
                    aria-label="출석 세션 날짜와 시간"
                  />
                  <Button type="submit">세션 생성</Button>
                  <Button type="button" onClick={openQrModal}>
                    QR 생성
                  </Button>
                </ActionRow>
              </Panel>

              <Panel>
                <PanelTitle>전체 출석 세션</PanelTitle>
                {sessions.length > 0 ? (
                  <SessionGrid>
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.sessionId}
                        role="button"
                        tabIndex={0}
                        $selected={selectedSessionId === session.sessionId}
                        aria-pressed={selectedSessionId === session.sessionId}
                        onClick={() => handleSessionSelect(session.sessionId)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSessionSelect(session.sessionId);
                          }
                        }}
                      >
                        <SessionDate>
                          {formatDateTime(session.sessionDate)}
                        </SessionDate>
                        <CountGrid>
                          <span>전체 {session.totalCount}</span>
                          <span>출석 {session.presentCount}</span>
                          <span>지각 {session.lateCount}</span>
                          <span>결석 {session.absentCount}</span>
                        </CountGrid>
                        <DeleteButton
                          type="button"
                          onClick={(event) =>
                            handleDeleteSession(event, session.sessionId)
                          }
                        >
                          세션 삭제
                        </DeleteButton>
                      </SessionCard>
                    ))}
                  </SessionGrid>
                ) : (
                  <EmptyText>등록된 출석 세션이 없습니다.</EmptyText>
                )}
              </Panel>

              {selectedSessionId != null && (
                <Panel>
                  <PanelTitle>세션별 출석 상세</PanelTitle>
                  {selectedSession && (
                    <SelectedSessionDate>
                      {formatDateTime(selectedSession.sessionDate)}
                    </SelectedSessionDate>
                  )}
                  {isDetailsLoading ? (
                    <EmptyText>상세 정보를 불러오는 중입니다.</EmptyText>
                  ) : sessionDetails.length > 0 ? (
                    <TableWrapper>
                      <Table>
                        <thead>
                          <tr>
                            <th>이름</th>
                            <th>학번</th>
                            <th>팀</th>
                            <th>출석 상태</th>
                            <th>출석 시간</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionDetails.map((attendance) => (
                            <tr key={attendance.attendanceId}>
                              <td>{attendance.name}</td>
                              <td>{attendance.studentNum}</td>
                              <td>{attendance.teamName ?? "-"}</td>
                              <td>
                                <AttendanceStatusDropdown
                                  attendanceId={attendance.attendanceId}
                                  value={attendance.status}
                                  onChange={(status) =>
                                    handleStatusChange(
                                      attendance.attendanceId,
                                      status
                                    )
                                  }
                                  disabled={updatingAttendanceIds.has(
                                    attendance.attendanceId
                                  )}
                                  ariaLabel={`${attendance.name} 출석 상태`}
                                  isOpen={
                                    openDropdownId === attendance.attendanceId
                                  }
                                  onToggle={(shouldOpen) =>
                                    setOpenDropdownId(
                                      shouldOpen ? attendance.attendanceId : null
                                    )
                                  }
                                  onClose={() =>
                                    setOpenDropdownId((currentId) =>
                                      currentId === attendance.attendanceId
                                        ? null
                                        : currentId
                                    )
                                  }
                                />
                              </td>
                              <td>{formatDateTime(attendance.attendanceTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </TableWrapper>
                  ) : (
                    <EmptyText>이 세션의 출석 정보가 없습니다.</EmptyText>
                  )}
                </Panel>
              )}
            </>
          )}

          {!isAttendanceLoading && isBabyLion && (
            <>
              <Panel>
                <PanelTitle>QR 출석</PanelTitle>
                <MobileAttendanceButton type="button" onClick={openScanModal}>
                  출석하기
                </MobileAttendanceButton>
                <MobileEmptyText>출석하기 버튼은 모바일 화면에서 표시됩니다.</MobileEmptyText>
              </Panel>
              <Panel>
                <PanelTitle>오늘 내 출석 상태</PanelTitle>
                {Array.isArray(todayAttendance) &&
                todayAttendance.length > 0 ? (
                  <AttendanceCardGrid>
                    {todayAttendance.map((attendance, index) => (
                      <AttendanceCard key={`${attendance.name}-${index}`}>
                        <AttendanceInfo>
                          <InfoRow>
                            <InfoLabel>이름</InfoLabel>
                            <InfoValue>{attendance.name || "-"}</InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>팀</InfoLabel>
                            <InfoValue>{attendance.teamName ?? "-"}</InfoValue>
                          </InfoRow>
                        </AttendanceInfo>
                        <InfoRow>
                          <InfoLabel>출석 상태</InfoLabel>
                          <StatusBadge>
                            {getStatusLabel(attendance.attendanceStatus)}
                          </StatusBadge>
                        </InfoRow>
                      </AttendanceCard>
                    ))}
                  </AttendanceCardGrid>
                ) : (
                  <EmptyText>오늘 출석 정보가 없습니다.</EmptyText>
                )}
              </Panel>
              <Panel>
                <PanelTitle>내 전체 출석 내역</PanelTitle>
                {Array.isArray(myAttendance) && myAttendance.length > 0 ? (
                  <HistoryList>
                    {myAttendance.map((attendance, index) => (
                      <HistoryItem key={`${attendance.date}-${index}`}>
                        <HistoryDate>{formatDate(attendance.date)}</HistoryDate>
                        <StatusBadge>
                          {getStatusLabel(attendance.attendanceStatus)}
                        </StatusBadge>
                      </HistoryItem>
                    ))}
                  </HistoryList>
                ) : (
                  <EmptyText>출석 내역이 없습니다.</EmptyText>
                )}
              </Panel>
            </>
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
