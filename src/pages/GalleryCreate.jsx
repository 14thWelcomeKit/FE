import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import breakpoints from "../components/breakpoints";
import axiosInstance, { getApiErrorMessage } from "../axiosInstance";

const MAX_PHOTOS = 5;
const CATEGORIES = ["14기", "13기", "12기"];
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const isHeicFile = (file) =>
  /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

const normalizeImageFile = async (file) => {
  if (isHeicFile(file)) {
    const { default: heic2any } = await import("heic2any");
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(result) ? result[0] : result;

    return new File(
      [blob],
      file.name.replace(/\.[^.]+$/, ".jpg"),
      { type: "image/jpeg" },
    );
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "지원하지 않는 이미지 형식입니다. (jpeg, png, webp만 가능)",
    );
  }

  return file;
};

export default function GalleryCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("14기");
  const [eventDate, setEventDate] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [formError, setFormError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState("");

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePhotoChange = async (event) => {
    if (isConverting || submitting) return;

    const input = event.currentTarget;
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      setPhotoError("사진은 최대 5장까지 업로드할 수 있습니다");
      event.target.value = "";
      return;
    }

    setIsConverting(true);
    setPhotoError("");
    setFormError("");

    try {
      const normalizedFiles = await Promise.all(
        selectedFiles.map(normalizeImageFile),
      );
      const batchId = Date.now();
      const nextPhotos = normalizedFiles.map((file, index) => {
        const preview = URL.createObjectURL(file);
        objectUrlsRef.current.push(preview);

        return {
          id: `${file.name}-${file.lastModified}-${batchId}-${index}`,
          name: file.name,
          file,
          preview,
        };
      });

      setPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos]);
    } catch (conversionError) {
      setPhotoError(
        conversionError.message || "이미지 변환 중 오류가 발생했습니다.",
      );
    } finally {
      setIsConverting(false);
      input.value = "";
    }
  };

  const handlePhotoRemove = (photoId) => {
    setPhotos((currentPhotos) => {
      const target = currentPhotos.find((photo) => photo.id === photoId);
      if (target) URL.revokeObjectURL(target.preview);
      return currentPhotos.filter((photo) => photo.id !== photoId);
    });
    setPhotoError("");
    setFormError("");
  };

  const uploadPhotos = async () => {
    const response = await axiosInstance.post("/photos/upload-url", {
      files: photos.map(({ file }) => ({
        contentType: file.type,
      })),
    });
    const urls = response.data.data.urls;

    if (!Array.isArray(urls) || urls.length !== photos.length) {
      throw new Error("업로드 URL 응답이 올바르지 않습니다.");
    }

    await Promise.all(
      urls.map(async ({ uploadUrl }, index) => {
        const file = photos[index].file;
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("사진 업로드에 실패했습니다. 다시 시도해주세요.");
        }
      }),
    );

    return urls.map(({ fileUrl }) => fileUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || isConverting) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    setPhotoError("");
    setFormError("");

    if (!trimmedTitle || trimmedTitle.length > 30) {
      setFormError("제목은 30자 이내로 입력해주세요.");
      return;
    }

    if (content.length > 1000) {
      setFormError("내용은 1000자 이내로 입력해주세요.");
      return;
    }

    if (photos.length < 1 || photos.length > MAX_PHOTOS) {
      setPhotoError("사진을 1장 이상 5장 이하로 선택해주세요.");
      return;
    }

    if (!category) {
      setFormError("기수 카테고리를 선택해주세요.");
      return;
    }

    if (!eventDate) {
      setFormError("사진에 해당하는 행사일을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setSubmitStage("uploading");

    try {
      const photoUrls = await uploadPhotos();
      setSubmitStage("creating");

      const response = await axiosInstance.post("/photos", {
        title: trimmedTitle,
        category,
        photoUrls,
        content: trimmedContent,
        eventDate,
      });
      const postId = response.data.data.postId;

      if (!postId) {
        throw new Error("게시글 등록 응답이 올바르지 않습니다.");
      }

      navigate(`/gallery/${postId}`);
    } catch (requestError) {
      setFormError(
        requestError.response
          ? getApiErrorMessage(
              requestError,
              "게시글 등록에 실패했습니다.",
            )
          : requestError.message || "게시글 등록에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
      setSubmitStage("");
    }
  };

  return (
    <>
      <Header />
      <Page>
        <Content>
          <PageTitle>사진 글 작성하기</PageTitle>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-title">제목</FieldLabel>
                <Counter>{title.length}/30</Counter>
              </FieldHeader>
              <TextInput
                id="gallery-title"
                value={title}
                maxLength={30}
                required
                disabled={submitting}
                placeholder="제목을 입력해주세요"
                onChange={(event) => {
                  setTitle(event.target.value);
                  setFormError("");
                }}
              />
            </Field>

            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-category">기수</FieldLabel>
              </FieldHeader>
              <SelectInput
                id="gallery-category"
                value={category}
                required
                disabled={submitting}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setFormError("");
                }}
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-event-date">행사일</FieldLabel>
              </FieldHeader>
              <DateInput
                id="gallery-event-date"
                type="date"
                value={eventDate}
                required
                disabled={submitting}
                onChange={(event) => {
                  setEventDate(event.target.value);
                  setFormError("");
                }}
              />
            </Field>

            <PhotoField>
              <FieldHeader>
                <FieldLabel>사진 업로드</FieldLabel>
                <Counter>{photos.length}/5</Counter>
              </FieldHeader>
              <PhotoList>
                {photos.map((photo, index) => (
                  <PhotoPreview
                    key={photo.id}
                    style={{ backgroundImage: `url(${photo.preview})` }}
                    aria-label={`${photo.name} 미리보기`}
                  >
                    <RemovePhotoButton
                      type="button"
                      aria-label={`${photo.name} 삭제`}
                      disabled={isConverting || submitting}
                      onClick={() => handlePhotoRemove(photo.id)}
                    >
                      ×
                    </RemovePhotoButton>
                    {index === 0 && <ThumbnailBadge>썸네일</ThumbnailBadge>}
                  </PhotoPreview>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <AddPhotoButton
                    type="button"
                    disabled={isConverting || submitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    + 사진 추가
                  </AddPhotoButton>
                )}
              </PhotoList>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.heic,.heif"
                multiple
                disabled={isConverting || submitting}
                onChange={handlePhotoChange}
              />
              {photoError && <ErrorMessage role="alert">{photoError}</ErrorMessage>}
            </PhotoField>

            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-content">내용</FieldLabel>
                <Counter>{content.length}/1000</Counter>
              </FieldHeader>
              <TextArea
                id="gallery-content"
                value={content}
                maxLength={1000}
                disabled={submitting}
                placeholder="내용을 입력해주세요"
                onChange={(event) => {
                  setContent(event.target.value);
                  setFormError("");
                }}
              />
            </Field>

            {formError && <ErrorMessage role="alert">{formError}</ErrorMessage>}

            <ButtonRow>
              <SecondaryButton
                type="button"
                disabled={isConverting || submitting}
                onClick={() => navigate("/gallery")}
              >
                취소
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={isConverting || submitting}
              >
                {isConverting
                  ? "사진 변환 중..."
                  : submitting
                    ? submitStage === "creating"
                      ? "게시글 등록 중..."
                      : "사진 업로드 중..."
                    : "작성 완료"}
              </PrimaryButton>
            </ButtonRow>
          </Form>
        </Content>
      </Page>
    </>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 4.87rem);
  background: var(--gradient);
  color: var(--white);
`;

const Content = styled.div`
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0 72px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: calc(100% - 32px);
    padding: 24px 0 52px;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;
  font-family: Montserrat, Pretendard, sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -1.6px;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 14px;
    font-size: 38px;
    letter-spacing: -1px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: min(1040px, 100%);
  min-height: 609px;
  margin: 0 auto;
  padding: 32px 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 18px;
    width: 100%;
    min-height: 0;
    padding: 16px;
    border-radius: 12px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 7px;
  }
`;

const PhotoField = styled(Field)`
  gap: 24px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 18px;
  }
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 20px;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 18px;
  }
