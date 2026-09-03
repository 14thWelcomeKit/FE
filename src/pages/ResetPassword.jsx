import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";
import { getSchoolEmailError, normalizeEmail } from "../utils/emailValidation";

import {
  AuthContainer,
  AuthTitle,
  AuthLabel,
  AuthPasswordInput,
  AuthActionRow,
  AuthActionInput,
  AuthActionButton,
  AuthButtonContainer,
  AuthButton,
  CircleContainer,
  Circle,
  MainLogo,
  TextOverlay,
} from "../components/AuthComponents";

const Description = styled.p`
  margin: 1rem 0;

  color: #fff;

  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  line-height: 140%;
`;

const Message = styled.p`
  margin: 1rem 0 0 2rem;

  color: ${({ $success }) =>
    $success ? "#8df5ad" : "var(--orange)"};

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 300;
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
      await axiosInstance.post(
        "/auth/reset-password/send-code",
        {
          email: normalizedEmail,
        }
      );

      setEmail(normalizedEmail);
      setIsCodeSent(true);
      setIsEmailVerified(false);

      showMessage("인증번호가 발송되었습니다.", true);
    } catch (error) {
      setIsCodeSent(false);

      showMessage(
        getApiErrorMessage(
          error,
          "인증번호 발송에 실패했습니다."
        )
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
        getApiErrorMessage(
          error,
          "인증번호 확인에 실패했습니다."
        )
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
        getApiErrorMessage(
          error,
          "비밀번호 재설정에 실패했습니다."
        )
      );
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

        <AuthContainer
          as="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <AuthTitle>비밀번호 재설정</AuthTitle>

          <Description>
            학교 이메일 인증 후 새로운 비밀번호를
            설정할 수 있습니다.
          </Description>

          <AuthLabel htmlFor="reset-email">
            이메일
          </AuthLabel>

          <AuthActionRow>
            <AuthActionInput
              id="reset-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="학교 이메일을 입력해주세요."
            />

            <AuthActionButton
              type="button"
              onClick={handleSendCode}
            >
              인증번호 발송
            </AuthActionButton>
          </AuthActionRow>

          <AuthLabel htmlFor="reset-code">
            인증번호
          </AuthLabel>

          <AuthActionRow>
            <AuthActionInput
              id="reset-code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              placeholder="인증번호를 입력해주세요."
            />

            <AuthActionButton
              type="button"
              onClick={handleVerifyCode}
              disabled={!isCodeSent || isEmailVerified}
            >
              {isEmailVerified
                ? "인증 완료"
                : "인증 확인"}
            </AuthActionButton>
          </AuthActionRow>

          <AuthLabel htmlFor="new-password">
            새 비밀번호
          </AuthLabel>

          <AuthPasswordInput
            id="new-password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            placeholder="새 비밀번호를 입력해주세요."
          />

          <AuthLabel htmlFor="confirm-password">
            새 비밀번호 확인
          </AuthLabel>

          <AuthPasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="새 비밀번호를 다시 입력해주세요."
          />

          {message && (
            <Message
              role="status"
              $success={isSuccessMessage}
            >
              {message}
            </Message>
          )}

          <AuthButtonContainer>
            <AuthButton
              type="submit"
              disabled={!isEmailVerified}
            >
              비밀번호 재설정
            </AuthButton>
          </AuthButtonContainer>
        </AuthContainer>
      </PageContainer>
    </>
  );
}
