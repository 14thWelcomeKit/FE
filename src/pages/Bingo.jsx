import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import BingoLeftSection from "../components/BingoLeftSection";
import BingoRightSection from "../components/BingoRightSection";

const MOCK_RANKING = [
  { id: 1, rank: 1, name: "김주희", completedCount: 18 },
  { id: 2, rank: 2, name: "한림", completedCount: 16 },
  { id: 3, rank: 3, name: "이도현", completedCount: 14 },
  { id: 4, rank: 3, name: "박서연", completedCount: 14 },
  { id: 5, rank: 5, name: "최민준", completedCount: 11 },
];

const MOCK_MY_RANKING = {
  rank: 8,
  name: "김코덱스",
  completedCount: 9,
};

const MOCK_RANKING_UPDATED_AT = new Date(2026, 8, 3, 0, 0, 0);

export default function Bingo() {
  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyingRef = useRef(false);
  const queryRef = useRef(null);
  const verifyRef = useRef(null);

  const fetchBoard = useCallback(async () => {
    if (verifyingRef.current) return;
    queryRef.current?.abort();
    const controller = new AbortController();
    queryRef.current = controller;

    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/bingo", {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      const data = response.data?.data;
      if (
        typeof data?.myCode !== "string" ||
        !Array.isArray(data.cells) ||
        data.cells.length !== 25 ||
        new Set(data.cells.map((cell) => cell?.cellId)).size !== 25 ||
        !data.cells.every((cell) =>
          Number.isInteger(cell?.cellId) && cell.cellId >= 1 && cell.cellId <= 25 &&
          typeof cell.missionContent === "string" &&
          ["INCOMPLETE", "PENDING", "COMPLETED"].includes(cell.status) &&
          (cell.matchedWithName === null || typeof cell.matchedWithName === "string")
        )
      ) {
        throw new Error("Invalid bingo response");
      }
      setBoard((previous) => ({
        ...data,
        cells: [...data.cells].sort((a, b) => a.cellId - b.cellId).map((cell) => {
          const expiresAt = previous?.cells.find((item) => item.cellId === cell.cellId)?.expiresAt;
          return cell.status === "PENDING" && Date.parse(expiresAt) > Date.now()
            ? { ...cell, expiresAt }
            : cell;
        }),
      }));
    } catch (requestError) {
      if (!controller.signal.aborted) {
        setError(getApiErrorMessage(requestError, "빙고판을 불러오지 못했습니다."));
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoard();
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") fetchBoard();
    };
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    return () => {
      queryRef.current?.abort();
      verifyRef.current?.abort();
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [fetchBoard]);

  useEffect(() => {
    const deadlines = board?.cells
      .filter((cell) => cell.status === "PENDING" && Number.isFinite(Date.parse(cell.expiresAt)))
      .map((cell) => Date.parse(cell.expiresAt)) ?? [];
    if (!deadlines.length) return;
    const timer = setTimeout(() => {
      setBoard((previous) => ({
        ...previous,
        cells: previous.cells.map((cell) =>
          Date.parse(cell.expiresAt) <= Date.now() ? { ...cell, expiresAt: undefined } : cell
        ),
      }));
      fetchBoard();
    }, Math.max(0, Math.min(...deadlines) - Date.now()));
    return () => clearTimeout(timer);
  }, [board, fetchBoard]);

  const verifyCell = async (cellId, opponentCode) => {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    setIsVerifying(true);
    queryRef.current?.abort();
    setIsLoading(false);
    const controller = new AbortController();
    verifyRef.current = controller;
    try {
      const response = await axiosInstance.post(`/bingo/cells/${cellId}/verify`,
        { opponentCode }, { signal: controller.signal });
      if (controller.signal.aborted) return;
      const result = response.data?.data;
      if (result?.cellId !== cellId || !["PENDING", "COMPLETED"].includes(result?.status) ||
          (result.status === "PENDING" && !Number.isFinite(Date.parse(result.expiresAt)))) {
        throw new Error("Invalid verification response");
      }
      setError("");
      setBoard((previous) => ({
        ...previous,
        cells: previous.cells.map((cell) => cell.cellId === cellId ? {
          ...cell,
          status: result.status,
          matchedWithName: result.status === "COMPLETED" ? result.matchedWithName : null,
          expiresAt: result.status === "PENDING" ? result.expiresAt : undefined,
        } : cell),
      }));
      return result;
    } finally {
      verifyingRef.current = false;
      if (!controller.signal.aborted) setIsVerifying(false);
    }
  };

  return (
    <Root>
      <Header />
      <BingoPageContainer>
        <BingoLayout>
          {!board && isLoading ? (
            <QueryNotice role="status">빙고판을 불러오는 중입니다.</QueryNotice>
          ) : !board && error ? (
            <QueryNotice role="alert">
              <p>{error}</p>
              <RetryButton type="button" onClick={fetchBoard}>
                다시 시도
              </RetryButton>
            </QueryNotice>
          ) : (
            <BingoLeftSection myCode={board.myCode} cells={board.cells}
              onVerify={verifyCell} isVerifying={isVerifying}
              queryError={error} onRetry={fetchBoard} />
          )}
          <BingoRightSection
            ranking={MOCK_RANKING}
            myRanking={MOCK_MY_RANKING}
            updatedAt={MOCK_RANKING_UPDATED_AT}
          />
        </BingoLayout>
      </BingoPageContainer>
    </Root>
  );
}

const QueryNotice = styled.div`
  grid-area: board;
  padding: 2rem;
  color: var(--white);
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 0.65rem;
  background: var(--orange);
  color: var(--white);
  font: inherit;
  cursor: pointer;
`;

const Root = styled.div`
  min-height: 100vh;
  background: var(--black);
`;

const BingoPageContainer = styled(PageContainer)`
  min-height: calc(100vh - 4.87rem);
  padding: 3.5rem 4rem 4rem;
  background: transparent;
  align-items: flex-start;
  overflow: visible;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 2.5rem 1.5rem 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 2rem 1rem 3rem;
  }
`;

const BingoLayout = styled.main`
  width: 100%;
  max-width: 82rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 51.25rem) minmax(20rem, 28.25rem);
  grid-template-areas:
    "intro ."
    "board ranking";
  column-gap: 2.5rem;
  row-gap: 1.75rem;
  align-items: start;

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 42rem;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "intro"
      "board"
      "ranking";
    gap: 1.5rem;
  }
`;
