import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";
import { getSchoolEmailError, normalizeEmail } from "../utils/emailValidation";

import {
  AuthContainer,
  AuthTitle,
  AuthLabel,
  AuthInput,
  AuthPasswordInput,
  AuthActionRow,
  AuthActionInput,
  AuthActionButton,
  AuthButtonContainer,
  AuthButton,
  AuthCautionText,
  AuthDropdown,
  CircleContainer,
  Circle,
  MainLogo,
  TextOverlay,
} from "../components/AuthComponents";

const devPartOptions = ["FRONT_END", "BACK_END"];

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [stunum, setStunum] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [devPart, setDevPart] = useState("FRONT_END");
  const [password, setPassword] = useState("");
  const [checkpw, setCheckpw] = useState("");
  const [error, setError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (checkpw && password !== checkpw) {
      setError("비밀번호가 틀립니다.");
    } else {
      setError("");
    }
  }, [password, checkpw]);

  const handleEmailChange = (value) => {
    setEmail(value);
    setIsEmailVerified(false);
  };

  const handleSendCode = async () => {
    const validationError = getSchoolEmailError(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    try {
      await axiosInstance.post("/auth/email/send-code", {
        email: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setIsEmailVerified(false);
      setError("");

      alert("인증코드가 발송되었습니다.");
    } catch (err) {
      const errMessage = getApiErrorMessage(
        err,
        "인증코드 발송에 실패했습니다."
      );

      setError(errMessage);
      alert(errMessage);
    }
  };

  const handleVerifyCode = async () => {
    const validationError = getSchoolEmailError(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!code.trim()) {
      setError("인증코드를 입력해주세요.");
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
      setError("");

      alert("이메일 인증이 완료되었습니다.");
    } catch (err) {
      setIsEmailVerified(false);

      const errMessage = getApiErrorMessage(
        err,
        "인증코드 확인에 실패했습니다."
      );

      setError(errMessage);
      alert(errMessage);
    }
  };

  const handleSubmit = async () => {
    const validationError = getSchoolEmailError(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isEmailVerified) {
      setError("이메일 인증을 완료해주세요.");
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (password !== checkpw) {
      setError("비밀번호가 틀립니다.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/join", {
        name: username,
        studentNum: stunum,
        password,
        email: normalizeEmail(email),
        inviteCode,
        devPart,
      });

      console.log("회원가입 성공:", response.data);

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      const errMessage = getApiErrorMessage(
        err,
        "회원가입에 실패했습니다."
      );

      console.error(
        "회원가입 실패:",
        err.response?.data || err.message
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
          <AuthTitle>회원가입</AuthTitle>

          <AuthLabel>이름</AuthLabel>

          <AuthInput
            placeholder="이름을 입력해주세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <AuthLabel>학번</AuthLabel>

          <AuthInput
            placeholder="학번을 입력해주세요."
            value={stunum}
            onChange={(e) => setStunum(e.target.value)}
          />

          <AuthLabel>이메일</AuthLabel>

          <AuthActionRow>
            <AuthActionInput
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />

            <AuthActionButton
              type="button"
              onClick={handleSendCode}
            >
              인증코드 발송
            </AuthActionButton>
          </AuthActionRow>

          <AuthLabel>인증코드</AuthLabel>

          <AuthActionRow>
            <AuthActionInput
              placeholder="인증코드를 입력해주세요."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <AuthActionButton
              type="button"
              onClick={handleVerifyCode}
            >
              인증 확인
            </AuthActionButton>
          </AuthActionRow>

          {isEmailVerified && (
            <AuthCautionText>
              이메일 인증이 완료되었습니다.
            </AuthCautionText>
          )}

          <AuthLabel>초대코드</AuthLabel>

          <AuthInput
            placeholder="운영진 초대코드가 있다면 입력해주세요."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />

          <AuthLabel>파트</AuthLabel>

          <AuthDropdown
            value={devPart}
            options={devPartOptions}
            onChange={setDevPart}
          />

          <AuthLabel>PW</AuthLabel>

          <AuthPasswordInput
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthLabel>PW 중복확인</AuthLabel>

          <AuthPasswordInput
            placeholder="다시 한 번 비밀번호를 입력해주세요."
            value={checkpw}
            onChange={(e) => setCheckpw(e.target.value)}
          />

          {error && (
            <AuthCautionText>{error}</AuthCautionText>
          )}

          <AuthButtonContainer>
            <AuthButton
              type="button"
              onClick={handleSubmit}
            >
              회원가입
            </AuthButton>
          </AuthButtonContainer>
        </AuthContainer>
      </PageContainer>
    </>
  );
}
