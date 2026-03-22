import { useState, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { ReactComponent as mainlogo } from "../images/mainlogo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignContainer = styled.div`
  display: flex;
  width: 29rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  overflow-y: auto; /* 세로 스크롤 활성화 */
  scrollbar-width: none; /* 파이어폭스에서 스크롤바 숨김 */
  -ms-overflow-style: none; /* IE, Edge에서 스크롤바 숨김 */

  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리에서 스크롤바 숨김 */
  }

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
  margin-bottom: 0.5rem;
  color: #ffff;
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

  &:focus {
    border-color: #ffff;
    color: #ffff;
  }

  &::placeholder {
    color: #9d9d9d;
    font-size: clamp(0.4rem, 0.7rem, 0.875rem);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignButton = styled.div`
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
  color: var(--orange);
  margin-top: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;

  &:hover {
    background-color: var(--orange);
    color: #ffff;
  }
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
  position: absolute;
  width: 80%;
  height: auto;
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
  color: var(--orange);
  margin-left: 2rem;
`;

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [stunum, setStunum] = useState("");
  const [password, setPassword] = useState("");
  const [checkpw, setCheckpw] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (checkpw && password !== checkpw) {
      setError("비밀번호가 틀립니다.");
    } else {
      setError("");
    }
  }, [password, checkpw]);

  const CheckMock = {
    name: username,
    studentNum: stunum,
    password: password,
    userType: "BABY_LION",
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/user/join",
        {
          name: username,
          studentNum: stunum,
          password: password,
          userType: "BABY_LION",
          devPart: "FRONT_END",
        }
      );

      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다!");
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      alert("회원가입에 실패했습니다.");
      console.log(CheckMock);
    }

    navigate("/login");
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
        <SignContainer>
          <TitleText>회원가입</TitleText>
          <LoginText>이름</LoginText>
          <LoginInput
            placeholder="이름을 입력해주세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <LoginText>학번</LoginText>
          <LoginInput
            placeholder="학번을 입력해주세요."
            value={stunum}
            onChange={(e) => setStunum(e.target.value)}
          />
          <LoginText>PW</LoginText>
          <LoginInput
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginText>PW 중복확인</LoginText>
          <LoginInput
            placeholder="다시 한 번 비밀번호를 입력해주세요."
            value={checkpw}
            onChange={(e) => setCheckpw(e.target.value)}
          />
          {error && <CautionText>{error}</CautionText>}
          <ButtonContainer>
            <SignButton onClick={handleSubmit}>회원가입</SignButton>
          </ButtonContainer>
        </SignContainer>
      </PageContainer>
    </>
  );
}
