import { useEffect, useState } from "react";
import styled from "styled-components";
import breakpoints from "./breakpoints";

const ModalContainer = styled.div`
  width: 42rem;
  height: 52rem;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
`;

const ExitButton = styled.div`
`;

const WelcomeTitle = styled.div`
`;

const WelcomeMessage = styled.div`

  @media (max-width: ${breakpoints.tablet}) {
  }

  @media (max-width: ${breakpoints.mobile}) {
  }
`;

const DismissButtonContainer = styled.div`
`;

const DismissMessage = styled.div`

  @media (max-width: ${breakpoints.tablet}) {
  }

  @media (max-width: ${breakpoints.mobile}) {
  }
`;

const DismissButton = styled.button`

  @media (max-width: ${breakpoints.tablet}) {
  }

  @media (max-width: ${breakpoints.mobile}) {
  }
`;

export default function WelcomeModal({ message }) {
  const [message, setMessage] = useState(message);

  useEffect(() => {
    setMessage(message);
  }, [message]);

  const handleDismiss = () => {
    // 다시 보지 않기 버튼 처리
  };

  return (
    <ModalContainer>
      <WelcomeTitle>
        <WelcomeMessage>멋쟁이사자처럼 14기 환영합니다!</WelcomeMessage>
      </WelcomeTitle>
      <DismissButtonContainer>
        <DismissMessage>MYPAGE에서 다시 보실 수 있습니다.</DismissMessage>
        <DismissButton onClick={handleDismiss}>다시 보지 않기</DismissButton>
      </DismissButtonContainer>
    </ModalContainer>
  );
}
