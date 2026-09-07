import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { useAuth } from "../AuthContext";
import { BsExclamationTriangle } from "react-icons/bs";

import axiosInstance, { getApiErrorMessage } from "./../axiosInstance";

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
  padding: 0 6rem;

  @media (max-width: ${breakpoints.desktop}) {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 3rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 85%;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 1.4rem;
    padding: 0;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 85%;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 0;
  }
`;

const BoardTextContainer = styled.div`
  flex: 1;
  min-width: 450px;
  font-size: 1.4rem;
  text-align: left;

  @media (max-width: ${breakpoints.tablet}) {
    // 태블릿부터 상단 텍스트(문의게시판~ 운영진 답변 시간) 가운데 정렬
    max-width: 100%;
    text-align: center;
  }

  @media (max-width: ${breakpoints.mobile}) {
    min-width: unset;
    width: 100%;
  }
`;

const BoardContainer = styled.div`
  flex: 2;
  width: 100%;
  padding: 3.5rem 5rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    max-width: 100%;
    padding: 1.8rem 2rem;
    gap: 1.4rem;
    border-radius: 1.3rem;
    box-sizing: border-box;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    max-width: 100%;
    padding: 1.5rem 1.4rem;
    gap: 1.4rem;
    border-radius: 1.3rem;
    box-sizing: border-box;
  }
`;

const BoardTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.12;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.4rem;
  }
`;

const BoardDescription = styled.p`
  color: #f0f0f0;
  font-size: 1.5rem;
  margin: 1.2rem 0 1.8rem;
  line-height: 1.6;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin: 1rem 0 1.3rem;
  }
`;

const BoardCaution = styled.h2`
  color: var(--orange);
  font-size: 1.35rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.2rem 0 0.8rem;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
    margin-top: 1rem;
  }
`;

const CautionIcon = styled(BsExclamationTriangle)`
  font-size: 1.6rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const BoardFooter = styled.p`
  color: #ddd;
  font-size: 1.1rem;
  line-height: 1.45;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.875rem;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 2.3rem;
  font-weight: 700;
  margin: 0 0 0.8rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Notice = styled.div`
  font-size: 1.1rem;
  color: var(--orange);
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 9rem;
  padding: 2rem 2.2rem;
  font-size: 1.3rem;
  line-height: 1.8;
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
  resize: vertical;
  box-sizing: border-box;
  font-family: Pretendard;

  &:focus {
    border-color: var(--orange);
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    min-height: 4rem;
    padding: 0.6rem 0.75rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  button {
    flex: 1;
    min-width: 120px;
    height: 4rem;
    font-size: 1.15rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    button {
      min-width: unset;
      height: 3rem;
    }
  }
`;

const Button = styled.button`
  height: 4rem;
  padding: 0 2.2rem;
  border-radius: 2rem;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  background: white;
  color: var(--orange);
  border: none;

  &:hover {
    background: var(--orange);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.875rem;
    padding: 0.5rem 1.5rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
`;

const SmallButton = styled(Button)`
  height: 2.3rem;
  padding: 0 1.3rem;
  font-size: 0.95rem;
  border-radius: 0.8rem;
  margin-top: 0.6rem;
  padding-bottom: 0.2rem;

  @media (max-width: ${breakpoints.mobile}) {
    height: 1.8rem;
    font-size: 0.85rem;
    padding: 0 1.1rem 0.2rem;
  }
`;

const PostBox = styled.div`
  padding: 1.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.2rem 0;
  }
`;

const Nickname = styled.div`
  font-weight: 700;
  font-size: 1.03rem;
  color: #ffddaa;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const Content = styled.div`
  margin: 0.7rem 0 0.3rem;
  font-size: 1.03rem;
  line-height: 1.6;
  color: white;
  word-break: break-word;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const Time = styled.div`
  font-size: 0.78rem;
  color: #aaa;
  opacity: 0.85;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.5rem;
  }
`;

const CommentArea = styled.div`
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2.5px solid rgba(255, 119, 16, 0.3);
`;

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.div`
  color: #ff6666;
  font-size: 0.95rem;
  text-align: center;
  padding: 0.5rem 0;
`;

const LoadingText = styled.div`
  color: #aaa;
  font-size: 1rem;
  text-align: center;
  padding: 1rem 0;
`;

