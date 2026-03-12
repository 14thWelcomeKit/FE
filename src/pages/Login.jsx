import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { ReactComponent as mainlogo } from "../images/mainlogo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axiosInstance from "../axiosInstance";

const LoginContainer = styled.div`
  display: flex;
  width: 29rem;
  height: 40.56rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);
  @media (max-width: ${breakpoints.laptop}) {
    width: 24rem;
    padding: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 20rem;
    padding: 2rem;
  }
`;

const TitleText = styled.h1`
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 2.8rem */
  letter-spacing: -0.05rem;
  margin: 0;
  margin-bottom: 0.25rem;
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const MiddleText = styled.h1`
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.75rem */
  letter-spacing: -0.03125rem;
  color: #ffff;
  margin: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const LoginText = styled.h1`
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 1.575rem */
  letter-spacing: -0.02813rem;
  color: #ffff;
  margin: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const LoginInput = styled.input`
  display: flex;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  align-items: center;
  border-radius: 3.125rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  background-color: rgba(255, 255, 255, 0.19);
  border-color: rgba(255, 255, 255, 0.19);
  color: #ffff;

  &:focus {
    border-color: #ffff;
    color: #ffff;
  }

  &::placeholder {
    color: #9d9d9d;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginButton = styled.div`
  display: flex;
  width: 12.375rem;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  border-radius: 3.125rem;
  background-color: #ffff;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.75rem */
  letter-spacing: -0.03125rem;
  color: #ff7710;
  margin-top: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;

  &:hover {
    background-color: #ff7710;
    color: #ffff;
  }
`;

const InfoContainer = styled.div`
  height: 1.37rem;
  display: flex;
  flex-direction: row;
  margin-top: 0.06rem;
  margin-bottom: 0%.06rem;
`;

const InfoText = styled.h1`
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 1.225rem */
  letter-spacing: -0.02188rem;
  color: #ffff;
  margin: 0;
`;

const SignText = styled.h1`
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.4rem */
  letter-spacing: -0.025rem;
  margin: 0;
  margin-left: 1rem;
  color: #ffff;
  cursor: pointer;
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: min(45vw, 670px);
  height: min(45vw, 670px);
  aspect-ratio: 1 / 1;

  @media (max-width: ${breakpoints.laptop}) {
    width: min(50vw, 500px);
    height: min(50vw, 500px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: min(60vw, 400px);
    height: min(60vw, 400px);
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: min(75vw, 300px);
    height: min(75vw, 300px);
  }
`;
const Circle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  background: linear-gradient(
    180deg,
    rgba(28, 7, 1, 0.87) 0%,
    rgba(0, 0, 0, 0) 47.5%,
    rgba(254, 88, 38, 0.75) 100%
  );

  transform: rotate(-75deg);
`;

const MainLogo = styled(mainlogo)`
  width: 80%;
  height: auto;
  position: absolute;
`;

const TextOverlay = styled.h1`
  position: absolute;
  color: white;
  font-family: Montserrat;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -2.4%;
  font-size: clamp(2rem, 5vw, 6rem);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: clamp(1.5rem, 4vw, 3rem);
  }
`;

const CautionText = styled.h1`
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 300;
  line-height: 140%; /* 1.225rem */
  letter-spacing: -0.02188rem;
  color: #ff7710;
  margin-left: 2rem;
`;
export default function Login() {
  const { saveToken } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const GotoSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-in", {
        studentNum: id,
        password: password,
      });

      const accessToken = response.data.accessToken;
      console.log("받은 토큰:", accessToken);
      saveToken(accessToken);

      console.log("로그인 성공:", response.data);
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <Header></Header>
      <PageContainer>
        <CircleContainer>
          <Circle />
          <MainLogo />
          <TextOverlay>
            GROWL-TO
            <br />→ WORLD
          </TextOverlay>
        </CircleContainer>
        <LoginContainer>
          <TitleText>로그인</TitleText>
          <MiddleText>
            한국외국어대학교 글로벌캠퍼스 <br />
            멋쟁이 사자처럼 대학 홈페이지입니다.
          </MiddleText>
          <LoginText>ID</LoginText>
          <LoginInput
            placeholder="아이디를 입력해주세요."
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <LoginText>PW</LoginText>
          <LoginInput
            type="password" // 비밀번호 입력 시 텍스트가 보이지 않게 설정
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <CautionText>{error}</CautionText>}
          <ButtonContainer>
            <LoginButton onClick={handleLogin}>LOGIN</LoginButton>
            <InfoContainer>
              <InfoText>아이디가 없으신가요?</InfoText>
              <SignText onClick={GotoSignup}>회원가입</SignText>
            </InfoContainer>
          </ButtonContainer>
        </LoginContainer>
      </PageContainer>
    </>
  );
}
