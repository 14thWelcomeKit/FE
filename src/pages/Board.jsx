import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { BsExclamationTriangle } from "react-icons/bs";

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
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 1.4rem;
    padding: 0 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1.6rem;
    margin-top: 1.2rem;
    padding: 0 1rem;
  }
`;

const BoardTextContainer = styled.div`
  flex: 1;
  min-width: 450px;
  font-size: 1.4rem;
  text-align: left;

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 100%;
    text-align: center;
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
    max-width: 94%;
    padding: 1.8rem 2rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 96%;
    padding: 1.5rem 1.4rem;
    gap: 1.4rem;
    border-radius: 1.3rem;
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
  color: #ff7710;
  font-size: 1.35rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.2rem 0 0.8rem;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
  }
`;

const CautionIcon = styled(BsExclamationTriangle)`
  font-size: 1.6rem;
`;

const BoardFooter = styled.p`
  color: #ddd;
  font-size: 1.1rem;
  line-height: 1.45;
`;

const Title = styled.h2`
  color: white;
  font-size: 2.3rem;
  font-weight: 700;
  margin: 0 0 0.8rem;
`;

const Notice = styled.div`
  font-size: 1.1rem;
  color: #ffaa44;
  margin-bottom: 1rem;
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

  &:focus {
    border-color: #ff7710;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: ${breakpoints.mobile}) {
    min-height: 4.2rem;
    padding: 0.85rem 1.1rem;
    font-size: 0.98rem;
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
  color: #ff7710;
  border: none;

  &:hover {
    background: #ff7710;
    color: white;
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
`;

const Content = styled.div`
  margin: 0.7rem 0 0.3rem;       
  font-size: 1.03rem;
  line-height: 1.6;
  color: white;
  word-break: break-word;
`;

const Time = styled.div`
  font-size: 0.78rem;
  color: #aaa;
  opacity: 0.85;
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

export default function Board() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      nickname: "익명",
      content: "문의드립니다.",
      time: "2026.03.13",
      comments: [],
      showCommentInput: false,
      commentText: "",
    },
  ]);

  const [text, setText] = useState("");

  const addPost = () => {
    if (!text.trim()) return;
    const newPost = {
      id: Date.now(),
      nickname: "익명",
      content: text,
      time: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      comments: [],
      showCommentInput: false,
      commentText: "",
    };
    setPosts([newPost, ...posts]);
    setText("");
  };

  const deletePost = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setPosts(posts.filter((p) => p.id !== id));
  };

  const toggleCommentInput = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, showCommentInput: !p.showCommentInput } : p)));
  };

  const handleCommentChange = (id, value) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, commentText: value } : p)));
  };

  const addComment = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post.commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      nickname: "익명",
      content: post.commentText,
      time: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment], commentText: "", showCommentInput: false }
          : p
      )
    );
  };

  const deleteComment = (postId, commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
      )
    );
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
              <Title>🦁 무엇이든 물어봐 🦁</Title>
              <Notice>🙋 문의 후 운영진의 친절한 답변을 기다려주세요. 운영진이 해결해드릴게요!</Notice>
            </CenterContent>

            <InputArea style={{ marginTop: 0, marginBottom: "2.8rem", gap: "0.8rem" }}>
              <TextArea
                placeholder="문의 내용을 입력하세요..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <ButtonRow>
                <Button onClick={addPost}>등록</Button>
                <Button
                  onClick={() => setText("")}
                  style={{ background: "rgba(255,255,255,0.1)", color: "#ddd" }}
                >
                  취소
                </Button>
              </ButtonRow>
            </InputArea>

            <div style={{ marginTop: "0.8rem" }}>
              {posts.map((post) => (
                <PostBox key={post.id}>
                  <Nickname>{post.nickname}</Nickname>
                  <Content>{post.content}</Content>
                  <Time>{post.time}</Time>

                  <ButtonRow style={{ marginTop: "1rem", justifyContent: "flex-start" }}>
                    <Button
                      onClick={() => toggleCommentInput(post.id)}
                      style={{ minWidth: "unset", width: "auto", padding: "0 1.3rem" }}
                    >
                      댓글 {post.comments.length}
                    </Button>
                    <Button
                      onClick={() => deletePost(post.id)}
                      style={{ background: "rgba(255,60,60,0.15)", color: "#ff6666" }}
                    >
                      삭제
                    </Button>
                  </ButtonRow>

                  {post.showCommentInput && (
                    <InputArea style={{ marginTop: "1.2rem" }}>
                      <TextArea
                        placeholder="댓글을 입력하세요..."
                        value={post.commentText}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      />
                      <ButtonRow>
                        <Button onClick={() => addComment(post.id)}>등록</Button>
                        <Button
                          onClick={() => toggleCommentInput(post.id)}
                          style={{ background: "rgba(255,255,255,0.1)", color: "#ddd" }}
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
                          style={{ padding: "1.2rem 0 0.8rem", borderBottom: "none" }}
                        >
                          <Nickname>↳ {comment.nickname}</Nickname>
                          <Content>{comment.content}</Content>
                          <Time>{comment.time}</Time>

                          <ButtonRow style={{ marginTop: "0.6rem", justifyContent: "flex-start" }}>
                            <Button
                              onClick={() => deleteComment(post.id, comment.id)}
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
                          </ButtonRow>
                        </PostBox>
                      ))}
                    </CommentArea>
                  )}
                </PostBox>
              ))}
            </div>
          </BoardContainer>
        </BoardContent>
      </PageContainer>
    </>
  );
}