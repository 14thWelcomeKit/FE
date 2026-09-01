import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import breakpoints from "../components/breakpoints";

const ITEMS_PER_PAGE = 12;
const VISIBLE_PAGE_COUNT = 3;
const CATEGORIES = ["전체", "14기", "13기", "12기"];

const GALLERY_ALBUMS = [
  { id: 1, title: "14기 오리엔테이션", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 2, title: "첫 번째 미니프로젝트", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 3, title: "웹 개발 스터디", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 4, title: "14기 중간 회고", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 5, title: "알고리즘 세션", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 6, title: "해커톤 24시간", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 7, title: "프로젝트 중간 발표", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 8, title: "봄 소풍", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 9, title: "디자인 시스템 워크숍", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 10, title: "기술 특강", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 11, title: "14기 종강 파티", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
  { id: 12, title: "팀 프로젝트 마무리", date: "2026. 08. 31", generation: 14, thumbnailUrl: "" },
];

const resolveThumbnailUrl = (thumbnailUrl) => {
  if (!thumbnailUrl) return "";
  if (/^https?:\/\//i.test(thumbnailUrl)) return thumbnailUrl;

  const apiBaseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
  if (!apiBaseUrl) return thumbnailUrl;

  return `${apiBaseUrl}${thumbnailUrl.startsWith("/") ? "" : "/"}${thumbnailUrl}`;
};

const getVisiblePages = (currentPage, totalPages) => {
  const visibleCount = Math.min(VISIBLE_PAGE_COUNT, totalPages);
  const maxStart = Math.max(totalPages - visibleCount + 1, 1);
  const start = Math.min(
    Math.max(currentPage - Math.floor(visibleCount / 2), 1),
    maxStart,
  );

  return Array.from({ length: visibleCount }, (_, index) => start + index);
};

export default function Gallery() {
  const contentRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAlbums = useMemo(() => {
    if (selectedCategory === "전체") return GALLERY_ALBUMS;
    return GALLERY_ALBUMS.filter(
      (album) => `${album.generation}기` === selectedCategory,
    );
  }, [selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentAlbums = filteredAlbums.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  const moveToListStart = () => {
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === safeCurrentPage) {
      return;
    }

    setCurrentPage(nextPage);
    moveToListStart();
  };

  return (
    <>
      <Header />
      <GalleryPage>
        <GalleryContent ref={contentRef}>
          <TitleBlock>
            <PageTitle>기수별 사진첩</PageTitle>
            <PageDescription>우리의 순간을 기록합니다</PageDescription>
          </TitleBlock>

          <CategoryTabs aria-label="기수 선택">
            {CATEGORIES.map((category) => (
              <CategoryButton
                key={category}
                type="button"
                $active={selectedCategory === category}
                aria-pressed={selectedCategory === category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryTabs>

          {currentAlbums.length > 0 ? (
            <GalleryGrid>
              {currentAlbums.map((album) => {
                const thumbnailSrc = resolveThumbnailUrl(album.thumbnailUrl);

                return (
                  <GalleryCard key={album.id}>
                    <ThumbnailArea>
                      {thumbnailSrc && (
                        <ThumbnailImage
                          src={thumbnailSrc}
                          alt={`${album.title} 사진`}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </ThumbnailArea>
                    <CardMeta>
                      <CardTitle>{album.title}</CardTitle>
                      <CardDescription>
                        <span>{album.date}</span>
                        <MobileGeneration aria-hidden="true">
                          &nbsp;&nbsp;|&nbsp;&nbsp;{album.generation}기
                        </MobileGeneration>
                      </CardDescription>
                    </CardMeta>
                  </GalleryCard>
                );
              })}
            </GalleryGrid>
          ) : (
            <EmptyState>등록된 사진첩이 없습니다.</EmptyState>
          )}

          <Pagination aria-label="사진첩 페이지">
            <PaginationArrow
              type="button"
              aria-label="이전 페이지"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
            >
              ‹
            </PaginationArrow>

            {visiblePages.map((page) => (
              <PageButton
                key={page}
                type="button"
                $active={page === safeCurrentPage}
                aria-current={page === safeCurrentPage ? "page" : undefined}
                aria-label={`${page}페이지`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageButton>
            ))}

            <PaginationArrow
              type="button"
              aria-label="다음 페이지"
              disabled={safeCurrentPage === totalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
            >
              ›
            </PaginationArrow>
          </Pagination>
        </GalleryContent>
      </GalleryPage>
    </>
  );
}

const GalleryPage = styled.main`
  min-height: calc(100vh - 4.87rem);
  background: var(--gradient);
  color: var(--white);
  box-sizing: border-box;
`;

const GalleryContent = styled.div`
  width: min(1236px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 52px;
  scroll-margin-top: 24px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    width: min(358px, calc(100% - 32px));
    padding: 24px 0 28px;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 4px;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--white);
  font-family: Montserrat, Pretendard, sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -1.6px;
  text-align: center;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 38px;
    line-height: 1.2;
    letter-spacing: -1px;
  }
`;

const PageDescription = styled.p`
  margin: 0;
  color: rgba(249, 249, 249, 0.78);
  font-family: Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 400;

  @media (max-width: ${breakpoints.tablet}) {
    color: rgba(249, 249, 249, 0.75);
    font-size: 13px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 28px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 8px;
    margin-top: 16px;
  }
`;

const CategoryButton = styled.button`
  min-width: 0;
  padding: 10px 20px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "var(--orange)" : "rgba(255, 255, 255, 0.12)"};
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 8px 14px;
    font-size: 12px;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 32px;

  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }
`;

const GalleryCard = styled.article`
  min-width: 0;
  height: 240px;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
    width: 100%;
    height: 70px;
    border-radius: 12px;
  }
`;

const ThumbnailArea = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);

  @media (max-width: ${breakpoints.tablet}) {
    width: 104px;
    height: 70px;
    flex: 0 0 104px;
  }
`;

const ThumbnailImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  height: 80px;
  padding: 12px 14px 10px;
  background: var(--black);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    flex: 1;
    justify-content: flex-start;
    gap: 8px;
    height: 70px;
    padding: 12px;
    background: transparent;
  }
`;

const CardTitle = styled.h2`
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 13px;
  }
`;

const CardDescription = styled.p`
  margin: 0;
  color: rgba(249, 249, 249, 0.68);
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;

  @media (max-width: ${breakpoints.tablet}) {
    color: rgba(249, 249, 249, 0.66);
    font-size: 10px;
  }
`;

const MobileGeneration = styled.span`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: inline;
  }
`;

const EmptyState = styled.div`
  display: flex;
  min-height: 760px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  color: rgba(249, 249, 249, 0.68);
  font-family: Pretendard, sans-serif;
  font-size: 16px;

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 560px;
    margin-top: 16px;
    font-size: 13px;
  }
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 28px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 18px;
    margin-top: 16px;
  }
`;

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--white);
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const PaginationArrow = styled(PaginationButton)`
  width: 16px;
  height: 36px;
  font-size: 16px;

  @media (max-width: ${breakpoints.tablet}) {
    height: 32px;
    font-size: 14px;
  }
`;

const PageButton = styled(PaginationButton)`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "var(--orange)" : "transparent")};
  font-size: 14px;

  @media (max-width: ${breakpoints.tablet}) {
    width: ${({ $active }) => ($active ? "32px" : "auto")};
    height: 32px;
    font-size: 12px;
  }
`;
