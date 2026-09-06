import { useEffect, useState } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
import breakpoints from "./breakpoints";

const HOUR_IN_SECONDS = 60 * 60;
const MATCH_EXPIRES_IN_SECONDS = 48 * HOUR_IN_SECONDS;

const FIXED_MISSIONS = [
  { id: 1, difficulty: 1, mission: "나와 MBTI 맨 앞자리(E/I)가 반대인 사람" },
  { id: 2, difficulty: 2, mission: "나와 다른 파트인 사람 (프론트/백)" },
  { id: 3, difficulty: 3, mission: "운영진 중 한 명과 같이 셀카 찍기" },
  { id: 4, difficulty: 1, mission: "오늘 나와 비슷한 색깔의 상의를 입은 사람" },
  { id: 5, difficulty: 2, mission: "나와 다른 OS를 사용하는 사람 (맥북/윈도우)" },
  { id: 6, difficulty: 2, mission: "나와 같은 기술 스택(React, Spring 등)에 가장 관심 있는 사람" },
  { id: 7, difficulty: 3, mission: "서로의 최애 학교 앞 밥집 1개씩 추천해주기" },
  { id: 8, difficulty: 1, mission: "탕수육 부먹/찍먹 취향이 나와 딱 맞는 사람" },
  { id: 9, difficulty: 2, mission: "VS Code 테마가 나와 같은 사람 (다크모드/라이트모드)" },
  { id: 10, difficulty: 1, mission: "민트초코를 내 돈 주고 사 먹는 사람 (또는 절대 안 먹는 사람)" },
  { id: 11, difficulty: 3, mission: "다른 팀 부원과 다음 주 내로 밥약/커피챗 약속 잡기 (잡고 나서 코드 교환)" },
  { id: 12, difficulty: 1, mission: "학교까지 통학 시간 왕복 2시간 이상인 '프로통학러'" },
  { id: 13, difficulty: 2, mission: "최근 한 달 내에 깃허브 잔디(커밋) 7일 연속 심어본 사람" },
  { id: 14, difficulty: 1, mission: "나와 출신 지역(또는 거주 동네)이 비슷한 사람" },
  { id: 15, difficulty: 3, mission: "동아리방(또는 모임 장소)에서 내 양옆 자리에 앉은 사람" },
  { id: 16, difficulty: 1, mission: "이름에 나와 같은 글자가 하나라도 들어가는 사람" },
  { id: 17, difficulty: 2, mission: "이번 2학기에 꼭 써보고 싶은 툴이나 라이브러리가 있는 사람" },
  { id: 18, difficulty: 1, mission: "나와 같은 달에 태어난 사람" },
  { id: 19, difficulty: 3, mission: "서로의 깃허브 맞팔(Follow) 하기" },
  { id: 20, difficulty: 1, mission: "오늘 나와 같은 교통수단으로 온 사람" },
  { id: 21, difficulty: 2, mission: "개발하다가 새벽 3시 이후까지 코딩해본 적 있는 사람" },
  { id: 22, difficulty: 1, mission: "오늘 알람을 2번 이상 끄고 일어난 사람" },
  { id: 23, difficulty: 3, mission: "상대방에게 개발할 때 유용하게 쓰는 사이트/툴 하나 추천받아 직접 들어가 보기" },
  { id: 24, difficulty: 2, mission: "나와 가장 자주 쓰는 AI 코딩 도구가 같은 사람" },
  { id: 25, difficulty: 1, mission: "이번 주에 카페를 3번 이상 간 사람" },
];

const DIFFICULTY = {
  1: { label: "1단계 · 가벼운 TMI", shortLabel: "1단계" },
  2: { label: "2단계 · 개발자 공감", shortLabel: "2단계" },
  3: { label: "3단계 · 행동 퀘스트", shortLabel: "3단계" },
};

const formatRemainingTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const hours = String(Math.floor(safeSeconds / HOUR_IN_SECONDS)).padStart(2, "0");
  const minutes = String(Math.floor((safeSeconds % HOUR_IN_SECONDS) / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};

export default function BingoLeftSection({ myCode }) {
  const [selectedMission, setSelectedMission] = useState(null);
  const [partnerCode, setPartnerCode] = useState("");
  const [inputError, setInputError] = useState("");
  const [cellStates, setCellStates] = useState({});
  const [now, setNow] = useState(() => Date.now());

  const selectedState = selectedMission
    ? cellStates[selectedMission.id] ?? { status: "INCOMPLETE" }
    : null;

  useEffect(() => {
    const hasPendingCell = Object.values(cellStates).some(
      (cell) => cell.status === "PENDING",
    );
    if (!hasPendingCell) return undefined;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cellStates]);

  useEffect(() => {
    const expiredIds = Object.entries(cellStates)
      .filter(
        ([, state]) =>
          state.status === "PENDING" && state.expiresAt <= now,
      )
      .map(([id]) => id);

    if (!expiredIds.length) return;

    setCellStates((previous) => {
      const next = { ...previous };
      expiredIds.forEach((id) => delete next[id]);
      return next;
    });
  }, [cellStates, now]);

  const selectedRemainingSeconds =
    selectedState?.status === "PENDING"
      ? Math.max(0, Math.ceil((selectedState.expiresAt - now) / 1000))
      : null;

  const openCodePanel = (mission) => {
    const state = cellStates[mission.id];
    if (state?.status === "COMPLETED") return;
    setSelectedMission(mission);
    setPartnerCode("");
    setInputError("");
  };

  const closeCodePanel = () => {
    setSelectedMission(null);
    setPartnerCode("");
    setInputError("");
  };

  const handleCodeChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 4);
    setPartnerCode(nextValue);
    if (inputError) setInputError("");
  };

  const handleMatchRequest = () => {
    if (!selectedMission) return;
    if (!/^\d{4}$/.test(partnerCode)) {
      setInputError("상대방의 4자리 코드를 입력해주세요.");
      return;
    }

    setCellStates((previous) => ({
      ...previous,
      [selectedMission.id]: {
        status: "PENDING",
        expiresAt: Date.now() + MATCH_EXPIRES_IN_SECONDS * 1000,
      },
    }));
    setNow(Date.now());
  };

  return (
    <>
      <IntroSection>
        <PageTitle>Bingo</PageTitle>
        <PageDescription>
          조건에 맞는 사람을 직접 찾아 같은 칸에서 서로의 4자리 코드를
          입력해보세요.
        </PageDescription>
      </IntroSection>

      <BoardSection>
        <MyCodeCard>
          <CodeBlock>
            <CodeLabel>내 코드</CodeLabel>
            <CodeValue>{myCode}</CodeValue>
          </CodeBlock>
          <CodeGuide>
            상대방도 같은 빙고 칸을 선택한 뒤 내 코드를 입력해야 완료돼요.
          </CodeGuide>
        </MyCodeCard>

        <DifficultyLegend aria-label="빙고 난이도 안내">
          {[1, 2, 3].map((difficulty) => (
            <LegendItem key={difficulty} $difficulty={difficulty}>
              <LegendLong>{DIFFICULTY[difficulty].label}</LegendLong>
              <LegendShort>{DIFFICULTY[difficulty].shortLabel}</LegendShort>
            </LegendItem>
          ))}
        </DifficultyLegend>

        <BingoGrid>
          {FIXED_MISSIONS.map((mission) => {
            const state = cellStates[mission.id] ?? { status: "INCOMPLETE" };
            const isSelected = selectedMission?.id === mission.id;
            const isCompleted = state.status === "COMPLETED";

            return (
              <BingoCell
                key={mission.id}
                type="button"
                $difficulty={mission.difficulty}
                $status={state.status}
                $selected={isSelected}
                disabled={isCompleted}
                onClick={() => openCodePanel(mission)}
                aria-label={`${mission.mission}, ${DIFFICULTY[mission.difficulty].shortLabel}`}
              >
                <CellDifficulty>{DIFFICULTY[mission.difficulty].shortLabel}</CellDifficulty>
                {state.status === "PENDING" ? (
                  <CellStatusText>상대방 입력 대기 중</CellStatusText>
                ) : state.status === "COMPLETED" ? (
                  <CellStatusText>
                    {state.matchedUserName}님과<br />미션 완료
                  </CellStatusText>
                ) : (
                  <CellMission>{mission.mission}</CellMission>
                )}
              </BingoCell>
            );
          })}
        </BingoGrid>

        <PolicyNotice>
          한 사람과는 한 칸만 완료할 수 있어요.
          <br />
          대기 중인 매칭은 48시간 후 자동 만료됩니다.
        </PolicyNotice>
      </BoardSection>

      {selectedMission && (
        <>
          <PanelOverlay type="button" aria-label="코드 입력창 닫기" onClick={closeCodePanel} />
          <CodePanel role="dialog" aria-modal="true" aria-labelledby="code-panel-title">
            <PanelHandle />
            <PanelClose type="button" aria-label="닫기" onClick={closeCodePanel}>
              <IoClose />
            </PanelClose>
            <PanelEyebrow>선택한 미션</PanelEyebrow>
            <PanelMission>{selectedMission.mission}</PanelMission>
            <PanelTitle id="code-panel-title">상대방 코드 입력</PanelTitle>

            {selectedState?.status === "PENDING" ? (
              <PendingBox>
                <PendingLabel>대기 상태</PendingLabel>
                <PendingTime>
                  {formatRemainingTime(selectedRemainingSeconds ?? MATCH_EXPIRES_IN_SECONDS)}
                </PendingTime>
                <PendingDescription>
                  48시간 안에 상대방이 같은 칸에서 내 코드를 입력하면 완료돼요.
                </PendingDescription>
              </PendingBox>
            ) : (
              <>
                <CodeInput
                  value={partnerCode}
                  onChange={handleCodeChange}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  placeholder="4자리 코드를 입력하세요"
                  aria-label="상대방 코드"
                  $hasError={Boolean(inputError)}
                />
                {inputError && <InputError role="alert">{inputError}</InputError>}
                <MatchButton type="button" onClick={handleMatchRequest}>
                  매칭 요청
                </MatchButton>
              </>
            )}

            <PanelHelp>
              상대방도 같은 칸에서 내 코드 {myCode}를 입력하면 양쪽 빙고 칸이
              동시에 완료됩니다.
            </PanelHelp>
            <PanelNote>
              오입력 횟수 제한 없음 · 대기 상태는 48시간 후 자동 만료
            </PanelNote>
          </CodePanel>
        </>
      )}
    </>
  );
}

