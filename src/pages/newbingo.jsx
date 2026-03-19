import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/Breakpoints";
import { BsExclamationTriangle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

const HOLD_HOURS = 12;
const HOLD_MS = HOLD_HOURS * 60 * 60 * 1000;

const MOCK_TEAM_ME = {
  teamId: 1,
  teamName: "A팀",
};

const MOCK_MISSION_TITLES = [
  "팀원이랑 같이 밥 먹기",
  "교수님께 인사하기",
  "같이 사진 찍기",
  "학교 건물 앞 인증샷",
  "팀원 이름 외우기",
  "운영진 만나기",
  "팀 구호 만들기",
  "학과 사무실 앞 인증",
  "팀원 칭찬하기",
  "다 같이 손하트",
  "새 친구 사귀기",
  "동아리 소개 듣기",
  "사진 포즈 맞추기",
  "간식 같이 먹기",
  "단체 셀카 찍기",
  "학과 이야기하기",
  "오늘 목표 말하기",
  "서로 MBTI 말하기",
  "재미있는 표정 찍기",
  "팀워크 포즈 찍기",
  "교내 장소 소개하기",
  "첫인상 말하기",
  "오늘 일정 확인하기",
  "응원 메시지 남기기",
  "팀별 미션 인증하기",
];

const createInitialMockCells = () =>
  MOCK_MISSION_TITLES.map((title, index) => ({
    cellId: index + 1,
    missionTitle: title,
    missionDescription: `${title} 미션을 수행한 뒤 사진을 업로드하세요.`,
    status: "AVAILABLE", // AVAILABLE | PENDING | OCCUPIED
    pendingTeamId: null,
    pendingTeamName: null,
    occupiedTeamId: null,
    occupiedTeamName: null,
    uploadedImageUrl: "",
    uploadedAt: null,
  }));

let mockBingoCells = createInitialMockCells();

const isBlobUrl = (url) => typeof url === "string" && url.startsWith("blob:");

const safeRevokeUrl = (url) => {
  if (isBlobUrl(url)) {
    URL.revokeObjectURL(url);
  }
};

const cleanupAllMockBlobUrls = () => {
  mockBingoCells.forEach((cell) => {
    safeRevokeUrl(cell.uploadedImageUrl);
  });
};

const clearCellUploadData = (target) => {
  safeRevokeUrl(target.uploadedImageUrl);

  target.pendingTeamId = null;
  target.pendingTeamName = null;
  target.occupiedTeamId = null;
  target.occupiedTeamName = null;
  target.uploadedImageUrl = "";
  target.uploadedAt = null;
};

const replaceCellImageUrl = (target, file) => {
  safeRevokeUrl(target.uploadedImageUrl);
  const nextUrl = URL.createObjectURL(file);
  target.uploadedImageUrl = nextUrl;
  return nextUrl;
};

const getBoard = async (type) => {
  if (type === "global") {
    return {
      boardName: "전체 빙고 보드",
      cells: [...mockBingoCells],
    };
  }

  return {
    teamId: MOCK_TEAM_ME.teamId,
    teamName: MOCK_TEAM_ME.teamName,
    boardName: "우리 팀 빙고 보드",
    cells: [...mockBingoCells],
  };
};

const getMissionDetail = async (cellId) => {
  const cell = mockBingoCells.find((item) => item.cellId === cellId);
  return cell ? { ...cell } : null;
};

const postMissionPhotoUpload = async ({ cellId, file }) => {
  const target = mockBingoCells.find((item) => item.cellId === cellId);
  if (!target) throw new Error("존재하지 않는 미션입니다.");

  if (target.status === "OCCUPIED") {
    throw new Error("이미 점유 완료된 미션입니다.");
  }

  if (target.status === "AVAILABLE") {
    replaceCellImageUrl(target, file);

    target.status = "PENDING";
    target.pendingTeamId = MOCK_TEAM_ME.teamId;
    target.pendingTeamName = MOCK_TEAM_ME.teamName;
    target.uploadedAt = Date.now();

    return { success: true, action: "CREATED", cell: { ...target } };
  }

  if (
    target.status === "PENDING" &&
    target.pendingTeamId === MOCK_TEAM_ME.teamId
  ) {
    replaceCellImageUrl(target, file);
    target.uploadedAt = Date.now();

    return { success: true, action: "UPDATED", cell: { ...target } };
  }

  if (
    target.status === "PENDING" &&
    target.pendingTeamId !== MOCK_TEAM_ME.teamId
  ) {
    clearCellUploadData(target);
    target.status = "AVAILABLE";

    return { success: true, action: "INVALIDATED", cell: { ...target } };
  }

  throw new Error("업로드 처리에 실패했습니다.");
};

const patchMissionPhotoUpload = async ({ cellId, file }) => {
  return postMissionPhotoUpload({ cellId, file });
};

const getMyTeamInfo = async () => ({ ...MOCK_TEAM_ME });

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

const formatRemainingTime = (uploadedAt, now) => {
  if (!uploadedAt) return "12:00:00";

  const remain = Math.max(0, uploadedAt + HOLD_MS - now);
  const hours = String(Math.floor(remain / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(
    Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60)),
  ).padStart(2, "0");
  const seconds = String(Math.floor((remain % (1000 * 60)) / 1000)).padStart(
    2,
    "0",
  );

  return `${hours}:${minutes}:${seconds}`;
};

function NewBingo() {
  const [myTeam, setMyTeam] = useState(null);
  const [globalBoard, setGlobalBoard] = useState([]);
  const [teamBoard, setTeamBoard] = useState([]);

  const [selectedCellId, setSelectedCellId] = useState(null);
  const [selectedBoardType, setSelectedBoardType] = useState("main");
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());

  const fileInputRef = useRef(null);

  const isMainBoard = selectedBoardType === "main";
  const isTeamBoard = selectedBoardType === "team";
  const isUploadDisabled =
    !selectedDetail || selectedDetail.status === "OCCUPIED";

  const loadBoards = useCallback(async () => {
    const [teamMeRes, globalRes, teamRes] = await Promise.all([
      getMyTeamInfo(),
      getBoard("global"),
      getBoard("team"),
    ]);

    setMyTeam(teamMeRes);
    setGlobalBoard(globalRes.cells);
    setTeamBoard(teamRes.cells);
  }, []);

  const refreshSelectedDetail = useCallback(async (cellId) => {
    if (!cellId) return;
    const detail = await getMissionDetail(cellId);
    setSelectedDetail(detail);
  }, []);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tickPendingToOccupied = async () => {
      let changed = false;

      mockBingoCells = mockBingoCells.map((cell) => {
        if (cell.status !== "PENDING" || !cell.uploadedAt) return cell;

        const isExpired = Date.now() - cell.uploadedAt >= HOLD_MS;
        if (!isExpired) return cell;

        changed = true;

        return {
          ...cell,
          status: "OCCUPIED",
          occupiedTeamId: cell.pendingTeamId,
          occupiedTeamName: cell.pendingTeamName,
          pendingTeamId: null,
          pendingTeamName: null,
        };
      });

      if (changed) {
        await loadBoards();

        if (selectedCellId) {
          await refreshSelectedDetail(selectedCellId);
        }
      }
    };

    const timer = setInterval(() => {
      tickPendingToOccupied();
    }, 1000);

    return () => clearInterval(timer);
  }, [loadBoards, refreshSelectedDetail, selectedCellId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      cleanupAllMockBlobUrls();
    };
  }, []);

  const handleOpenDetail = async (cellId, boardType) => {
    setSelectedCellId(cellId);
    setSelectedBoardType(boardType);

    const detail = await getMissionDetail(cellId);
    setSelectedDetail(detail);
  };

  const handleCloseDetail = () => {
    setSelectedCellId(null);
    setSelectedDetail(null);
  };

  const handleUploadClick = () => {
    if (!isTeamBoard) return;
    if (isUploadDisabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDetail) return;

    try {
      const isMyPending =
        selectedDetail.status === "PENDING" &&
        selectedDetail.pendingTeamId === myTeam?.teamId;

      const res = isMyPending
        ? await patchMissionPhotoUpload({
            cellId: selectedDetail.cellId,
            file,
          })
        : await postMissionPhotoUpload({
            cellId: selectedDetail.cellId,
            file,
          });

      if (res.action === "CREATED") {
        setToast("미션 사진이 업로드되었습니다.");
      } else if (res.action === "UPDATED") {
        setToast("업로드한 사진이 수정되었습니다.");
      } else if (res.action === "INVALIDATED") {
        setToast("다른 팀도 같은 미션을 수행해 무효 처리되었습니다.");
      }

      await loadBoards();
      await refreshSelectedDetail(selectedDetail.cellId);
    } catch (error) {
      setToast(error.message || "업로드에 실패했습니다.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <Root>
      <Header />

      <BingoPageContainer>
        <ContentInner>
          <BoardsGrid>
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
                {globalBoard.map((cell) => (
                  <BingoCard
                    type="button"
                    key={`global-${cell.cellId}`}
                    bgColor={getCellColor(cell.status)}
                    onClick={() => handleOpenDetail(cell.cellId, "main")}
                  >
                    {cell.status === "OCCUPIED" && cell.uploadedImageUrl ? (
                      <CardImage
                        src={cell.uploadedImageUrl}
                        alt={cell.missionTitle}
                      />
                    ) : (
                      <CardText>{cell.missionTitle}</CardText>
                    )}
                  </BingoCard>
                ))}
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
                    않으면 해당 칸이 주황색으로 변하며 빙고 칸 차지 성공!!
                  </WarningText>
                </WarningItem>
              </WarningBox>
            </BoardSection>

            <Divider />

            <BoardSection>
              <BoardTitle>
                {myTeam
                  ? `${myTeam.teamName.replace("팀", "")}팀 Bingo`
                  : "Team Bingo"}
              </BoardTitle>
              <BoardDescription>
                이곳은 우리 팀 빙고를 직접 수행하는 팀 빙고판입니다.
                <br />
                미션을 수행하고 12시간을 지켜 칸을 점유하세요.
              </BoardDescription>

              <BingoGrid>
                {teamBoard.map((cell) => (
                  <BingoCard
                    type="button"
                    key={`team-${cell.cellId}`}
                    bgColor={getCellColor(cell.status)}
                    onClick={() => handleOpenDetail(cell.cellId, "team")}
                  >
                    {(cell.status === "OCCUPIED" ||
                      cell.status === "PENDING") &&
                    cell.uploadedImageUrl ? (
                      <CardImage
                        src={cell.uploadedImageUrl}
                        alt={cell.missionTitle}
                      />
                    ) : (
                      <CardText>{cell.missionTitle}</CardText>
                    )}
                  </BingoCard>
                ))}
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
                    않으면 해당 칸이 주황색으로 변하며 빙고 칸 차지 성공!!
                  </WarningText>
                </WarningItem>
              </WarningBox>
            </BoardSection>
          </BoardsGrid>
        </ContentInner>
      </BingoPageContainer>

      {selectedCellId && selectedDetail && (
        <>
          <Overlay onClick={handleCloseDetail} />
          <SidePanel>
            <PanelHeader>
              <PanelHeaderTitle>미션 상세</PanelHeaderTitle>
              <CloseButton type="button" onClick={handleCloseDetail}>
                <IoClose />
              </CloseButton>
            </PanelHeader>

            <PanelBody bgColor={getPanelBgColor(selectedDetail.status)}>
              <PanelTopTitle>
                {isMainBoard
                  ? "Main Bingo"
                  : `${myTeam?.teamName || "Team"} Bingo`}
              </PanelTopTitle>

              <PanelGuideText>
                {isMainBoard
                  ? "이곳은 팀별 빙고 진행 상황을 한눈에 확인할 수 있는 전체 빙고판입니다."
                  : "이곳은 우리 팀 빙고를 직접 수행하는 팀 빙고판입니다."}
              </PanelGuideText>

              <PanelDivider />

              <MissionTitle>{selectedDetail.missionTitle}</MissionTitle>

              <MissionLabel>미션 내용 :</MissionLabel>
              <MissionText>{selectedDetail.missionDescription}</MissionText>

              {selectedDetail.status === "PENDING" && (
                <>
                  <InfoText>
                    사진 업로드 팀 : {selectedDetail.pendingTeamName}
                  </InfoText>
                  <TimerBadge>
                    확정까지 남은 시간 :{" "}
                    {formatRemainingTime(selectedDetail.uploadedAt, now)}
                  </TimerBadge>
                </>
              )}

              {selectedDetail.status === "OCCUPIED" && (
                <>
                  <InfoText>
                    사진 업로드 팀 : {selectedDetail.occupiedTeamName}
                  </InfoText>
                  <SuccessBadge>점유 완료된 미션입니다.</SuccessBadge>
                </>
              )}

              {selectedDetail.uploadedImageUrl ? (
                <PreviewImage
                  src={selectedDetail.uploadedImageUrl}
                  alt={selectedDetail.missionTitle}
                />
              ) : (
                <PreviewPlaceholder>사진</PreviewPlaceholder>
              )}

              {isTeamBoard && (
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
                    {selectedDetail.status === "OCCUPIED"
                      ? "미션 성공!"
                      : selectedDetail.status === "PENDING"
                        ? "사진 업로드"
                        : "미션 수행하러 가기"}
                  </UploadButton>
                </>
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

const InfoText = styled.div`
  margin-bottom: 12px;
  color: #1c1c1c;
  font-family: Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

const TimerBadge = styled.div`
  width: 100%;
  border-radius: 10px;
  background: #f4d8d8;
  color: #ff0000;
  text-align: center;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 10px;
  margin-bottom: 16px;
`;

const SuccessBadge = styled.div`
  width: 100%;
  border-radius: 10px;
  background: #ffd0ca;
  color: #d62828;
  text-align: center;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 10px;
  margin-bottom: 16px;
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

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 10px;
  background: ${({ disabled, occupied }) =>
    disabled ? (occupied ? "#ff9f1c" : "#d0d0d0") : "#a9c3ee"};
  color: #ffffff;
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
