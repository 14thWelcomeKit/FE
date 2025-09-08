import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ChooseButton = styled.div`
  width: 15rem;
  height: 4rem;
  display: flex;
  background-color: #71c2f4;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: black;
  border-radius: 1rem;
  margin-top: 1rem;
  &:hover {
    transform: scale(1.1);
  }
`;

export default function Setting() {
  const navigate = useNavigate();

  const gotoPage = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <ChooseButton onClick={() => gotoPage("/")}>Main</ChooseButton>
      <ChooseButton onClick={() => gotoPage("/check")}>Check</ChooseButton>
      <ChooseButton onClick={() => gotoPage("/introduce")}>
        Introduce
      </ChooseButton>
      <ChooseButton onClick={() => gotoPage("/bingo")}>Bingo</ChooseButton>
      <ChooseButton onClick={() => gotoPage("/manito")}>Manito</ChooseButton>
      <ChooseButton onClick={() => gotoPage("/login")}>Login</ChooseButton>
    </PageContainer>
  );
}
