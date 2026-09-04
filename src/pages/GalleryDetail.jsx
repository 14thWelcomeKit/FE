import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import breakpoints from "../components/breakpoints";
import { useAuth } from "../AuthContext";
import { GALLERY_ALBUMS } from "./Gallery";

const toBackground = (value) => {
  if (/^(blob:|data:|https?:)/i.test(value)) {
    return `url(${value}) center / cover no-repeat`;
  }
  return value;
};

export default function GalleryDetail() {
  const { galleryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const fallbackAlbum = GALLERY_ALBUMS.find(
    (item) => item.id === Number(galleryId),
  );
  const album = location.state?.album || fallbackAlbum || GALLERY_ALBUMS[0];
  const photos = album.photos?.length ? album.photos : [album.background];
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [dialog, setDialog] = useState(null);

  const handleEdit = () => {
    navigate(`/gallery/${album.id}/edit`, { state: { album } });
  };

  const handleDelete = () => {
    setDialog({ type: "delete", message: "정말 삭제하시겠습니까?" });
  };

  return (
    <>
      <Header />
      <Page>
        <Content>
          <PageTitle>{album.title}</PageTitle>

          <MetaRow>
            <MetaText>
              {album.date}&nbsp;&nbsp;|&nbsp;&nbsp;{album.generation}기
            </MetaText>
            {isAdmin && (
              <AuthorActions>
                <EditButton type="button" onClick={handleEdit}>
                  <DesktopLabel>수정하기</DesktopLabel>
                  <MobileLabel>수정</MobileLabel>
                </EditButton>
                <DeleteButton type="button" onClick={handleDelete}>
                  <DesktopLabel>삭제하기</DesktopLabel>
                  <MobileLabel>삭제</MobileLabel>
                </DeleteButton>
              </AuthorActions>
            )}
          </MetaRow>

          <MainPhoto $background={toBackground(photos[selectedPhoto])} />

          <ThumbnailList aria-label="사진 선택">
            {photos.map((photo, index) => (
              <ThumbnailButton
                key={`${album.id}-${index}`}
                type="button"
                $active={selectedPhoto === index}
                $background={toBackground(photo)}
                aria-label={`${index + 1}번째 사진`}
                aria-pressed={selectedPhoto === index}
                onClick={() => setSelectedPhoto(index)}
              />
            ))}
          </ThumbnailList>

          {album.content && (
            <DescriptionBox>
              <DescriptionTitle>내용</DescriptionTitle>
              <Description>{album.content}</Description>
            </DescriptionBox>
          )}
        </Content>
      </Page>

      {dialog && (
        <DialogOverlay onClick={() => setDialog(null)}>
          <DialogBox role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <DialogMessage>{dialog.message}</DialogMessage>
            <DialogButtons>
              <DialogSecondary type="button" onClick={() => setDialog(null)}>
                취소
              </DialogSecondary>
              <DialogPrimary type="button" onClick={() => navigate("/gallery")}>
                삭제
              </DialogPrimary>
            </DialogButtons>
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
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0 72px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: calc(100% - 32px);
    padding: 24px 0 60px;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;
  font-family: Montserrat, Pretendard, sans-serif;
  font-size: 56px;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -1.4px;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 14px;
    font-size: 32px;
    letter-spacing: -0.8px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1040px, 100%);
  min-height: 37px;
  margin: 0 auto 18px;

  @media (max-width: ${breakpoints.tablet}) {
    width: calc(100% - 32px);
    min-height: 31px;
    margin-bottom: 14px;
  }
`;

const MetaText = styled.p`
  margin: 0;
  color: rgba(249, 249, 249, 0.72);
  font-family: Pretendard, sans-serif;
  font-size: 11px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 10px;
  }
`;

const AuthorActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 8px;
  }
`;

const AuthorButton = styled.button`
  min-height: 36px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 31px;
    padding: 8px 14px;
  }
`;

const EditButton = styled(AuthorButton)`
  background: rgba(255, 255, 255, 0.14);
`;

const DeleteButton = styled(AuthorButton)`
  background: var(--orange);
`;

const DesktopLabel = styled.span`
  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const MobileLabel = styled.span`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: inline;
  }
`;

const MainPhoto = styled.div`
  width: min(900px, 100%);
  aspect-ratio: 15 / 8;
  margin: 0 auto;
  border-radius: 16px;
  background: ${({ $background }) => $background};

  @media (max-width: ${breakpoints.tablet}) {
    width: calc(100% - 32px);
    aspect-ratio: 326 / 260;
    border-radius: 12px;
  }
`;

const ThumbnailList = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  width: min(688px, 100%);
  margin: 12px auto 0;

  @media (max-width: ${breakpoints.tablet}) {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 9px;
    width: calc(100% - 32px);
    margin-top: 12px;
  }
`;

const ThumbnailButton = styled.button`
  width: 128px;
  height: 80px;
  padding: 0;
  border: 2px solid ${({ $active }) => ($active ? "var(--orange)" : "transparent")};
  border-radius: 10px;
  background: ${({ $background }) => $background};
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    border-radius: 9px;
  }
`;

const DescriptionBox = styled.section`
  width: min(900px, 100%);
  min-height: 101px;
  margin: 18px auto 0;
  padding: 20px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: calc(100% - 32px);
    min-height: 82px;
    margin-top: 14px;
    padding: 16px;
    border-radius: 10px;
  }
`;

const DescriptionTitle = styled.h2`
  margin: 0 0 12px;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 10px;
    font-size: 12px;
  }
`;

const Description = styled.p`
  margin: 0;
  color: rgba(249, 249, 249, 0.82);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  line-height: 1.55;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 10px;
  }
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
  color: var(--white);
  box-sizing: border-box;
`;

const DialogMessage = styled.p`
  margin: 0;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
`;

const DialogButton = styled.button`
  min-width: 72px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const DialogSecondary = styled(DialogButton)`
  background: rgba(255, 255, 255, 0.14);
`;

const DialogPrimary = styled(DialogButton)`
  background: var(--orange);
`;