const IntroSection = styled.section`
  grid-area: intro;
  min-width: 0;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--white);
  font-family: Montserrat, sans-serif;
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;

const PageDescription = styled.p`
  margin: 0.9rem 0 0;
  color: #adadad;
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.875rem;
  }
`;

const BoardSection = styled.section`
  grid-area: board;
  min-width: 0;
`;

const MyCodeCard = styled.div`
  min-height: 4.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #4c4a47;
  border-radius: 0.75rem;
  background: #252421;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const CodeBlock = styled.div`
  width: 9rem;
  flex-shrink: 0;
`;

const CodeLabel = styled.div`
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CodeValue = styled.strong`
  color: var(--orange);
  font-family: Pretendard, sans-serif;
  font-size: 1.5rem;
  line-height: 1.15;
`;

const CodeGuide = styled.p`
  margin: 0;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  word-break: keep-all;
`;

const DifficultyLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0.75rem 0;
`;

const LegendItem = styled.div`
  min-height: 1.75rem;
  border: 1px solid
    ${({ $difficulty }) =>
      $difficulty === 1 ? "#9d9d9d" : $difficulty === 2 ? "#fff600" : "#ffaa00"};
  border-radius: 999px;
  background: ${({ $difficulty }) =>
    $difficulty === 1 ? "#ffffff" : $difficulty === 2 ? "#fffbc7" : "#ffe3cc"};
  color: #1c1c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.65rem;
  box-sizing: border-box;
  font-family: Pretendard, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
`;

const LegendLong = styled.span`
  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const LegendShort = styled.span`
  display: none;

  @media (max-width: ${breakpoints.mobile}) {
    display: inline;
  }
`;

const BingoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
`;

const BingoCell = styled.button`
  width: 100%;
  aspect-ratio: 1.18 / 1;
  min-width: 0;
  padding: 0.55rem;
  border: ${({ $selected }) => ($selected ? "4px" : "2px")} solid
    ${({ $difficulty, $status }) => {
      if ($status === "COMPLETED") return "#ff6000";
      if ($difficulty === 1) return "#9d9d9d";
      if ($difficulty === 2) return "#fff600";
      return "#ffaa00";
    }};
  border-color: ${({ $selected }) => ($selected ? "#ff6000" : undefined)};
  border-radius: 0.6rem;
  background: ${({ $difficulty, $status }) => {
    if ($status === "COMPLETED") return "#2d2c29";
    if ($status === "PENDING") return "#fffbc7";
    if ($difficulty === 1) return "#ffffff";
    if ($difficulty === 2) return "#fffbc7";
    return "#ffe3cc";
  }};
  color: ${({ $status }) => ($status === "COMPLETED" ? "#ffffff" : "#1c1c1c")};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 96, 0, 0.45);
    outline-offset: 2px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    aspect-ratio: 0.92 / 1;
    padding: 0.32rem;
    border-radius: 0.45rem;
  }
