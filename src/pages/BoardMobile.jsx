import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { BsExclamationTriangle } from "react-icons/bs";

const BoardTextContainer = styled.div`
  max-width: 37.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 100%;
  }
`;

const BoardTitle = styled.h1`
  color: white;
  margin: 0.625rem 0;
  font-size: 6rem;
  font-weight: bold;
  white-space: nowrap;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 4rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const BoardDescription = styled.p`
  font-family: Pretendard;
  color: white;
  font-size: 1.5rem;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-weight: 500;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.25rem;
    margin-top: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const BoardCaution = styled.h2`
  color: #ff7710;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-size: 2rem;
  display: flex;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
    margin-top: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
    margin-top: 1rem;
  }
`;

const CautionIcon = styled(BsExclamationTriangle)`
  margin-right: 0.5rem;
  font-size: 2rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const BoardFooter = styled.p`
  color: white;
  margin: 0.625rem 0;
  margin-top: 1rem;
  font-size: 1.25rem;
  font-family: Pretendard;
  font-weight: lighter;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.875rem;
  }
`;

//Board layout

const BoardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;

  @media (max-width: ${breakpoints.desktop}) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

// Board panel

const BoardContainer = styled.div`
  max-width: 40rem;
  width: 100%;
  padding: 3.75rem 2.25rem;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  box-sizing: border-box;
  color: #ffff;
  font-family: Pretendard;

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 36rem;
    padding: 3rem 2rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 100%;
    padding: 2.5rem 1.75rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 2rem 1.25rem;
  }
`;

const PanelTitle = styled.h1`
  font-family: Pretendard;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffff;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.75rem;
  }

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

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

const PostBox = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.25rem 0;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem 0;
  }
`;

const Nickname = styled.div`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 1rem;
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const PostContent = styled.div`
  margin-top: 0.5rem;
  font-family: Pretendard;
  font-weight: 400;
  font-size: 1rem;
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const Time = styled.div`
  font-family: Pretendard;
  font-weight: 400;
  font-size: 0.875rem;
  opacity: 0.7;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

const ButtonRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
    padding: 0.65rem 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.875rem;
    padding: 0.5rem 1.25rem;
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

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    min-height: 4rem;
    padding: 0.6rem 0.75rem;
  }
`;

const BoardText = () => (
  <BoardTextContainer>
    <BoardTitle>문의 게시판</BoardTitle>
    <BoardDescription>
      궁금하신 점이나 문의 사항을 자유롭게 남겨주세요.
      <br />
      운영진이 확인 후 빠르게
      <br />
      답변 드리겠습니다
    </BoardDescription>
    <BoardCaution>
      <CautionIcon /> NOTICE!
    </BoardCaution>
    <BoardFooter>
      운영진 게시글 확인 시간 안내 (10:00 ~ 22:00)
      <br />
      해당 시간 외 문의는 다음날 확인될 수 있습니다.
    </BoardFooter>
  </BoardTextContainer>
);

//Main Component

export default function BoardMobile() {
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
    {
      id: 2,
      nickname: "익명",
      content: "문의드립니다.",
      time: "2026.03.13",
      isBlind: false,
      comments: [],
      showCommentInput: false,
      commentText: "",
    },
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
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, showCommentInput: !p.showCommentInput } : p,
      ),
    );
  };

  const handleCommentChange = (id, value) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, commentText: value } : p)),
    );
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
          ? {
              ...p,
              comments: [...p.comments, newComment],
              commentText: "",
              showCommentInput: false,
            }
          : p,
      ),
    );
  };

  const deleteComment = (postId, commentId) => {
    if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p,
      ),
    );
  };

  return (
    <>
      <Header />
      <PageContainer>
        <BoardContent>
          <BoardText />
          <BoardContainer>
            <PanelTitle>문의 게시판</PanelTitle>
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
                <PostContent>
                  {post.isBlind
                    ? "관리자에 의해 블라인드 처리된 게시글입니다"
                    : post.content}
                </PostContent>
                <Time>{post.time}</Time>
                <ButtonRow>
                  <Button onClick={() => toggleCommentInput(post.id)}>
                    댓글
                  </Button>
                  <Button onClick={() => deletePost(post.id)}>삭제</Button>
                </ButtonRow>

                {post.showCommentInput && (
                  <InputArea>
                    <TextArea
                      placeholder="댓글을 입력하세요"
                      value={post.commentText}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                    />
                    <ButtonRow>
                      <Button onClick={() => addComment(post.id)}>작성</Button>
                      <Button onClick={() => toggleCommentInput(post.id)}>
                        취소
                      </Button>
                    </ButtonRow>
                  </InputArea>
                )}

                {post.comments.map((comment) => (
                  <PostBox
                    key={comment.id}
                    style={{ marginLeft: "1rem", border: "none" }}
                  >
                    <Nickname>{comment.nickname}</Nickname>
                    <PostContent>{comment.content}</PostContent>
                    <Time>{comment.time}</Time>
                    <ButtonRow>
                      <Button
                        onClick={() => deleteComment(post.id, comment.id)}
                      >
                        삭제
                      </Button>
                    </ButtonRow>
                  </PostBox>
                ))}
              </PostBox>
            ))}
          </BoardContainer>
        </BoardContent>
      </PageContainer>
    </>
  );
}