`;

const FieldLabel = styled.label`
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 13px;
  }
`;

const Counter = styled.span`
  color: rgba(249, 249, 249, 0.66);
  font-family: Pretendard, sans-serif;
  font-size: 11px;
  font-weight: 400;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 10px;
  }
`;

const fieldSurface = `
  width: 100%;
  border: 0;
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.14);
  color: var(--white);
  font-family: Pretendard, sans-serif;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(249, 249, 249, 0.48);
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--orange);
  }
`;

const TextInput = styled.input`
  ${fieldSurface}
  height: 52px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;

  @media (max-width: ${breakpoints.tablet}) {
    height: 46px;
    padding: 0 12px;
    border-radius: 9px;
  }
`;

const TextArea = styled.textarea`
  ${fieldSurface}
  min-height: 180px;
  padding: 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 170px;
    padding: 12px;
    border-radius: 9px;
  }
`;

const PhotoList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 140px);
  gap: 12px;
  min-height: 104px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    min-height: 84px;
    align-content: start;
  }
`;

const PhotoTile = styled.div`
  position: relative;
  width: 140px;
  height: 104px;
  overflow: hidden;
  border-radius: 10px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    aspect-ratio: 102 / 84;
    border-radius: 9px;
  }
`;

const PhotoPreview = styled(PhotoTile)`
  background-color: rgba(255, 255, 255, 0.12);
  background-position: center;
  background-size: cover;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 5px;
  right: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--white);
  font-size: 12px;
  cursor: pointer;
`;

const ThumbnailBadge = styled.span`
  position: absolute;
  left: 8px;
  bottom: 7px;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 10px;
`;

const AddPhotoButton = styled.button`
  width: 140px;
  height: 104px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 11px;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    aspect-ratio: 102 / 84;
    border-radius: 9px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #ffb089;
  font-family: Pretendard, sans-serif;
  font-size: 11px;
`;

const SelectInput = styled.select`
  ${fieldSurface}
  height: 52px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;

  option {
    color: #1f1f1f;
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 46px;
    padding: 0 12px;
    border-radius: 9px;
  }
`;

const DateInput = styled.input`
  ${fieldSurface}
  height: 52px;
  padding: 0 16px;
  border-radius: 10px;
  color-scheme: dark;
  font-size: 13px;

  @media (max-width: ${breakpoints.tablet}) {
    height: 46px;
    padding: 0 12px;
    border-radius: 9px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  min-height: 37px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 8px;
    min-height: 31px;
  }
`;

const ActionButton = styled.button`
  min-height: 37px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 31px;
    padding: 8px 14px;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.14);
`;

const PrimaryButton = styled(ActionButton)`
  background: var(--orange);
`;