`;

const CellDifficulty = styled.span`
  color: #6d6b67;
  font-family: Pretendard, sans-serif;
  font-size: clamp(0.48rem, 0.75vw, 0.66rem);
  font-weight: 700;
  line-height: 1.2;
`;

const CellMission = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-family: Pretendard, sans-serif;
  font-size: clamp(0.55rem, 0.86vw, 0.75rem);
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: clamp(0.48rem, 2.15vw, 0.61rem);
    line-height: 1.35;
  }
`;

const CellStatusText = styled(CellMission)`
  color: inherit;
`;

const PolicyNotice = styled.div`
  margin-top: 1.25rem;
  padding: 1rem 1.1rem;
  border: 1px solid #4c4a47;
  border-radius: 0.75rem;
  background: #252421;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.65;
`;

const PanelOverlay = styled.button`
  position: fixed;
  inset: 0;
  z-index: 9998;
  padding: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: default;
`;

const CodePanel = styled.aside`
  position: fixed;
  z-index: 9999;
  top: 8.75rem;
  right: 4rem;
  width: min(27.875rem, calc(100vw - 2rem));
  min-height: 34rem;
  padding: 2rem 1.75rem;
  border: 2px solid var(--orange);
  border-radius: 1.125rem;
  background: #1c1c1c;
  color: var(--white);
  box-sizing: border-box;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.36);

  @media (max-width: ${breakpoints.tablet}) {
    top: auto;
    right: 0;
    bottom: 0;
    width: 100%;
    min-height: 28.75rem;
    border-radius: 1.25rem 1.25rem 0 0;
    padding: 2.1rem 1.25rem 1.5rem;
  }
`;

const PanelHandle = styled.div`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: block;
    position: absolute;
    top: 0.75rem;
    left: 50%;
    width: 3.5rem;
    height: 0.25rem;
    border-radius: 999px;
    background: #727272;
    transform: translateX(-50%);
  }
`;

const PanelClose = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border: 1px solid #4c4a47;
  border-radius: 50%;
  background: #2d2c29;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
`;

const PanelEyebrow = styled.div`
  color: var(--orange);
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
`;

const PanelMission = styled.p`
  max-width: calc(100% - 3rem);
  margin: 0.45rem 0 1.75rem;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const PanelTitle = styled.h2`
  margin: 0 0 1.4rem;
  color: var(--white);
  font-family: Montserrat, Pretendard, sans-serif;
  font-size: clamp(1.7rem, 3vw, 2rem);
  line-height: 1.2;
`;

const CodeInput = styled.input`
  width: 100%;
  height: 4rem;
  padding: 0 1.1rem;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#ff5a5a" : "#4c4a47")};
  border-radius: 0.65rem;
  outline: none;
  background: #2d2c29;
  color: var(--white);
  box-sizing: border-box;
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 600;

  &::placeholder {
    color: #8f8f8f;
  }

  &:focus {
    border-color: var(--orange);
  }
`;

const InputError = styled.p`
  margin: 0.5rem 0 0;
  color: #ff7777;
  font-family: Pretendard, sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
`;

const MatchButton = styled.button`
  width: 100%;
  height: 3.6rem;
  margin-top: 1rem;
  border: 0;
  border-radius: 0.65rem;
  background: var(--orange);
  color: #ffffff;
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`;

const PendingBox = styled.div`
  padding: 1.1rem;
  border: 1px solid #fff600;
  border-radius: 0.65rem;
  background: #2d2c29;
`;

const PendingLabel = styled.div`
  color: #fff600;
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
`;

const PendingTime = styled.strong`
  display: block;
  margin-top: 0.35rem;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 1.5rem;
`;

const PendingDescription = styled.p`
  margin: 0.5rem 0 0;
  color: #d4d4d4;
  font-family: Pretendard, sans-serif;
  font-size: 0.8rem;
  line-height: 1.55;
`;

const PanelHelp = styled.p`
  margin: 1.75rem 0 0;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.6;
  word-break: keep-all;
`;

const PanelNote = styled.p`
  margin: 1.25rem 0 0;
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.72rem;
  line-height: 1.5;
`;
