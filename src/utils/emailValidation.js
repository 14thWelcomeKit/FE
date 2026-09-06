const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const getSchoolEmailError = (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return "이메일을 입력해주세요.";
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return "올바른 이메일 형식으로 입력해주세요.";
  }

  if (!normalizedEmail.endsWith("@hufs.ac.kr")) {
    return "한국외국어대학교 이메일(@hufs.ac.kr)만 사용할 수 있습니다.";
  }

  return "";
};
