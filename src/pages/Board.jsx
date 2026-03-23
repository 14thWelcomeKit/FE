import { useState, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { BsExclamationTriangle } from "react-icons/bs";

import axiosInstance from "./../axiosInstance";
const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL);
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

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 현재 로그인된 userId (실제 인증 연동 시 교체)
  const userId = 1;

  const fetchComments = async (qnaId) => {
    try {
      const res = await axiosInstance.get(`/qna/comments/${qnaId}`);
      console.log(res.data);
      const data = res.data;
      return data.map((c) => ({
        id: c.id,
        content: c.content,
        time: formatDate(c.createdAt),
        isAdmin: c.isAdminComment,
      }));
    } catch {
      return [];
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/qna");
      const data = res.data;
      const converted = await Promise.all(
        data.map(async (p) => {
          const comments = await fetchComments(p.id);
          return {
            id: p.id,
            content: p.content,
            title: p.title,
            time: formatDate(p.createdAt),
            comments,
            showCommentInput: false,
            commentText: "",
          };
        }),
      );
      setPosts(converted);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const params = new URLSearchParams({
        userId,
        title: text.slice(0, 50),
        content: text,
      });
      const res = await axiosInstance.post(`/qna?${params.toString()}`);
      const newP = res.data;
      const converted = {
        id: newP.id,
        content: newP.content,
        title: newP.title,
        time: formatDate(newP.createdAt),
        comments: [],
        showCommentInput: false,
        commentText: "",
      };
      setPosts((prev) => [converted, ...prev]);
      setText("");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/qna/${id}?userId=${userId}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message);
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
    const post = posts.find((p) => p.id === postId);
    if (!post?.commentText.trim()) return;
    try {
      const params = new URLSearchParams({
        userId,
        qnaId: postId,
        content: post.commentText,
      });
      const res = await axiosInstance.post(
        `/qna/comments?${params.toString()}`,
      );
      const newC = res.data;
      const converted = {
        id: newC.id,
        content: newC.content,
        time: formatDate(newC.createdAt),
        isAdmin: newC.isAdminComment,
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [...p.comments, converted],
                commentText: "",
                showCommentInput: false,
              }
            : p,
        ),
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/qna/comments/${commentId}?userId=${userId}`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
            : p,
        ),
      );
    } catch (e) {
      setError(e.message);
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
                placeholder="문의 내용을 입력하세요..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <ButtonRow>
                <Button onClick={addPost} disabled={submitting}>
                  {submitting ? "등록 중..." : "등록"}
                </Button>
                <Button
                  onClick={() => setText("")}
                  style={{ background: "rgba(255,255,255,0.1)", color: "#ddd" }}
                >
                  취소
                </Button>
              </ButtonRow>
            </InputArea>

            <div style={{ marginTop: "0.8rem" }}>
              {loading ? (
                <LoadingText>게시글을 불러오는 중...</LoadingText>
              ) : posts.length === 0 ? (
                <LoadingText>아직 등록된 문의가 없습니다.</LoadingText>
              ) : (
                posts.map((post) => (
                  <PostBox key={post.id}>
                    <Nickname>익명</Nickname>
                    <Content>{post.content}</Content>
                    <Time>{post.time}</Time>

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
                        댓글 {post.comments.length}
                      </Button>
                      {/**<Button
                        onClick={() => deletePost(post.id)}
                        style={{
                          background: "rgba(255,60,60,0.15)",
                          color: "#ff6666",
                        }}
                      >
                        삭제
                      </Button> */}
                    </ButtonRow>

                    {post.showCommentInput && (
                      <InputArea style={{ marginTop: "1.2rem" }}>
                        <TextArea
                          placeholder="댓글을 입력하세요..."
                          value={post.commentText}
                          onChange={(e) =>
                            handleCommentChange(post.id, e.target.value)
                          }
                        />
                        <ButtonRow>
                          <Button onClick={() => addComment(post.id)}>
                            등록
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
                      </InputArea>
                    )}

                    {post.comments.length > 0 && (
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
                              ↳ {comment.isAdmin ? "운영진" : "익명"} ...
                            </Nickname>
                            <Content>{comment.content}</Content>
                            <Time>{comment.time}</Time>

                            <ButtonRow
                              style={{
                                marginTop: "0.6rem",
                                justifyContent: "flex-start",
                              }}
                            >
                              {/** <Button
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
                              </Button> */}
                            </ButtonRow>
                          </PostBox>
                        ))}
                      </CommentArea>
                    )}
                  </PostBox>
                ))
              )}
            </div>
          </BoardContainer>
        </BoardContent>
      </PageContainer>
    </>
  );
}
