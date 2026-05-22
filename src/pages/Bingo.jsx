import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import { BsExclamationTriangle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../axiosInstance";

const HOLD_HOURS = 12;

// ─── API helpers ────────────────────────────────────────────────────────────

const getErrorMessage = (error, fallback = "요청에 실패했습니다.") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://api.z0.co.kr${url.startsWith("/") ? "" : "/"}${url}`;
};

// ─── normalizers ────────────────────────────────────────────────────────────

const normalizeGlobalCell = (cell) => ({
  cellId: cell.cellId,
  status:
    cell.status === "OCCUPIED"
      ? "OCCUPIED"
      : cell.status === "PROCESSING"
        ? "PENDING"
        : "AVAILABLE",
  missionTitle: cell.mission ?? cell.missionTitle ?? "",
  imageUrl: resolveImageUrl(cell.imageUrl),
  teamName: cell.teamName ?? null,
  borderType: null,
});

const normalizeTeamCell = (cell) => {
  const bt = cell.borderType ?? "NONE";
  const uiStatus =
    bt === "BLACK" || bt === "GRAY"
      ? "OCCUPIED"
      : bt === "PROCESSING_OURS" || bt === "PROCESSING_OTHERS"
        ? "PENDING"
        : "AVAILABLE";
  return {
    cellId: cell.cellId,
    status: uiStatus,
    borderType: bt,
    isOurTeam: cell.isOurTeam ?? false,
    imageUrl: resolveImageUrl(cell.imageUrl),
    missionTitle: cell.mission ?? cell.missionTitle ?? "",
  };
};

const normalizeGlobalDetail = (d) => ({
  cellId: d.cellId,
  status:
    d.status === "OCCUPIED"
      ? "OCCUPIED"
      : d.status === "PROCESSING"
        ? "PENDING"
        : "AVAILABLE",
  missionTitle: d.mission?.title ?? "",
  missionDescription: d.mission?.description ?? d.mission?.discription ?? "",
  imageUrl: resolveImageUrl(d.displayData?.imageUrl ?? ""),
  teamName: d.displayData?.teamName ?? null,
  remainingTime: d.displayData?.remainingTime ?? null,
  statusLabel: d.displayData?.statusLabel ?? null,
  remainingSeconds: null,
  isMine: false,
  borderType: null,
});

const normalizeTeamDetail = (d) => {
  const bt = d.borderType ?? d.status ?? "NONE";
  const uiStatus =
    bt === "BLACK" || bt === "GRAY" || d.status === "OCCUPIED"
      ? "OCCUPIED"
      : bt === "PROCESSING_OURS" ||
          bt === "PROCESSING_OTHERS" ||
          d.status === "PROCESSING"
        ? "PENDING"
        : "AVAILABLE";

  const isMine = bt === "PROCESSING_OURS" || bt === "BLACK";

  return {
    cellId: d.cellId,
    status: uiStatus,
    borderType: bt,
    isMine,
    missionTitle: d.mission?.title ?? "",
    missionDescription: d.mission?.description ?? d.mission?.discription ?? "",
    imageUrl: resolveImageUrl(d.displayData?.imageUrl ?? ""),
    teamName: d.displayData?.teamName ?? null,
    remainingSeconds: d.displayData?.remainingSeconds ?? null,
    remainingTime: d.displayData?.remainingTime ?? null,
    isConfirmed: d.displayData?.isConfirmed ?? false,
  };
};

// ─── API calls ──────────────────────────────────────────────────────────────

async function getMyTeamInfo() {
  try {
    const res = await axiosInstance.get("/v1/team/me");
    const d = res?.data ?? res;
    return {
      teamId: d?.teamId ?? d?.id ?? null,
      teamName: d?.teamName ?? d?.name ?? "우리팀",
    };
  } catch {
    return { teamId: null, teamName: "우리팀" };
  }
}

async function getGlobalBoard() {
  const res = await axiosInstance.get("/v1/bingo/global");
  const d = res?.data ?? res;
  return (d?.cells ?? (Array.isArray(d) ? d : [])).map(normalizeGlobalCell);
}

