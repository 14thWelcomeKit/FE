import styled from "styled-components";
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
  return (
    <Root>
      <Header />
      <BingoPageContainer>
        <BingoLayout>
          <BingoLeftSection myCode="1234" />
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
