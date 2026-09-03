import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import breakpoints from "../components/breakpoints";
import { GALLERY_ALBUMS } from "./Gallery";

const MAX_PHOTOS = 5;

const toBackground = (value) => {
  if (/^(blob:|data:|https?:)/i.test(value)) {
    return `url(${value}) center / cover no-repeat`;
  }
  return value;
};

export default function GalleryEdit() {
  const { galleryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);
  const fallbackAlbum = GALLERY_ALBUMS.find(
    (item) => item.id === Number(galleryId),
  );
  const album = location.state?.album || fallbackAlbum || GALLERY_ALBUMS[0];
  const isAuthor = location.state?.isAuthor ?? true;
  const [title, setTitle] = useState(album.title);
  const [content, setContent] = useState(album.content || "");
  const [photos, setPhotos] = useState(() =>
    (album.photos?.length ? album.photos : [album.background]).map(
      (preview, index) => ({ id: `existing-${index}`, preview, isObjectUrl: false }),
    ),
  );
  const [photoError, setPhotoError] = useState("");
  const [permissionDialog, setPermissionDialog] = useState(!isAuthor);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePhotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      setPhotoError("사진은 최대 5장까지 업로드할 수 있습니다");
      event.target.value = "";
      return;
    }

    const nextPhotos = selectedFiles.map((file, index) => {
      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.push(preview);
      return {
        id: `${file.name}-${file.lastModified}-${index}`,
        preview,
        isObjectUrl: true,
      };
    });

    setPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos]);
    setPhotoError("");
    event.target.value = "";
  };

  const handlePhotoRemove = (photoId) => {
    setPhotos((currentPhotos) => {
      const target = currentPhotos.find((photo) => photo.id === photoId);
      if (target?.isObjectUrl) URL.revokeObjectURL(target.preview);
      return currentPhotos.filter((photo) => photo.id !== photoId);
    });
    setPhotoError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isAuthor) {
      setPermissionDialog(true);
      return;
    }
    navigate(`/gallery/${album.id}`);
  };

  return (
    <>
      <Header />
      <Page>
        <Content>
          <PageTitle>사진 글 수정하기</PageTitle>

          <Form onSubmit={handleSubmit}>
            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-edit-title">제목</FieldLabel>
                <Counter>{title.length}/30</Counter>
              </FieldHeader>
              <TextInput
                id="gallery-edit-title"
                value={title}
                maxLength={30}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>

            <Field>
              <FieldHeader>
                <FieldLabel>사진 업로드</FieldLabel>
                <Counter>{photos.length}/5</Counter>
              </FieldHeader>
              <PhotoList>
                {photos.map((photo, index) => (
                  <PhotoPreview key={photo.id} $background={toBackground(photo.preview)}>
                    <RemovePhotoButton
                      type="button"
                      aria-label={`${index + 1}번째 사진 삭제`}
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    + 사진 추가
                  </AddPhotoButton>
                )}
              </PhotoList>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
              />
              {photoError && <ErrorMessage role="alert">{photoError}</ErrorMessage>}
            </Field>

            <Field>
              <FieldHeader>
                <FieldLabel htmlFor="gallery-edit-content">내용</FieldLabel>
                <Counter>{content.length}/1000</Counter>
              </FieldHeader>
              <TextArea
                id="gallery-edit-content"
                value={content}
                maxLength={1000}
                onChange={(event) => setContent(event.target.value)}
              />
            </Field>

            <ButtonRow>
              <SecondaryButton
                type="button"
                onClick={() => navigate(`/gallery/${album.id}`)}
              >
                취소
              </SecondaryButton>
              <PrimaryButton type="submit">수정 완료</PrimaryButton>
            </ButtonRow>
          </Form>
        </Content>
      </Page>

      {permissionDialog && (
        <DialogOverlay>
          <DialogBox role="dialog" aria-modal="true">
            <DialogMessage>작성자만 수정할 수 있습니다.</DialogMessage>
            <DialogButton
              type="button"
              onClick={() => navigate(`/gallery/${album.id}`)}
            >
              확인
            </DialogButton>
          </DialogBox>
        </DialogOverlay>
      )}
    </>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 4.87rem);
  background: var(--gradient);
  color: var(--white);
`;

const Content = styled.div`
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0 72px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: min(358px, calc(100% - 32px));
    padding: 24px 0 52px;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 24px;
  font-family: Montserrat, Pretendard, sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -1.6px;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 18px;
    font-size: 38px;
    letter-spacing: -1px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(740px, 100%);
  margin: 0 auto;
  padding: 28px 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  &:focus {
    box-shadow: 0 0 0 1px var(--orange);
  }
`;

const TextInput = styled.input`
  ${fieldSurface}
  height: 48px;
  padding: 0 14px;
  font-size: 13px;
`;

const TextArea = styled.textarea`
  ${fieldSurface}
  min-height: 128px;
  padding: 14px;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 170px;
  }
`;

const PhotoList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 100px);
  gap: 8px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const PhotoPreview = styled.div`
  position: relative;
  width: 100px;
  height: 74px;
  overflow: hidden;
  border-radius: 8px;
  background: ${({ $background }) => $background};

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 85px;
  }
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
  width: 100px;
  height: 74px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 11px;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 85px;
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

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button`
  min-height: 36px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.14);
`;

const PrimaryButton = styled(ActionButton)`
  background: var(--orange);
`;

const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.66);
  box-sizing: border-box;
`;

const DialogBox = styled.div`
  width: min(360px, 100%);
  padding: 28px;
  border-radius: 14px;
  background: #263b4e;
  text-align: center;
  box-sizing: border-box;
`;

const DialogMessage = styled.p`
  margin: 0 0 24px;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
`;

const DialogButton = styled.button`
  min-width: 72px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  background: var(--orange);
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;
