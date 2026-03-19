import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const ChangePasswordContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 85.5rem;
  height: auto;
  min-height: 47.56rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 100%;
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    padding: 2rem 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;

const Title = styled.h1`
  color: #ffff;
  font-family: Montserrat;
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 40rem;
  margin: 0 auto;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffff;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 500;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 1.5rem;
  border-radius: 3.125rem;
  border: none;
  background: rgba(255, 255, 255, 0.19);
  color: #ffff;
  font-family: Pretendard;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: 2.75rem;
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 3.25rem;
  border-radius: 3.125rem;
  border: none;
  background: #ffff;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #ff7710;
    color: #ffff;
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: 2.75rem;
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-family: Pretendard;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0.5rem;
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "새 비밀번호를 다시 입력해주세요.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosInstance.post("/user/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/mypage");
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <ChangePasswordContainer>
          <Title>비밀번호 변경</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>현재 비밀번호</Label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호를 입력하세요"
              />
              {errors.currentPassword && (
                <ErrorMessage>{errors.currentPassword}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <Label>새 비밀번호</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
              />
              {errors.newPassword && (
                <ErrorMessage>{errors.newPassword}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <Label>새 비밀번호 확인</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </InputGroup>

            <Button type="submit">비밀번호 변경</Button>
          </Form>
        </ChangePasswordContainer>
      </PageContainer>
    </>
  );
}