async function getTeamBoard() {
  const res = await axiosInstance.get("/v1/bingo/team");
  const d = res?.data ?? res;
  return {
    teamName: d?.teamName ?? null,
    cells: (d?.cells ?? (Array.isArray(d) ? d : [])).map(normalizeTeamCell),
  };
}

async function getGlobalDetail(cellId) {
  const res = await axiosInstance.get(`/v1/bingo/global/${cellId}`);
  return normalizeGlobalDetail(res?.data ?? res);
}

async function getTeamDetail(cellId) {
  const res = await axiosInstance.get(`/v1/bingo/team/${cellId}`);
  return normalizeTeamDetail(res?.data ?? res);
}

async function uploadMissionPhoto(cellId, file, method = "post") {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosInstance[method](
    `/v1/bingo/team/${cellId}/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res?.data ?? res;
}

// ─── UI helpers ─────────────────────────────────────────────────────────────

const getCellColor = (status) => {
  if (status === "PENDING") return "#FFF36A";
  if (status === "OCCUPIED") return "#FF5A5A";
  return "#FFFFFF";
};

const getPanelBgColor = (status) => {
  if (status === "PENDING") return "#FFFBE0";
  if (status === "OCCUPIED") return "#FFE2DD";
  return "#FFFFFF";
};

const formatSeconds = (totalSeconds) => {
  if (totalSeconds == null || totalSeconds < 0) return null;
  const s = Math.floor(totalSeconds);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

// ─── Component ──────────────────────────────────────────────────────────────

function NewBingo() {
  const [myTeam, setMyTeam] = useState(null);
  const [globalBoard, setGlobalBoard] = useState([]);
  const [teamBoard, setTeamBoard] = useState([]);
  const [teamName, setTeamName] = useState(null);

  const [selectedCellId, setSelectedCellId] = useState(null);
  const [selectedBoardType, setSelectedBoardType] = useState("main");
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  const isTeamBoard = selectedBoardType === "team";
  const isMainBoard = selectedBoardType === "main";

  const isUploadDisabled =
    !selectedDetail || selectedDetail.status === "OCCUPIED" || !isTeamBoard;

  // ── data loading ──────────────────────────────────────────────────────────

  const loadBoards = useCallback(async () => {
    try {
      const [myTeamInfo, globalCells, teamData] = await Promise.all([
        getMyTeamInfo(),
        getGlobalBoard(),
        getTeamBoard(),
      ]);
      setMyTeam(myTeamInfo);
      setGlobalBoard(globalCells);
      setTeamName(teamData.teamName ?? myTeamInfo.teamName);
      setTeamBoard(teamData.cells);
    } catch (error) {
      setToast(getErrorMessage(error, "빙고판 정보를 불러오지 못했습니다."));
    }
  }, []);

  const refreshDetail = useCallback(async (cellId, boardType) => {
    if (!cellId) return;
    try {
      const detail =
        boardType === "team"
          ? await getTeamDetail(cellId)
          : await getGlobalDetail(cellId);
      setSelectedDetail(detail);
    } catch (error) {
      setToast(getErrorMessage(error, "미션 정보를 불러오지 못했습니다."));
    }
  }, []);

  // ── effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  // 1초마다 remainingSeconds 카운트다운
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedDetail((prev) => {
        if (!prev || prev.status !== "PENDING") return prev;
        if (prev.remainingSeconds == null) return prev;
        return {
          ...prev,
          remainingSeconds: Math.max(0, prev.remainingSeconds - 1),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 10초마다 자동 새로고침
  useEffect(() => {
    const timer = setInterval(async () => {
      await loadBoards();
      if (selectedCellId) {
        await refreshDetail(selectedCellId, selectedBoardType);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [loadBoards, refreshDetail, selectedCellId, selectedBoardType]);

  // 토스트 자동 제거
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleOpenDetail = async (cellId, boardType) => {
    setSelectedCellId(cellId);
    setSelectedBoardType(boardType);
    setSelectedDetail(null);

    // 보드에서 borderType 미리 가져오기
    if (boardType === "team") {
      const boardCell = teamBoard.find((c) => c.cellId === cellId);
      if (boardCell?.borderType === "PROCESSING_OTHERS") {
        // 상세 API 호출하되 borderType 강제 주입
        try {
          const detail = await getTeamDetail(cellId);
          setSelectedDetail({ ...detail, borderType: "PROCESSING_OTHERS" });
        } catch (error) {
          setToast(getErrorMessage(error, "미션 정보를 불러오지 못했습니다."));
        }
        return;
      }
    }

    await refreshDetail(cellId, boardType);
  };

  const handleCloseDetail = () => {
    setSelectedCellId(null);
    setSelectedDetail(null);
  };

  const handleUploadClick = () => {
    if (isUploadDisabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDetail) return;

    try {
      const isMyPending =
        selectedDetail.status === "PENDING" && selectedDetail.isMine;

      await uploadMissionPhoto(
        selectedDetail.cellId,
        file,
        isMyPending ? "patch" : "post",
      );

      setToast(
        isMyPending
          ? "사진이 수정되었습니다."
          : "미션 사진이 업로드되었습니다. 12시간 타이머가 시작됩니다!",
      );

      await loadBoards();
      await refreshDetail(selectedDetail.cellId, "team");
    } catch (error) {
      setToast(getErrorMessage(error, "업로드에 실패했습니다."));
    } finally {
      e.target.value = "";
    }
  };

  // ── render helpers ────────────────────────────────────────────────────────

  const isProcessingOthers = (boardType, cell) =>
    boardType === "team" && cell?.borderType === "PROCESSING_OTHERS";

  const renderBoardCell = (cell, boardType) => {
    const showImage =
      (cell.status === "OCCUPIED" || cell.status === "PENDING") &&
      cell.imageUrl &&
      !isProcessingOthers(boardType, cell);

    // 팀 빙고에서 다른 팀 진행 중인 칸은 흰색
    const bgColor =
      boardType === "team" && cell.borderType === "PROCESSING_OTHERS"
        ? "#FFFFFF"
        : getCellColor(cell.status);

    return (
      <BingoCard
        type="button"
        key={`${boardType}-${cell.cellId}`}
        bgColor={bgColor}
        onClick={() => handleOpenDetail(cell.cellId, boardType)}
      >
        {showImage ? (
          <CardImage src={cell.imageUrl} alt={`cell-${cell.cellId}`} />
        ) : (
          <CardText>{cell.missionTitle}</CardText>
        )}
      </BingoCard>
    );
  };

  const renderUploadButton = () => {
    if (!isTeamBoard || !selectedDetail) return null;

    let label = "미션 사진 업로드";
    if (selectedDetail.status === "OCCUPIED") label = "미션 성공!";
    else if (selectedDetail.status === "PENDING") {
      label = selectedDetail.isMine ? "사진 수정하기" : "사진 업로드";
    }

    return (
      <>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <UploadButton
          type="button"
          onClick={handleUploadClick}
          disabled={isUploadDisabled}
          occupied={selectedDetail.status === "OCCUPIED"}
        >
          {label}
        </UploadButton>
      </>
    );
  };

  const renderDetailImage = () => {
    if (!selectedDetail) return null;

    // PROCESSING_OTHERS: 다른 팀 사진 숨기고 빈 placeholder
    if (isTeamBoard && selectedDetail.borderType === "PROCESSING_OTHERS") {
      return <PreviewPlaceholder>사진</PreviewPlaceholder>;
    }

    if (selectedDetail.imageUrl) {
      return (
        <PreviewImage
          src={selectedDetail.imageUrl}
          alt={selectedDetail.missionTitle}
        />
      );
    }

    return <PreviewPlaceholder>사진</PreviewPlaceholder>;
  };

  const displayTeamName = teamName ?? myTeam?.teamName ?? "";

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <Root>
      <Header />

      <BingoPageContainer>
        <ContentInner>
          <BoardsGrid>
            {/* ── Main Bingo ── */}
            <BoardSection>
              <BoardTitle>Main Bingo</BoardTitle>
              <BoardDescription>
                이곳은 팀별 빙고 진행 상황을 한눈에 확인할 수 있는 전체
                빙고판입니다.
                <br />
                다른 팀이 먼저 빙고판을 차지하기 전에 빠르게 빙고 미션을
                수행하세요!
              </BoardDescription>

              <BingoGrid>
                {globalBoard.map((cell) => renderBoardCell(cell, "main"))}
              </BingoGrid>

              <WarningBox>
                <WarningTitle>
                  <BsExclamationTriangle />
                  CAUTION !
                </WarningTitle>
                <WarningItem>
                  <ColorDot color="#FFF36A" />
                  <WarningText>
                    특정 팀이 미션 사진을 업로드 하면 해당 칸이 노란색으로
                    표시됩니다.
                  </WarningText>
                </WarningItem>
                <WarningItem>
                  <ColorDot color="#FF5A5A" />
                  <WarningText>
                    미션 사진을 업로드 한 후 12시간 동안 다른 팀이 업로드 하지
                    않으면 해당 칸이 빨간색으로 변하며 빙고 칸 차지 성공!!
                  </WarningText>
                </WarningItem>
              </WarningBox>
            </BoardSection>

            <Divider />

            {/* ── Team Bingo ── */}
            <BoardSection>
              <BoardTitle>
                {displayTeamName
                  ? `${displayTeamName.replace("팀", "")}팀 Bingo`
                  : "Team Bingo"}
              </BoardTitle>
              <BoardDescription>
                이곳은 우리 팀 빙고를 직접 수행하는 팀 빙고판입니다.
                <br />
                미션을 수행하고 12시간을 지켜 칸을 점유하세요.
              </BoardDescription>

              <BingoGrid>
                {teamBoard.map((cell) => renderBoardCell(cell, "team"))}
              </BingoGrid>

              <WarningBox>
                <WarningTitle>
                  <BsExclamationTriangle />
                  CAUTION !
                </WarningTitle>
                <WarningItem>
                  <ColorDot color="#FFF36A" />
                  <WarningText>
                    특정 팀이 미션 사진을 업로드 하면 해당 칸이 노란색으로
                    표시됩니다.
                  </WarningText>
                </WarningItem>
                <WarningItem>
                  <ColorDot color="#FF5A5A" />
                  <WarningText>
                    미션 사진을 업로드 한 후 12시간 동안 다른 팀이 업로드 하지
                    않으면 해당 칸이 빨간색으로 변하며 빙고 칸 차지 성공!!
                  </WarningText>
                </WarningItem>
              </WarningBox>
            </BoardSection>
          </BoardsGrid>
        </ContentInner>
      </BingoPageContainer>

      {/* ── Side Panel ── */}
      {selectedCellId && (
        <>
          <Overlay onClick={handleCloseDetail} />
          <SidePanel>
            <PanelHeader>
              <PanelHeaderTitle>미션 상세</PanelHeaderTitle>
              <CloseButton type="button" onClick={handleCloseDetail}>
                <IoClose />
              </CloseButton>
            </PanelHeader>

            <PanelBody
              bgColor={
                selectedDetail
                  ? getPanelBgColor(selectedDetail.status)
                  : "#FFFFFF"
              }
            >
              <PanelTopTitle>
                {isMainBoard
                  ? "Main Bingo"
                  : `${displayTeamName || "Team"} Bingo`}
              </PanelTopTitle>

              <PanelGuideText>
                {isMainBoard
                  ? "이곳은 팀별 빙고 진행 상황을 한눈에 확인할 수 있는 전체 빙고판입니다."
                  : "이곳은 우리 팀 빙고를 직접 수행하는 팀 빙고판입니다."}
              </PanelGuideText>

              <PanelDivider />

              {selectedDetail ? (
                <>
                  <MissionTitle>{selectedDetail.missionTitle}</MissionTitle>

                  <MissionLabel>미션 내용 :</MissionLabel>
                  <MissionText>
                    {selectedDetail.missionDescription ||
                      "미션 내용이 없습니다."}
                  </MissionText>

                  {isTeamBoard &&
                  selectedDetail.borderType === "PROCESSING_OTHERS" ? (
                    <>
                      {renderDetailImage()}
                      {renderUploadButton()}
                    </>
                  ) : (
                    <>
                      {selectedDetail.status === "PENDING" &&
                        selectedDetail.remainingSeconds != null && (
                          <>
                            <MissionLabel>남은 시간 :</MissionLabel>
                            <MissionText>
                              {formatSeconds(selectedDetail.remainingSeconds) ??
                                selectedDetail.remainingTime ??
                                ""}
                            </MissionText>
                          </>
                        )}

                      {selectedDetail.teamName && (
                        <>
                          <MissionLabel>
                            {selectedDetail.status === "OCCUPIED"
                              ? "점유 팀 :"
                              : "진행 중인 팀 :"}
                          </MissionLabel>
                          <MissionText>{selectedDetail.teamName}</MissionText>
                        </>
                      )}

                      {renderDetailImage()}
                      {renderUploadButton()}
                    </>
                  )}
                </>
              ) : (
                <MissionText>불러오는 중...</MissionText>
              )}
            </PanelBody>
          </SidePanel>
        </>
      )}

      {toast && <Toast>{toast}</Toast>}
    </Root>
  );
}

export default NewBingo;

// ─── Styled Components ───────────────────────────────────────────────────────

const Root = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #1c1c1c 0%, #002d56 100%);
`;

const BingoPageContainer = styled(PageContainer)`
  justify-content: flex-start;
  align-items: stretch;
  gap: 0;
  overflow: visible;
  background: transparent;
  padding: 2.25rem 3.44rem 3rem;

  @media (max-width: ${breakpoints.tablet}) {
    align-items: stretch;
    padding: 2rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const ContentInner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
`;

const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const BoardSection = styled.section`
  min-width: 0;
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.22);

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const BoardTitle = styled.h2`
  margin: 0 0 16px;
  color: #fff;
  font-family: Montserrat, sans-serif;
  font-size: clamp(42px, 5vw, 72px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;

const BoardDescription = styled.p`
  margin: 0 0 24px;
  color: #fff;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.55;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const BingoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 28px;
`;

const BingoCard = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  border: 2px solid #223042;
  background: ${({ bgColor }) => bgColor};
  padding: 6px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CardText = styled.span`
  color: #1c1c1c;
  text-align: center;
  font-family: Pretendard, sans-serif;
  font-size: clamp(9px, 1vw, 12px);
  font-weight: 600;
  line-height: 1.3;
  word-break: keep-all;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

const WarningBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const WarningTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff7710;
  font-family: Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const ColorDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: ${({ color }) => color};
  flex-shrink: 0;
  margin-top: 2px;
`;

const WarningText = styled.p`
  margin: 0;
  color: #fff;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 9998;
`;

const SidePanel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100vh;
  background: #fff;
  z-index: 9999;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    max-height: 86vh;
    top: auto;
    bottom: 0;
    border-radius: 20px 20px 0 0;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 12px;
  border-bottom: 1px solid #ececec;
`;

const PanelHeaderTitle = styled.div`
  color: #1c1c1c;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 700;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #1c1c1c;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  background: ${({ bgColor }) => bgColor};
`;

const PanelTopTitle = styled.h3`
  margin: 0 0 14px;
  color: #1c1c1c;
  font-family: Montserrat, sans-serif;
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;

const PanelGuideText = styled.p`
  margin: 0;
  color: #1c1c1c;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
`;

const PanelDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #dddddd;
  margin: 18px 0;
`;

const MissionTitle = styled.h4`
  margin: 0 0 18px;
  color: #1c1c1c;
  text-align: center;
  font-family: Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.35;
`;

const MissionLabel = styled.div`
  color: #1c1c1c;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const MissionText = styled.p`
  margin: 0 0 16px;
  color: #1c1c1c;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
`;

const PreviewPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 0.72;
  background: #d9d9d9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222;
  font-family: Pretendard, sans-serif;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 18px;
`;

const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 0.72;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 18px;
`;

const TeamHiddenPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 0.72;
  border-radius: 10px;
  background: #d9d9d9;
  margin-bottom: 18px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 10px;
  background: ${({ disabled, occupied }) =>
    disabled ? (occupied ? "#ff9f1c" : "#d0d0d0") : "#a7c6f9"};
  color: #000000;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: rgba(28, 28, 28, 0.92);
  color: #fff;
  padding: 12px 18px;
  border-radius: 999px;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  z-index: 12000;
`;
