import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import {
  getSchoolEmailError,
  normalizeEmail,
} from "../utils/emailValidation";

const ResetContainer = styled.form`
  display: flex;
  width: 29rem;
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

const Title = styled.h1`
  margin: 0 0 1rem;
  color: #ffff;
  font-family: Pretendard;
  font-size: 2rem;
  font-weight: 600;
  line-height: 140%;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  margin: 0 0 1rem;
  color: #ffff;
  font-family: Pretendard;
  font-size: 1rem;
  line-height: 140%;
`;

const Label = styled.label`
  margin: 1rem 0;
  color: #ffff;
  font-family: Pretendard;
  font-size: 1.125rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.19);
  border-radius: 3.125rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  color: #ffff;

  &:focus {
    border-color: #ffff;
    outline: none;
  }

  &::placeholder {
    color: #9d9d9d;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
`;

const ActionInput = styled(Input)`
  min-width: 0;
  flex: 1;
`;

const SmallButton = styled.button`
  flex-shrink: 0;
  padding: 0 1rem;
  border: 0;
  border-radius: 3.125rem;
  background: #ffff;
  color: var(--orange);
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--orange);
    color: #ffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SubmitButton = styled(SmallButton)`
  width: 12.375rem;
  height: 3.25rem;
  margin: 2rem auto 0;
  font-size: 1.125rem;
`;

const Message = styled.p`
  margin: 1rem 0 0;
  color: ${(props) => (props.$success ? "#8df5ad" : "var(--orange)")};
  font-family: Pretendard;
  font-size: 0.875rem;
  line-height: 140%;
`;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const showMessage = (text, isSuccess = false) => {
    setMessage(text);
    setIsSuccessMessage(isSuccess);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsCodeSent(false);
    setIsEmailVerified(false);
    showMessage("");
  };

  const handleSendCode = async () => {
    const validationError = getSchoolEmailError(email);
    if (validationError) {
      showMessage(validationError);
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    try {
      await axiosInstance.post("/auth/reset-password/send-code", {
        email: normalizedEmail,
      });
      setEmail(normalizedEmail);
      setIsCodeSent(true);
      setIsEmailVerified(false);
      showMessage("인증번호가 발송되었습니다.", true);
    } catch (error) {
      setIsCodeSent(false);
      showMessage(
        getApiErrorMessage(error, "인증번호 발송에 실패했습니다.")
      );
    }
  };

  const handleVerifyCode = async () => {
    const validationError = getSchoolEmailError(email);
    if (validationError) {
      showMessage(validationError);
      return;
    }

    if (!isCodeSent) {
      showMessage("인증번호를 먼저 발송해주세요.");
      return;
    }

    if (!code.trim()) {
      showMessage("인증번호를 입력해주세요.");
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    try {
      await axiosInstance.post("/auth/email/verify-code", {
        email: normalizedEmail,
        code: code.trim(),
      });
      setEmail(normalizedEmail);
      setIsEmailVerified(true);
      showMessage("이메일 인증이 완료되었습니다.", true);
    } catch (error) {
      setIsEmailVerified(false);
      showMessage(
        getApiErrorMessage(error, "인증번호 확인에 실패했습니다.")
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailVerified) {
      showMessage("이메일 인증을 완료해주세요.");
      return;
    }

    if (!newPassword) {
      showMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword) {
      showMessage("새 비밀번호 확인을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", {
        email: normalizeEmail(email),
        newPassword,
      });
      alert("비밀번호가 재설정되었습니다.");
      navigate("/login");
    } catch (error) {
      showMessage(
        getApiErrorMessage(error, "비밀번호 재설정에 실패했습니다.")
      );
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <ResetContainer onSubmit={handleSubmit} noValidate>
          <Title>비밀번호 재설정</Title>
          <Description>
            학교 이메일 인증 후 새로운 비밀번호를 설정할 수 있습니다.
          </Description>

          <Label htmlFor="reset-email">이메일</Label>
          <ActionRow>
            <ActionInput
              id="reset-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="학교 이메일을 입력해주세요."
            />
            <SmallButton type="button" onClick={handleSendCode}>
              인증번호 발송
            </SmallButton>
          </ActionRow>

          <Label htmlFor="reset-code">인증번호</Label>
          <ActionRow>
            <ActionInput
              id="reset-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="인증번호를 입력해주세요."
            />
            <SmallButton
              type="button"
              onClick={handleVerifyCode}
              disabled={!isCodeSent || isEmailVerified}
            >
              {isEmailVerified ? "인증 완료" : "인증하기"}
            </SmallButton>
          </ActionRow>

          <Label htmlFor="new-password">새 비밀번호</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="새 비밀번호를 입력해주세요."
          />

          <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="새 비밀번호를 다시 입력해주세요."
          />

          {message && (
            <Message role="status" $success={isSuccessMessage}>
              {message}
            </Message>
          )}

          <SubmitButton type="submit" disabled={!isEmailVerified}>
            비밀번호 재설정
          </SubmitButton>
        </ResetContainer>
      </PageContainer>
    </>
  );
}
