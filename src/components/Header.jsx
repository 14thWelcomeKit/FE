import styled from "styled-components";
import { ReactComponent as TitleLogo } from "../svg/TitleLogo.svg";
import { ReactComponent as Menu } from "../svg/Menu.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";

const breakpoints = {
  mobile: "576px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1200px",
};

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 4.87rem;
  padding: 0.8125rem 2.25rem;
  align-items: center;
  background: #1c1b1a;
  box-sizing: border-box;
  justify-content: space-between;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: space-between;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const HeaderText = styled.h1`
  color: ${(props) => (props.active ? "#ffffff" : "#9D9D9D")};
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.03125rem;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const WebLogo = styled(TitleLogo)`
  justify-content: flex-start;
  cursor: pointer;
`;
const AppMenu = styled(Menu)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

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

const MenuModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22rem;
  padding: 3.75rem 2.25rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
`;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    console.log("로그아웃 처리됨");
    alert("로그아웃 성공!");
    navigate("/main");
    setIsModalOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <WebLogo onClick={() => handleNavigate("/")} />
        <MenuContainer>
          <HeaderText
            active={location.pathname === "/"}
            onClick={() => handleNavigate("/")}
          >
            HOME
          </HeaderText>
          <HeaderText
            active={location.pathname === "/introduce"}
            onClick={() => handleNavigate("/introduce")}
          >
            INTRODUCE
          </HeaderText>
          <HeaderText
            active={location.pathname === "/check"}
            onClick={() => handleNavigate("/check")}
          >
            ATTENDANCE
          </HeaderText>
          <HeaderText
            active={location.pathname === "/bingo"}
            onClick={() => handleNavigate("/bingo")}
          >
            BINGO
          </HeaderText>
        </MenuContainer>
        <LoginContainer>
          {isLoggedIn ? (
            <HeaderText onClick={handleLogout}>LOGOUT</HeaderText>
          ) : (
            <HeaderText
              active={location.pathname === "/login"}
              onClick={() => handleNavigate("/login")}
            >
              LOGIN
            </HeaderText>
          )}
          <HeaderText
            active={location.pathname === "/mypage"}
            onClick={() => handleNavigate("/mypage")}
          >
            MYPAGE
          </HeaderText>
        </LoginContainer>
        <AppMenu onClick={() => setIsModalOpen(true)} />
      </HeaderContainer>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <MenuModal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            {isLoggedIn ? (
              <HeaderText onClick={handleLogout}>LOGOUT</HeaderText>
            ) : (
              <HeaderText onClick={() => handleNavigate("/login")}>
                LOGIN
              </HeaderText>
            )}
            <HeaderText onClick={() => handleNavigate("/introduce")}>
              INTRODUCE
            </HeaderText>
            <HeaderText onClick={() => handleNavigate("/mypage")}>
              MY PAGE
            </HeaderText>
            <HeaderText onClick={() => handleNavigate("/check")}>
              QR 출석체크
            </HeaderText>
            <HeaderText onClick={() => handleNavigate("/bingo")}>
              Let's BINGO
            </HeaderText>
          </MenuModal>
        </ModalOverlay>
      )}
    </>
  );
}
