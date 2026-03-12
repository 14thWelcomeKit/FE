import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import bingoImage from "../images/bingo.svg";
import { BsExclamationTriangle } from "react-icons/bs";
import axiosInstance from "../axiosInstance";

const BingoTextContainer = styled.div`
  max-width: 37.5rem;
`;

const BingoTitle = styled.h1`
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
`;

const BingoDescription = styled.p`
  font-family: Pretendard;
  font-weight: medium;
  color: white;
  font-size: 1.5rem;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-weight: 500;
`;

const BingoCaution = styled.h2`
  color: #ff7710;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
`;

const CautionIcon = styled(BsExclamationTriangle)`
  margin-right: 0.5rem;
  font-size: 2rem;
`;

const BingoFooter = styled.p`
  color: white;
  margin: 0.625rem 0;
  margin-top: 1rem;
  font-size: 1.25rem;
  font-family: Pretendard;
  font-weight: lighter;
`;

const BingoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 0.25rem;
  }
`;

const BingoCard = styled.div`
  width: 10.625rem;
  height: 9.875rem;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 5s ease-in-out;

  ${({ flipped }) =>
    flipped &&
    `
        transform: rotateY(540deg);
    `}

  @media (max-width: ${breakpoints.laptop}) {
    width: 9rem;
    height: 8.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 7.5rem;
    height: 7rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 6rem;
    height: 5.5rem;
  }
`;

const BingoImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  object-fit: cover;
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(540deg);
  backface-visibility: hidden;
  font-size: 1.25rem;
  font-weight: bold;
  outline: 1px solid #9d9d9d;
  outline-offset: -1px;
  padding: 0.5rem;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`;

const BingoContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  @media (max-width: ${breakpoints.desktop}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const BingoText = () => (
  <BingoTextContainer>
    <BingoTitle>Let's Bingo</BingoTitle>
    <BingoDescription>
      여러분들의 팀과 함께 빙고를 채워보세요.
      <br />
      가장 먼저 빙고를 채운 팀에게는
      <br />
      굉장한 어메이징한 상품이 제공됩니다:)
    </BingoDescription>
    <BingoCaution>
      <CautionIcon /> CAUTION!
    </BingoCaution>
    <BingoFooter>
      빙고를 돌릴 수 있는 권한은 각 팀의 운영진에게만 있습니다.
      <br />
      팀원들과 잘 상의 후 결정해주시기 바랍니다.
    </BingoFooter>
  </BingoTextContainer>
);

export default function Bingo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const BingoCardComponent = ({
    image,
    content,
    isRevealed,
    index,
    onClick,
  }) => (
    <BingoCard onClick={() => onClick(index)} flipped={isRevealed}>
      <BingoImage src={image} alt={`Bingo ${content}`} />
      <CardContent>{content}</CardContent>
    </BingoCard>
  );

  const BingoBoard = ({ images, missions, handleCardClick }) => (
    <BingoCardContainer>
      {images.map((image, index) => (
        <BingoCardComponent
          key={image.id}
          image={image.src}
          content={image.content}
          isRevealed={missions[index]?.isRevealed}
          index={index}
          onClick={handleCardClick}
        />
      ))}
    </BingoCardContainer>
  );

  useEffect(() => {
    const fetchBingoData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/bingo");

        console.log("서버 응답 데이터:", response.data);

        const missionData = Array.isArray(response.data)
          ? response.data
          : response.data.missions || [];

        setMissions(missionData);
      } catch (error) {
        console.error("미션 데이터를 가져오는 데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchBingoData();
  }, []);

  const handleCardClick = async (index) => {
    if (isProcessing) {
      alert("이전 빙고 승인이 완료될 때까지 기다려주세요.");
      return;
    }

    if (selectedCell !== null) {
      alert("이미 선택된 미션이 있습니다. 관리자 승인을 기다려주세요.");
      return;
    }

    if (missions[index]?.isRevealed) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axiosInstance.put(
        `/bingo/reveal/${missions[index].id}`
      );
      console.log("빙고 승인 응답:", response.data);

      if (response.status === 200) {
        setMissions((prevMissions) =>
          prevMissions.map((mission, i) =>
            i === index
              ? { ...mission, isFlipping: true, content: response.data }
              : mission
          )
        );

        setTimeout(() => {
          setMissions((prevMissions) =>
            prevMissions.map((mission, i) =>
              i === index
                ? { ...mission, isRevealed: true, isFlipping: false }
                : mission
            )
          );
        }, 1000);
      }
    } catch (error) {
      console.error("빙고 승인이 실패했습니다:", error);
      alert("이미 선택된 미션이 있습니다. 관리자 승인을 기다려주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const images = missions.map((mission, index) => ({
    id: index + 1,
    src: bingoImage,
    content: mission.content || `${mission.mission}`,
  }));

  return (
    <>
      <Header />
      <PageContainer>
        <BingoContent>
          <BingoText />
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>미션 데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : (
            <BingoBoard
              images={images}
              missions={missions}
              handleCardClick={handleCardClick}
            />
          )}
        </BingoContent>
      </PageContainer>
    </>
  );
}
