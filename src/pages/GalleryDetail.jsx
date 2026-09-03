import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import breakpoints from "../components/breakpoints";
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
  const fallbackAlbum = GALLERY_ALBUMS.find(
    (item) => item.id === Number(galleryId),
  );
  const album = location.state?.album || fallbackAlbum || GALLERY_ALBUMS[0];
  const isAuthor = location.state?.isAuthor ?? true;
  const photos = album.photos?.length ? album.photos : [album.background];
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [dialog, setDialog] = useState(null);

  const handleEdit = () => {
    if (!isAuthor) {
      setDialog({ message: "작성자만 수정할 수 있습니다." });
      return;
    }
    navigate(`/gallery/${album.id}/edit`, { state: { album, isAuthor } });
  };

  const handleDelete = () => {
    if (!isAuthor) {
      setDialog({ message: "작성자만 삭제할 수 있습니다." });
      return;
    }
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
              {dialog.type === "delete" ? (
                <>
                  <DialogSecondary type="button" onClick={() => setDialog(null)}>
                    취소
                  </DialogSecondary>
                  <DialogPrimary type="button" onClick={() => navigate("/gallery")}>
                    삭제
                  </DialogPrimary>
                </>
              ) : (
                <DialogPrimary type="button" onClick={() => setDialog(null)}>
                  확인
                </DialogPrimary>
              )}
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
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: 36px 0 72px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: min(338px, calc(100% - 52px));
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
  margin-bottom: 14px;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 12px;
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
  width: 80%;
  height: 342px;
  margin: 0 auto;
  border-radius: 16px;
  background: ${({ $background }) => $background};

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 208px;
    border-radius: 10px;
  }
`;

const ThumbnailList = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: flex-start;
    gap: 8px;
    margin-top: 8px;
  }
`;

const ThumbnailButton = styled.button`
  width: 90px;
  height: 58px;
  padding: 0;
  border: 2px solid ${({ $active }) => ($active ? "var(--orange)" : "transparent")};
  border-radius: 8px;
  background: ${({ $background }) => $background};
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: calc((100% - 32px) / 5);
    height: 46px;
    border-radius: 7px;
  }
`;

const DescriptionBox = styled.section`
  width: 80%;
  margin: 12px auto 0;
  padding: 16px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    margin-top: 14px;
    padding: 14px;
  }
`;

const DescriptionTitle = styled.h2`
  margin: 0 0 10px;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;

  @media (max-width: ${breakpoints.tablet}) {
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
