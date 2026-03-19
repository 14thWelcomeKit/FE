import { useEffect, useState } from "react";
import styled from "styled-components";
import breakpoints from "../components/breakpoints";

const BoardContainer = styled.div`
  width: 42rem;
  height: 52rem;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  @media (max-width: ${breakpoints.laptop}) {
    display: none;
  }
`;

const BoardTitle = styled.div`
  width: 100%;
  height: 4rem;
  background-color: #f4f5f6;
  display: flex;
  flex-direction: row;
`;

const TitleBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 600;
  color: black;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const BoardRow = styled.div`
  width: 100%;
  height: 4rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
`;

const RowBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-top: 1px solid #9d9d9d;
  border-bottom: 1px solid #9d9d9d;
  border-left: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
    height: 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
    height: 3rem;
  }
`;

const FixBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  gap: 1rem;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
    height: 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
    height: 3rem;
  }
`;

const FixButton = styled.div`
  width: 5.5rem;
  height: 2.38rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ff7710;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    width: 4.5rem;
    height: 2rem;
    font-size: 0.9rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 4rem;
    height: 1.8rem;
    font-size: 0.8rem;
  }
`;

export default function CheckBoard({ memberdata }) {
  const [boarddata, setBoarddata] = useState(memberdata);
  useEffect(() => {
    setBoarddata(memberdata);
  }, [memberdata]);

  const handleAttendanceChange = (member) => {
    setBoarddata((prevData) =>
      prevData.map((item) => {
        if (item.teamName === member.teamName) {
          return {
            ...item,
            attendanceStatus:
              item.attendanceStatus === "ABSENT" ? "LATE" : "ABSENT",
          };
        }
        return item;
      })
    );
  };

  return (
    <BoardContainer>
      <BoardTitle>
        <TitleBox>팀</TitleBox>
        <TitleBox>이름</TitleBox>
        <TitleBox>출석</TitleBox>
        <TitleBox>출석수정</TitleBox>
      </BoardTitle>
      {boarddata
        .filter(
          (member) =>
            member.attendanceStatus === "ABSENT" ||
            member.attendanceStatus === "LATE"
        )
        .map((member, index) => (
          <BoardRow key={index}>
            <RowBox>{member.teamName}</RowBox>
            <RowBox>{member.name}</RowBox>
            <RowBox>
              {member.attendanceStatus === "LATE"
                ? "지각"
                : member.attendanceStatus === "ABSENT"
                  ? "결석"
                  : "상태 불명"}
            </RowBox>
            <FixBox>
              <FixButton
                onClick={() => {
                  alert(`${member.name}님의 출석을 변경합니다.`);
                  handleAttendanceChange(member);
                }}
              >
                출석수정
              </FixButton>
            </FixBox>
          </BoardRow>
        ))}
    </BoardContainer>
  );
}
