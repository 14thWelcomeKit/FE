import styled from "styled-components";
import breakpoints from "./breakpoints";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2.25rem 3.44rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--gradient);
  box-sizing: border-box;
  gap: 10.69rem;
  overflow: hidden;

  @media (max-width: ${breakpoints.laptop}) {
    gap: 5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    height: auto;
    align-items: center;
    padding: 2rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

export default PageContainer;
