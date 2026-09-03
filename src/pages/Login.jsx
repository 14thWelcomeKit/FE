import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";

import {
  AuthContainer,
  AuthTitle,
  AuthLabel,
  AuthInput,
  AuthPasswordInput,
  AuthButtonContainer,
  AuthButton,
  AuthCautionText,
  CircleContainer,
  Circle,
  MainLogo,
  TextOverlay,
} from "../components/AuthComponents";

const MiddleText = styled.h1`
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.03125rem;

  color: #fff;

  margin: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const AccountLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  color: #fff;

  font-family: Pretendard;
  font-size: 0.875rem;
`;

const AccountLink = styled.button`
  padding: 0;
  border: 0;
  background: transparent;

  color: inherit;
  font: inherit;

  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: var(--orange);
  }
`;

export default function Login() {
  const { saveToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-in", {
        email,
        password,
      });

      const accessToken = response.data.accessToken;

      saveToken(accessToken);

      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      const errMessage = getApiErrorMessage(
        error,
        "로그인에 실패했습니다."
      );

      console.error(
        "로그인 실패:",
        error.response?.data || error.message
      );

      setError(errMessage);
      alert(errMessage);
    }
  };

  return (
    <>
      <Header />

      <PageContainer>
        <CircleContainer>
          <Circle />
          <MainLogo />

          <TextOverlay>
            GROWL-TO
            <br />
            → WORLD
          </TextOverlay>
        </CircleContainer>

        <AuthContainer>
          <AuthTitle>로그인</AuthTitle>

          <MiddleText>
            한국외국어대학교 글로벌캠퍼스
            <br />
            멋쟁이사자처럼 대학 홈페이지입니다.
          </MiddleText>

          <AuthLabel>이메일</AuthLabel>

          <AuthInput
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthLabel>PW</AuthLabel>

          <AuthPasswordInput
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <AuthCautionText>{error}</AuthCautionText>}

          <AuthButtonContainer>
            <AuthButton type="button" onClick={handleLogin}>
              LOGIN
            </AuthButton>

            <AccountLinks>
              <AccountLink
                type="button"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </AccountLink>

              <span aria-hidden="true">|</span>

              <AccountLink
                type="button"
                onClick={() => navigate("/reset-password")}
              >
                비밀번호 재설정
              </AccountLink>
            </AccountLinks>
          </AuthButtonContainer>
        </AuthContainer>
      </PageContainer>
    </>
  );
}