const AdminBadge = styled.span`
  display: inline-block;
  background: var(--orange);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  margin-left: 0.4rem;
  vertical-align: middle;
`;

const formatDate = (isoString) => {
  if (!isoString) return "";
  return isoString.slice(0, 10).replace(/-/g, ".");
};

const mapPost = (post) => ({
  ...post,
  id: post.qnaId,
  time: formatDate(post.createdAt),
  comments: null,
  expanded: false,
  detailLoaded: false,
  showCommentInput: false,
  commentText: "",
});

const mapComment = (comment) => ({
  ...comment,
  id: comment.commentId,
  time: formatDate(comment.createdAt),
  isAdmin: comment.adminComment,
});

export default function Board() {
  const { isAdmin, token } = useAuth();
  const detailControllers = useRef(new Map());
  const commentControllers = useRef(new Map());
  const commentSubmissions = useRef(new Set());
  const pageGeneration = useRef(0);
  const [detailNotice, setDetailNotice] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState(null);
  const [listAttempt, setListAttempt] = useState(0);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [createdPost, setCreatedPost] = useState(null);
  const createPostPending = useRef(false);
  const refreshAfterCreate = useRef(false);
  // 작업 종류와 대상 ID로 조회/작성/삭제 상태를 독립적으로 관리합니다.
  // 상세 조회 연결 시에도 detail:{qnaId} 키를 사용합니다.
  const [requests, setRequests] = useState({});
  const setRequest = (key, loading, error = "") =>
    setRequests((prev) => ({ ...prev, [key]: { loading, error } }));
  const loading = requests.list?.loading ?? true;
  const submitting = requests.createPost?.loading;

  const fetchComments = async (qnaId, afterCreate = false) => {
    if (commentControllers.current.has(qnaId)) {
      if (!afterCreate) return;
      commentControllers.current.get(qnaId).abort();
    }
    const controller = new AbortController();
    const { signal } = controller;
    commentControllers.current.set(qnaId, controller);
    const key = `comments:${qnaId}`;
    setRequest(key, true);
    try {
      const res = await axiosInstance.get(`/qna/comments/${qnaId}`, { signal });
      if (signal.aborted) return;
      const data = res.data.data;
      setPosts((prev) =>
        prev.map((post) =>
          post.id === qnaId
            ? { ...post, comments: data.map(mapComment) }
            : post,
        ),
      );
      setRequest(key, false);
    } catch (e) {
      if (signal.aborted) return;
      const status = e.response?.status;
      if (status === 403 || status === 404) {
        setDetailNotice(
          status === 403
            ? `${afterCreate ? "댓글 등록은 완료되었습니다. " : ""}이 문의글의 댓글에 접근할 권한이 없습니다.`
            : `${afterCreate ? "댓글 등록은 완료되었습니다. " : ""}존재하지 않거나 삭제된 문의글입니다.`,
        );
        setPosts((prev) => prev.filter((post) => post.id !== qnaId));
        setListAttempt((prev) => prev + 1);
      } else {
        setRequest(
          key,
          false,
          afterCreate
            ? "댓글 등록 완료, 목록 갱신 실패. 다시 불러오면 댓글 목록만 조회합니다."
            : getApiErrorMessage(e, "댓글을 불러오지 못했습니다."),
        );
      }
    } finally {
      if (commentControllers.current.get(qnaId) === controller) {
        commentControllers.current.delete(qnaId);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const pendingDetails = detailControllers.current;
    const pendingComments = commentControllers.current;
    setPosts([]);
    setPageInfo(null);
    setRequests((prev) => ({
      createPost: prev.createPost,
      list: { loading: true, error: "" },
    }));

    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/qna", {
          params: { page, size: 10 },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const { qnas, pageInfo: nextPageInfo } = res.data.data;
        setPosts(qnas.map(mapPost));
        setPageInfo(nextPageInfo);
        refreshAfterCreate.current = false;
        setRequests((prev) => ({
          ...prev,
          list: { loading: false, error: "" },
        }));
      } catch (e) {
        if (controller.signal.aborted) return;
        setRequests((prev) => ({
          ...prev,
          list: {
            loading: false,
            error: refreshAfterCreate.current
              ? "등록 완료, 목록 갱신 실패. 다시 시도하면 목록만 불러옵니다."
              : getApiErrorMessage(e, "게시글을 불러오지 못했습니다."),
          },
        }));
      }
    };
    fetchPosts();
    return () => {
      pageGeneration.current += 1;
      controller.abort();
      pendingDetails.forEach((pending) => pending.abort());
      pendingDetails.clear();
      pendingComments.forEach((pending) => pending.abort());
      pendingComments.clear();
    };
  }, [page, listAttempt, token]);

  const fetchDetail = async (id) => {
    if (detailControllers.current.has(id)) return;
    const controller = new AbortController();
    detailControllers.current.set(id, controller);
    const key = `detail:${id}`;
    setRequest(key, true);
    try {
      const res = await axiosInstance.get(`/qna/${id}`, {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      const detail = res.data.data;
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                ...detail,
                id: detail.qnaId,
                time: formatDate(detail.createdAt),
                detailLoaded: true,
              }
            : post,
        ),
      );
      setRequest(key, false);
      await fetchComments(id);
    } catch (e) {
      if (controller.signal.aborted) return;
      const status = e.response?.status;
      if (status === 403 || status === 404) {
        setDetailNotice(
          status === 403
            ? "이 문의글에 접근할 권한이 없습니다."
            : "존재하지 않거나 삭제된 문의글입니다.",
        );
        setPosts((prev) => prev.filter((post) => post.id !== id));
        setListAttempt((prev) => prev + 1);
      } else {
        setRequest(
          key,
          false,
          getApiErrorMessage(e, "본문을 불러오지 못했습니다."),
        );
      }
    } finally {
      if (detailControllers.current.get(id) === controller) {
        detailControllers.current.delete(id);
      }
    }
  };

  const togglePost = (id) => {
    const selected = posts.find((post) => post.id === id);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, expanded: !post.expanded } : post,
      ),
    );
    if (selected && !selected.expanded && !selected.detailLoaded) {
      fetchDetail(id);
    }
  };

  const addPost = async () => {
    if (createPostPending.current) return;
    if (!title.trim() || !text.trim()) {
      setRequest("createPost", false, "제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (title.length > 100 || text.length > 2000) {
      setRequest(
        "createPost",
        false,
        "제목은 100자, 내용은 2,000자 이내로 입력해주세요.",
      );
      return;
    }
    createPostPending.current = true;
    setCreatedPost(null);
    setRequest("createPost", true);
    try {
      const res = await axiosInstance.post("/qna", {
        title,
        content: text,
      });
      setCreatedPost(res.data.data);
      setTitle("");
      setText("");
      setRequest("createPost", false);
      refreshAfterCreate.current = true;
      setPage(0);
      setListAttempt((prev) => prev + 1);
    } catch (e) {
      setRequest(
        "createPost",
        false,
        getApiErrorMessage(e, "게시글 작성에 실패했습니다."),
      );
    } finally {
      createPostPending.current = false;
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const key = `deletePost:${id}`;
    // 마지막 페이지의 마지막 글을 지우면 이전 유효 페이지로, 아니면 현재 페이지를 재조회합니다.
    const reloadList = () => {
      const currentPage = pageInfo?.page ?? page;
      if (posts.length === 1 && currentPage > 0) {
        setPage(currentPage - 1);
      } else {
        setListAttempt((prev) => prev + 1);
      }
    };
    setRequest(key, true);
    try {
      // 성공 응답의 data: null은 본문을 읽지 않으므로 그대로 정상 처리됩니다.
      await axiosInstance.delete(`/qna/${id}`);
      setRequest(key, false);
      setDetailNotice("");
      reloadList();
    } catch (e) {
      const status = e.response?.status;
      if (status === 404) {
        setDetailNotice("이미 삭제되었거나 존재하지 않는 문의글입니다.");
        setRequest(key, false);
        reloadList();
      } else {
        setRequest(
          key,
          false,
          status === 403
            ? "이 문의글을 삭제할 권한이 없습니다."
            : getApiErrorMessage(e, "게시글 삭제에 실패했습니다."),
        );
      }
    }
  };

  const toggleCommentInput = (id) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, showCommentInput: !p.showCommentInput } : p,
      ),
    );

  const handleCommentChange = (id, value) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, commentText: value } : p)),
    );

  const addComment = async (postId) => {
    if (commentSubmissions.current.has(postId)) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const key = `createComment:${postId}`;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, lastCreatedComment: null } : p,
      ),
    );
    if (!post.commentText.trim()) {
      setRequest(key, false, "댓글 내용을 입력해주세요.");
      return;
    }
    if (post.commentText.length > 1000) {
      setRequest(key, false, "댓글은 1,000자 이내로 입력해주세요.");
      return;
    }
    const generation = pageGeneration.current;
    commentSubmissions.current.add(postId);
    setRequest(key, true);
    try {
      const res = await axiosInstance.post("/qna/comments", {
        qnaId: postId,
        content: post.commentText,
      });
      if (generation !== pageGeneration.current) return;
      const converted = mapComment(res.data.data);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                lastCreatedComment: converted,
                commentText: "",
              }
            : p,
        ),
      );
      await fetchComments(postId, true);
      if (generation !== pageGeneration.current) return;
      setRequest(key, false);
    } catch (e) {
      if (generation !== pageGeneration.current) return;
      if (e.response?.status === 404) {
        setDetailNotice("문의글이 존재하지 않아 댓글을 등록하지 못했습니다.");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setListAttempt((prev) => prev + 1);
      } else {
        setRequest(
          key,
          false,
          e.response?.status === 403
            ? "이 문의글에 댓글을 작성할 권한이 없습니다."
            : getApiErrorMessage(e, "댓글 작성에 실패했습니다."),
        );
      }
    } finally {
      commentSubmissions.current.delete(postId);
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    const key = `deleteComment:${commentId}`;
    setRequest(key, true);
    try {
      // 삭제 응답 본문은 읽지 않고, 성공하면 댓글 목록을 재조회해 내용과 개수를 맞춥니다.
      await axiosInstance.delete(`/qna/comments/${commentId}`);
      setRequest(key, false);
      // fetchComments가 원문 삭제·접근 불가(403/404)를 확인하면 상세·목록까지 정리합니다.
      await fetchComments(postId);
    } catch (e) {
      const status = e.response?.status;
      if (status === 404) {
        setDetailNotice("이미 삭제되었거나 존재하지 않는 댓글입니다.");
        setRequest(key, false);
        await fetchComments(postId);
      } else {
        setRequest(
          key,
          false,
          status === 403
            ? "이 댓글을 삭제할 권한이 없습니다."
            : getApiErrorMessage(e, "댓글 삭제에 실패했습니다."),
        );
      }
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <BoardContent>
          <BoardTextContainer>
            <BoardTitle>문의 게시판</BoardTitle>
            <BoardDescription>
              궁금하신 점이나 요청사항을 남겨주시면
              <br />
              운영진이 확인 후 최대한 빠르게
              <br />
              답변 드리겠습니다.
              <br />
              자유롭게 작성해주세요!
            </BoardDescription>

            <BoardCaution>
              <CautionIcon /> NOTICE!
            </BoardCaution>

            <BoardFooter>
              답변은 아래 운영 시간 동안 제공됩니다.
              <br />
              운영진 답변 가능 시간 : 10:00 ~ 22:00
            </BoardFooter>
          </BoardTextContainer>

          <BoardContainer style={{ gap: 0 }}>
            <CenterContent style={{ marginBottom: 0, gap: "1rem" }}>
              <Title>무엇이든 물어봐</Title>
              <Notice>
                🙋 문의 후 운영진의 친절한 답변을 기다려주세요. <br />
                운영진이 해결해드릴게요!
              </Notice>
            </CenterContent>

            <InputArea
              style={{ marginTop: 0, marginBottom: "2.8rem", gap: "0.8rem" }}
            >
              <TextArea
                as="input"
                type="text"
                aria-label="문의 제목"
                placeholder="문의 제목을 입력하세요"
                value={title}
                maxLength={100}
                disabled={submitting}
                style={{
                  minHeight: "unset",
                  height: "3.5rem",
                  padding: "0.6rem 0.75rem",
                }}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Time>{title.length} / 100자</Time>
              <TextArea
                aria-label="문의 내용"
                placeholder="문의 내용을 입력하세요..."
                value={text}
                maxLength={2000}
                disabled={submitting}
                onChange={(e) => setText(e.target.value)}
              />
              <Time>{text.length} / 2,000자</Time>
              {createdPost && (
                <LoadingText role="status">문의가 등록되었습니다.</LoadingText>
              )}
              {requests.createPost?.error && (
                <ErrorMessage>{requests.createPost.error}</ErrorMessage>
              )}
              <ButtonRow>
                <Button onClick={addPost} disabled={submitting}>
                  {submitting ? "등록 중..." : "등록"}
                </Button>
                <Button
                  disabled={submitting}
                  onClick={() => {
                    setTitle("");
                    setText("");
                    setCreatedPost(null);
                    setRequest("createPost", false);
                  }}
                  style={{ background: "rgba(255,255,255,0.1)", color: "#ddd" }}
                >
                  취소
                </Button>
              </ButtonRow>
            </InputArea>

            <div style={{ marginTop: "0.8rem" }}>
              <Title>{isAdmin ? "전체 문의" : "내 문의"}</Title>
              {detailNotice && (
                <ErrorMessage role="alert">{detailNotice}</ErrorMessage>
              )}
              {loading ? (
                <LoadingText>게시글을 불러오는 중...</LoadingText>
              ) : requests.list?.error ? (
                <>
                  <ErrorMessage>{requests.list.error}</ErrorMessage>
                  <Button onClick={() => setListAttempt((prev) => prev + 1)}>
                    다시 시도
                  </Button>
                </>
              ) : posts.length === 0 ? (
                <LoadingText>아직 등록된 문의가 없습니다.</LoadingText>
              ) : (
                posts.map((post) => (
                  <PostBox key={post.id}>
                    <Nickname>익명</Nickname>
                    <Content>{post.title}</Content>
                    <Time>{post.time}</Time>
                    <SmallButton
                      onClick={() => togglePost(post.id)}
                      aria-expanded={post.expanded}
                      aria-controls={`qna-detail-${post.id}`}
                    >
                      {post.expanded ? "접기" : "펼치기"}
                    </SmallButton>
                    {post.expanded && (
                      <div id={`qna-detail-${post.id}`}>
                        {requests[`detail:${post.id}`]?.loading && (
                          <LoadingText>본문을 불러오는 중...</LoadingText>
                        )}
                        {requests[`detail:${post.id}`]?.error && (
                          <>
                            <ErrorMessage>
                              {requests[`detail:${post.id}`].error}
                            </ErrorMessage>
                            <Button onClick={() => fetchDetail(post.id)}>
                              다시 시도
                            </Button>
                          </>
                        )}
                        {post.detailLoaded && (
                          <>
                            <Content>{post.content}</Content>
                            {requests[`deletePost:${post.id}`]?.loading && (
                              <LoadingText>게시글을 삭제하는 중...</LoadingText>
                            )}
                            {requests[`deletePost:${post.id}`]?.error && (
                              <ErrorMessage>
                                {requests[`deletePost:${post.id}`].error}
                              </ErrorMessage>
                            )}
                            {requests[`comments:${post.id}`]?.loading && (
                              <LoadingText>댓글을 불러오는 중...</LoadingText>
                            )}
                            {requests[`comments:${post.id}`]?.error && (
                              <>
                                <ErrorMessage role="alert">
                                  {requests[`comments:${post.id}`].error}
                                </ErrorMessage>
                                <Button onClick={() => fetchComments(post.id)}>
                                  댓글 다시 불러오기
                                </Button>
                              </>
                            )}
                            {!requests[`comments:${post.id}`]?.loading &&
                              !requests[`comments:${post.id}`]?.error &&
                              post.comments?.length === 0 && (
                                <LoadingText>아직 댓글이 없습니다.</LoadingText>
                              )}

                            <ButtonRow
                              style={{
                                marginTop: "1rem",
                                justifyContent: "flex-start",
                              }}
                            >
                              <Button
                                onClick={() => toggleCommentInput(post.id)}
                                style={{
                                  minWidth: "unset",
                                  width: "auto",
                                  padding: "0 1.3rem",
                                }}
                              >
                                {requests[`comments:${post.id}`]?.error
                                  ? "댓글 조회 실패"
                                  : post.comments === null
                                    ? "댓글 보기"
                                    : `댓글 ${post.comments.length}`}
                              </Button>
                              {post.owner === true && (
                                <Button
                                  onClick={() => deletePost(post.id)}
                                  disabled={
                                    requests[`deletePost:${post.id}`]?.loading
                                  }
                                  style={{
                                    background: "rgba(255,60,60,0.15)",
                                    color: "#ff6666",
                                  }}
                                >
                                  삭제
                                </Button>
                              )}
                            </ButtonRow>

                            {post.showCommentInput && (
                              <InputArea style={{ marginTop: "1.2rem" }}>
                                {post.lastCreatedComment && (
                                  <LoadingText role="status">
                                    댓글이 등록되었습니다.
                                  </LoadingText>
                                )}
                                <TextArea
                                  placeholder="댓글을 입력하세요..."
                                  value={post.commentText}
                                  maxLength={1000}
                                  disabled={
                                    requests[`createComment:${post.id}`]
                                      ?.loading
                                  }
                                  onChange={(e) =>
                                    handleCommentChange(post.id, e.target.value)
                                  }
                                />
                                <Time>{post.commentText.length} / 1,000자</Time>
                                <ButtonRow>
                                  <Button
                                    onClick={() => addComment(post.id)}
                                    disabled={
                                      requests[`createComment:${post.id}`]
                                        ?.loading
                                    }
                                  >
                                    {requests[`createComment:${post.id}`]
                                      ?.loading
                                      ? "등록 중..."
                                      : "등록"}
                                  </Button>
                                  <Button
                                    onClick={() => toggleCommentInput(post.id)}
                                    style={{
                                      background: "rgba(255,255,255,0.1)",
                                      color: "#ddd",
                                    }}
                                  >
                                    취소
                                  </Button>
                                </ButtonRow>
                                {requests[`createComment:${post.id}`]
                                  ?.error && (
                                  <ErrorMessage>
                                    {requests[`createComment:${post.id}`].error}
                                  </ErrorMessage>
                                )}
                              </InputArea>
                            )}

                            {post.comments?.length > 0 && (
                              <CommentArea>
                                {post.comments.map((comment) => (
                                  <PostBox
                                    key={comment.id}
                                    style={{
                                      padding: "1.2rem 0 0.8rem",
                                      borderBottom: "none",
                                    }}
                                  >
                                    <Nickname>
                                      ↳ 익명
                                      {comment.adminComment === true && (
                                        <AdminBadge>운영진</AdminBadge>
                                      )}
                                    </Nickname>
                                    <Content>{comment.content}</Content>
                                    <Time>{comment.time}</Time>
                                    {requests[`deleteComment:${comment.id}`]
                                      ?.loading && (
                                      <LoadingText>
                                        댓글을 삭제하는 중...
                                      </LoadingText>
                                    )}
                                    {requests[`deleteComment:${comment.id}`]
                                      ?.error && (
                                      <ErrorMessage>
                                        {
                                          requests[
                                            `deleteComment:${comment.id}`
                                          ].error
                                        }
                                      </ErrorMessage>
                                    )}

                                    <ButtonRow
                                      style={{
                                        marginTop: "0.6rem",
                                        justifyContent: "flex-start",
                                      }}
                                    >
                                      {comment.owner === true && (
                                        <Button
                                          disabled={
                                            requests[
                                              `deleteComment:${comment.id}`
                                            ]?.loading
                                          }
                                          onClick={() =>
                                            deleteComment(post.id, comment.id)
                                          }
                                          style={{
                                            minWidth: "unset",
                                            width: "auto",
                                            padding: "0 1rem",
                                            fontSize: "0.9rem",
                                            background: "rgba(255,60,60,0.12)",
                                            color: "#ff7777",
                                          }}
                                        >
                                          삭제
                                        </Button>
                                      )}
                                    </ButtonRow>
                                  </PostBox>
                                ))}
                              </CommentArea>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </PostBox>
                ))
              )}
              {!loading && pageInfo && (
                <ButtonRow aria-label="문의 목록 페이지 이동">
                  <Button
                    disabled={pageInfo.page === 0}
                    onClick={() => setPage(pageInfo.page - 1)}
                  >
                    이전
                  </Button>
                  <Time aria-live="polite">
                    {pageInfo.totalPages === 0
                      ? "총 0건"
                      : `${pageInfo.page + 1} / ${pageInfo.totalPages} 페이지 · 총 ${pageInfo.totalElements}건`}
                  </Time>
                  <Button
                    disabled={pageInfo.page + 1 >= pageInfo.totalPages}
                    onClick={() => setPage(pageInfo.page + 1)}
                  >
                    다음
                  </Button>
                </ButtonRow>
              )}
            </div>
          </BoardContainer>
        </BoardContent>
      </PageContainer>
    </>
  );
}
