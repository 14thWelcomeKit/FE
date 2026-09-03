import styled from "styled-components";
import breakpoints from "./breakpoints";

const formatRankingTimestamp = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${month}월 ${day}일 ${hour}시 기준`;
};

export default function BingoRightSection({ ranking, myRanking, updatedAt }) {
  return (
    <RankingPanel>
      <RankingHeader>
        <RankingTitle>Ranking</RankingTitle>
        <RankingTimestamp>{formatRankingTimestamp(updatedAt)}</RankingTimestamp>
      </RankingHeader>

      <RankingList>
        {ranking.map((member, index) => (
          <RankingRow key={member.id}>
            <RankNumber $first={member.rank === 1}>{member.rank}</RankNumber>
            <ProfileCircle $variant={index % 2} aria-hidden="true">
              {member.name.slice(0, 1)}
            </ProfileCircle>
            <MemberInfo>
              <MemberName>{member.name}</MemberName>
              <CompletedCount>{member.completedCount}칸</CompletedCount>
            </MemberInfo>
          </RankingRow>
        ))}
      </RankingList>

      <MyRankingCard>
        <MyRankingLabel>내 순위</MyRankingLabel>
        <MyRankingContent>
          <MyRankingName>
            {myRanking.rank}위&nbsp;&nbsp;{myRanking.name}
          </MyRankingName>
          <MyCompletedCount>완료 {myRanking.completedCount}칸</MyCompletedCount>
        </MyRankingContent>
      </MyRankingCard>
    </RankingPanel>
  );
}

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

const CompletedCount = styled.span`
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

const MyCompletedCount = styled.span`
  color: #9d9d9d;
  font-family: Pretendard, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;
