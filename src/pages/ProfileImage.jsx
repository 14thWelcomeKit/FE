import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const ProfileImageContainer = styled.div`
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

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 40rem;
  margin: 0 auto;
  width: 100%;
`;

const ImagePreview = styled.div`
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.19);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    width: 15rem;
    height: 15rem;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadButton = styled.button`
  width: 13rem;
  height: 3.25rem;
  border-radius: 3.125rem;
  border: none;
  background: #ffff;
  color: var(--orange);
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--orange);
    color: #ffff;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 10rem;
    height: 2.75rem;
    font-size: 1rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-family: Pretendard;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const SubmitButton = styled(UploadButton)`
  background: var(--orange);
  color: #ffff;

  &:hover {
    background: #ffff;
    color: var(--orange);
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export default function ProfileImage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("전송할 FormData:", formData.get("image")); // 디버깅용 로그

    try {
      const response = await axiosInstance.post(
        "/user/uploadProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("서버 응답:", response.data);
      alert("프로필 이미지가 성공적으로 업로드되었습니다.");
      navigate("/mypage");
    } catch (error) {
      setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      console.error("Error fetching profile image:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const fetchMyProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profileImage", {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };
  return (
    <>
      <Header />
      <PageContainer>
        <ProfileImageContainer>
          <Title>프로필 이미지 등록</Title>
          <ImageUploadContainer>
            <ImagePreview>
              {previewImage ? (
                <PreviewImage src={previewImage} alt="프로필 미리보기" />
              ) : (
                <PreviewImage src={previewImage} alt="기본 프로필" />
              )}
            </ImagePreview>
            <FileInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
            />
            <UploadButton onClick={handleUpload}>이미지 선택</UploadButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonContainer>
              <SubmitButton onClick={handleSubmit}>업로드</SubmitButton>
              <UploadButton onClick={() => navigate("/mypage")}>
                취소
              </UploadButton>
            </ButtonContainer>
          </ImageUploadContainer>
        </ProfileImageContainer>
      </PageContainer>
    </>
  );
}
