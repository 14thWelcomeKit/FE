import { useState } from "react";
import styled from "styled-components";
import breakpoints from "./breakpoints";

const formatRankingTimestamp = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value)) + " 기준 (KST)";
};

function RankerProfile({ member, index }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const url = typeof member.profileImageUrl === "string" ? member.profileImageUrl.trim() : "";
  return (
    <ProfileCircle $variant={index % 2} aria-hidden="true">
      {url && failedUrl !== url ? (
        <ProfileImage src={url} alt="" onError={() => setFailedUrl(url)} />
      ) : member.nickname.slice(0, 1)}
    </ProfileCircle>
  );
}

export default function BingoRightSection({ ranking, myRanking, updatedAt, isLoading, error, onRetry }) {
  return (
    <RankingPanel>
      <RankingHeader>
        <RankingTitle>Ranking</RankingTitle>
        {updatedAt && <RankingTimestamp>{formatRankingTimestamp(updatedAt)}</RankingTimestamp>}
        <RankingTimestamp>매일 자정(KST) 갱신</RankingTimestamp>
      </RankingHeader>

      {isLoading ? (
        <RankingNotice role="status">랭킹을 불러오는 중입니다.</RankingNotice>
      ) : error ? (
        <RankingNotice role="alert">
          <p>{error}</p>
          <RetryButton type="button" onClick={onRetry}>다시 시도</RetryButton>
        </RankingNotice>
      ) : (
        <>
          {ranking.length ? (
            <RankingList>
              {ranking.map((member, index) => (
                <RankingRow key={member.userId}>
                  <RankNumber $first={member.rank === 1}>{member.rank}</RankNumber>
                  <RankerProfile member={member} index={index} />
                  <MemberInfo>
                    <MemberName>{member.nickname}</MemberName>
                    <Score>{member.score}점</Score>
                  </MemberInfo>
                </RankingRow>
              ))}
            </RankingList>
          ) : <RankingNotice>아직 랭킹 데이터가 없습니다.</RankingNotice>}

          {myRanking && (
            <MyRankingCard>
              <MyRankingLabel>내 순위</MyRankingLabel>
              <MyRankingContent>
                <MyRankingName>
                  {myRanking.rank === null ? "순위 없음" : `${myRanking.rank}위`}
                  &nbsp;&nbsp;{myRanking.nickname}
                </MyRankingName>
                <MyScore>{myRanking.score}점</MyScore>
              </MyRankingContent>
            </MyRankingCard>
          )}
        </>
      )}
    </RankingPanel>
  );
}

const RankingNotice = styled.div`
  color: var(--white);
  font-size: 0.875rem;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  padding: 0.65rem 1rem;
  border: 0;
  border-radius: 0.65rem;
  background: var(--orange);
  color: var(--white);
  font: inherit;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
`;

const RankingPanel = styled.aside`
  grid-area: ranking;
  align-self: start;
  padding: 1.5rem;
  border: 1px solid #4c4a47;
  border-radius: 1rem;
  background: #252421;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
  }
`;

const RankingHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const RankingTitle = styled.h2`
  margin: 0;
  color: var(--white);
  font-family: Montserrat, sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.1;
`;

const RankingTimestamp = styled.p`
  margin: 0.55rem 0 0;
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
`;

const RankingList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RankingRow = styled.li`
  min-height: 4rem;
  padding: 0.7rem 1rem;
  border-radius: 0.65rem;
  background: #31302d;
  display: grid;
  grid-template-columns: 1.5rem 2.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
  box-sizing: border-box;
`;

const RankNumber = styled.span`
  color: ${({ $first }) => ($first ? "var(--orange)" : "var(--white)")};
  font-family: Pretendard, sans-serif;
  font-size: 1rem;
  font-weight: 700;
`;

const ProfileCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ $variant }) => ($variant === 0 ? "#ffc48e" : "#b3c9e8")};
  color: #1c1c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
`;

const MemberInfo = styled.div`
  min-width: 0;
`;

const MemberName = styled.strong`
  display: block;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
`;

const Score = styled.span`
  display: block;
  margin-top: 0.15rem;
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
`;

const MyRankingCard = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border: 2px solid var(--orange);
  border-radius: 0.75rem;
  background: #1c1c1c;
`;

const MyRankingLabel = styled.div`
  color: var(--orange);
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
`;

const MyRankingContent = styled.div`
  margin-top: 0.45rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const MyRankingName = styled.strong`
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
`;

const MyScore = styled.span`
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;
