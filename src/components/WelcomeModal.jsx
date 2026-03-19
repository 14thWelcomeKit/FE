import { useState, useEffect } from "react";
import styled from "styled-components";
import breakpoints from "./breakpoints";
import { IoCloseOutline } from "react-icons/io5";
import axiosInstance from "../axiosInstance";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 44.5rem;
  background-color: var(--white);
  border-radius: 1.25rem;
  padding: 5rem 1rem 1rem 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 90vw;
  }
`;

const CloseButton = styled(IoCloseOutline)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--black);
  cursor: pointer;
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.25rem;
`;

const WelcomeTitle = styled.div`
  font-family: Montserrat;
  color: var(--orange);
  font-size: 5rem;
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const WelcomeMessage = styled.div`
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.6;
  text-align: center;
  color: var(--black);
  white-space: pre-wrap;
  word-break: keep-all;
  padding: 0 5rem 4rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.125rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const DismissContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    justify-content: center;
  }
`;

const DismissMessage = styled.span`
  font-family: Pretendard;
  font-size: 0.8rem;
  color: #7f7f7f;

  @media (max-width: ${breakpoints.mobile}) {
    text-align: center;
  }
`;

const DismissButton = styled.button`
  background-color: var(--orange);
  color: white;
  border: none;
  border-radius: 3.125rem;
  padding: 0.75rem 2rem;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.03125rem;

  &:hover {
    background-color: #ff4000;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export default function WelcomeModal({ onClose, isDismiss = true }) {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeError, setWelcomeError] = useState("");

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  const fetchWelcomeMessage = async () => {
    try {
      const res = await axiosInstance.get("/welcome/message");
      if (res.data && typeof res.data.content === "string") {
        setWelcomeMessage(res.data.content);
      } else {
        setWelcomeMessage("아직 웰컴 메시지가 없습니다.");
      }
      setWelcomeError("");
    } catch (err) {
      const errMessage = err.response?.data?.message || "웰컴 메시지를 불러오지 못했습니다.";
      setWelcomeError(errMessage);
    }
  };

  const handleDismiss = async () => {
    try {
      await axiosInstance.patch("/welcome/read", { hasReadWelcome: true });
    } catch (err) {
      const errMessage = err.response?.data?.message;
      console.error(errMessage);
    }
    if (onClose) onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <WelcomeContainer>
          <WelcomeTitle>WELCOME</WelcomeTitle>
          <WelcomeMessage>{welcomeMessage || welcomeError}</WelcomeMessage>
        </WelcomeContainer>
        {!isDismiss && <DismissContainer>
          <DismissMessage>MYPAGE에서 다시 보실 수 있습니다.</DismissMessage>
          <DismissButton onClick={handleDismiss}>다시 보지 않기</DismissButton>
        </DismissContainer>}
      </ModalContainer>
    </ModalOverlay>
  );
}
