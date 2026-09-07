import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import Image from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";
import { normalizeImageFile } from "../utils/imageUpload";

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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
  const previewObjectUrlRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/info");
        if (!cancelled) setProfileImageUrl(response.data?.profileImage || null);
      } catch (error) {
        if (!cancelled) {
          setError(getApiErrorMessage(error, "프로필 정보를 불러오지 못했습니다."));
        }
      }
    };

    fetchUserInfo();
    return () => {
      cancelled = true;
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("이미지를 선택해주세요.");
      return;
    }

    setIsUploading(true);
    setError("");
    try {
      const response = await axiosInstance.post(
        "/user/profileImage/upload-url",
        { contentType: selectedFile.type }
      );
      const { uploadUrl, fileUrl } = response.data;

      if (!uploadUrl || !fileUrl) {
        throw new Error("업로드 URL 응답이 올바르지 않습니다.");
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }

      await axiosInstance.patch("/user/profileImage", {
        fileUrl,
      });

      alert("프로필 이미지가 성공적으로 업로드되었습니다.");
      navigate("/mypage");
    } catch (error) {
      setError(
        error.response
          ? getApiErrorMessage(error, "이미지 업로드에 실패했습니다. 다시 시도해주세요.")
          : error.message || "이미지 업로드에 실패했습니다. 다시 시도해주세요."
      );
      console.error("Error fetching profile image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const input = e.currentTarget;
    const file = input.files[0];
    if (file) {
      setIsConverting(true);
      setError("");

      try {
        const normalizedFile = await normalizeImageFile(file);
        if (normalizedFile.size > 5 * 1024 * 1024) {
          throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
        }

        if (previewObjectUrlRef.current) {
          URL.revokeObjectURL(previewObjectUrlRef.current);
        }
        const previewUrl = URL.createObjectURL(normalizedFile);
        previewObjectUrlRef.current = previewUrl;
        setSelectedFile(normalizedFile);
        setPreviewImage(previewUrl);
      } catch (error) {
        setError(error.message || "이미지 변환 중 오류가 발생했습니다.");
      } finally {
        setIsConverting(false);
        input.value = "";
      }
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Header />
      <PageContainer>
        <ProfileImageContainer>
          <Title>프로필 이미지 등록</Title>
          <ImageUploadContainer>
            <ImagePreview>
              <PreviewImage
                src={previewImage || profileImageUrl || Image}
                alt="프로필 미리보기"
              />
            </ImagePreview>
            <FileInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,.heic,.heif"
              disabled={isConverting || isUploading}
            />
            <UploadButton
              onClick={handleUpload}
              disabled={isConverting || isUploading}
            >
              {isConverting ? "이미지 변환 중..." : "이미지 선택"}
            </UploadButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonContainer>
              <SubmitButton onClick={handleSubmit} disabled={isConverting || isUploading}>
                {isUploading ? "업로드 중..." : "업로드"}
              </SubmitButton>
              <UploadButton onClick={() => navigate("/mypage")} disabled={isUploading}>
                취소
              </UploadButton>
            </ButtonContainer>
          </ImageUploadContainer>
        </ProfileImageContainer>
      </PageContainer>
    </>
  );
}
