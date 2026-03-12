import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";

const BoardContainer = styled.div`
  max-width: 40rem;
  width: 90%;
  margin: 2rem auto;
  padding: 3.75rem 2.25rem;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  box-sizing: border-box;
  color: #ffff;
  font-family: Pretendard;

  @media (max-width: ${breakpoints.mobile}) {
    width: 95%;
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-family: Pretendard;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Notice = styled.div`
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 300;
  color: #ff7710;
  margin-bottom: 1.5rem;
`;

const PostBox = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.25rem 0;
`;

const Nickname = styled.div`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 1rem;
  color: #ffff;
`;

const Content = styled.div`
  margin-top: 0.5rem;
  font-family: Pretendard;
  font-weight: 400;
  font-size: 1rem;
  color: #ffff;
`;

const Time = styled.div`
  font-family: Pretendard;
  font-weight: 400;
  font-size: 0.875rem;
  opacity: 0.7;
`;

const ButtonRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffff;
  color: #ff7710;
  border-radius: 3.125rem;
  font-family: Pretendard;
  font-weight: 600;
  font-size: 1.125rem;
  padding: 0.75rem 2rem;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #ff7710;
    color: #ffff;
  }
`;

const InputArea = styled.div`
  margin-top: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  padding: 0.75rem 1rem;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  color: #333;

  &:focus {
    border-color: #ff7710;
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`;

export default function Board() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      nickname: "익명",
      content: "문의드립니다.",
      time: "2026.03.13",
      isBlind: false,
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
      isBlind: false,
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
    setPosts(posts.map(p =>
      p.id === id ? { ...p, showCommentInput: !p.showCommentInput } : p
    ));
  };

  const handleCommentChange = (id, value) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, commentText: value } : p
    ));
  };

  const addComment = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post.commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      nickname: "익명",
      content: post.commentText,
      time: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };

    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, newComment], commentText: "", showCommentInput: false }
        : p
    ));
  };

  const deleteComment = (postId, commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, comments: p.comments.filter(c => c.id !== commentId) }
        : p
    ));
  };

  return (
    <>
      <Header />
      <PageContainer>
        <BoardContainer>
          <Title>문의 게시판</Title>
          <Notice>운영진 게시글 확인 시간 안내 (10:00 ~ 22:00)</Notice>

          <InputArea>
            <TextArea
              placeholder="문의 내용을 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <ButtonRow>
              <Button onClick={addPost}>작성</Button>
              <Button onClick={() => setText("")}>취소</Button>
            </ButtonRow>
          </InputArea>

          {posts.map((post) => (
            <PostBox key={post.id}>
              <Nickname>{post.nickname}</Nickname>
              <Content>
                {post.isBlind
                  ? "관리자에 의해 블라인드 처리된 게시글입니다"
                  : post.content}
              </Content>
              <Time>{post.time}</Time>
              <ButtonRow>
                <Button onClick={() => toggleCommentInput(post.id)}>댓글</Button>
                <Button onClick={() => deletePost(post.id)}>삭제</Button>
              </ButtonRow>

              {post.showCommentInput && (
                <InputArea>
                  <TextArea
                    placeholder="댓글을 입력하세요"
                    value={post.commentText}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <ButtonRow>
                    <Button onClick={() => addComment(post.id)}>작성</Button>
                    <Button onClick={() => toggleCommentInput(post.id)}>취소</Button>
                  </ButtonRow>
                </InputArea>
              )}

              {post.comments.map((comment) => (
                <PostBox key={comment.id} style={{ marginLeft: "1rem", border: "none" }}>
                  <Nickname>{comment.nickname}</Nickname>
                  <Content>{comment.content}</Content>
                  <Time>{comment.time}</Time>
                  <ButtonRow>
                    <Button onClick={() => deleteComment(post.id, comment.id)}>삭제</Button>
                  </ButtonRow>
                </PostBox>
              ))}
            </PostBox>
          ))}
        </BoardContainer>
      </PageContainer>
    </>
  );
}