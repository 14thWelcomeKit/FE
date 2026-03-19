import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/breakpoints";
import Header from "../components/Header";
import { BsInstagram } from "react-icons/bs";
import { SiVelog } from "react-icons/si";

import introduce from "../images/introduce/introduce.png";
import logo from "../images/introduce/RGB_LIKELION_UNIV_KR_WHITE.png";
import hackathon from "../images/introduce/hackathon.png";
import mopt from "../images/introduce/mopt.png";
import pium from "../images/introduce/pium.png";
import ywave from "../images/introduce/ywave.png";
import unibiz from "../images/introduce/unibiz.png";
import yogiyongin from "../images/introduce/yogiyongin.png";
import Left from "../images/introduce/left.svg";
import Right from "../images/introduce/right.svg";
import ot from "../images/introduce/ot.png";
import ideathon from "../images/introduce/ideathon.png";
import miniproject from "../images/introduce/miniproject.png";
import pshs from "../images/introduce/pshs.png";
import night from "../images/introduce/night.png";

const Container = styled(PageContainer)`
  flex-direction: column;
  align-items: center;
  gap: 20rem;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 10rem;
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 240px;
  align-self: stretch;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 120px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 80px;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 40px;
  }
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const Title = styled.p`
  color: #fff;
  text-align: center;
  font-family: Montserrat;
  font-size: 32px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.8px;
  margin: 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const SideTitle = styled(Title)`
  text-align: ${(props) => (props.alignRight ? "right" : "left")};

  @media (max-width: ${breakpoints.tablet}) {
    text-align: center;
  }
`;

const Explain = styled.p`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.5px;
  margin: 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    br {
      display: none;
    }
  }
`;

const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
  max-width: ${(props) => props.maxWidth || "100%"};
  max-height: ${(props) => props.maxHeight || "auto"};
  object-fit: contain;
`;

const Start = styled.div`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 36px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.9px;
  padding: 0 20px;
  margin: 0;

  span {
    color: var(--orange);
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 22px;
  }
`;

const First = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  width: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 40px;
  }
`;

const SubTitle = styled.div`
  color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.6px;
  flex-wrap: wrap;
  padding: 0 20px;
  margin: 0;

  span {
    color: var(--orange);
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 20px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: 120px;
  align-self: stretch;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.laptop}) {
    gap: 60px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    gap: 30px;
    flex-direction: column;
  }
`;

const TrackName = styled.p`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 48px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -1.2px;
  margin: 0;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 40px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 32px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const Second = styled.div`
  display: flex;
  width: 45vw;
  max-width: 670px;
  aspect-ratio: 1 / 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(254, 88, 38, 0.5) 0%,
    rgba(0, 0, 0, 0) 47.5%
  );
  text-align: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.laptop}) {
    width: 45vw;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 50vw;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 75vw;
    max-width: 280px;
  }
`;

const SecondContainer = styled.div`
  display: flex;
  width: 90%;
  max-width: 550px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 30px;

  @media (max-width: ${breakpoints.tablet}) {
    max-width: 280px;
    gap: 20px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 230px;
    gap: 15px;
  }
`;

const Text = styled.p`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 300;
  line-height: 140%;
  letter-spacing: -0.5px;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 16px;
    max-width: 85%;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
    max-width: 80%;
  }
`;

const SideText = styled(Text)`
  text-align: ${(props) => (props.alignRight ? "right" : "left")};
  white-space: pre-line;

  @media (max-width: ${breakpoints.tablet}) {
    text-align: center;
    white-space: normal;
  }
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-self: stretch;
  align-items: center;
  width: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    gap: 30px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const ImageContent = styled.div`
  display: flex;
  gap: 24px;
  width: calc(100% * 2);
  animation: scroll 20s linear infinite;
  padding-top: 3rem;

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  img {
    height: auto;
    width: 100%;
    min-width: 200px;
    object-fit: contain;
    border-radius: 20px;

    @media (max-width: ${breakpoints.tablet}) {
      max-width: 200px;
    }

    @media (max-width: ${breakpoints.mobile}) {
      max-width: 150px;
    }
  }
`;

const ImageClick = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  width: 100%;

  @media (max-width: ${breakpoints.laptop}) {
    gap: 40px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    gap: 20px;
  }

  img {
    object-fit: contain;

    &.arrow {
      width: 30px;
      height: auto;
      cursor: pointer;

      @media (max-width: ${breakpoints.mobile}) {
        width: 20px;
      }
    }

    &.content {
      width: 100%;
      max-width: 904px;
      height: auto;
      max-height: 468px;
    }
  }
`;

const SideImage = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;

  @media (max-width: ${breakpoints.laptop}) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
  }
`;

const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.alignRight ? "flex-end" : "flex-start")};
  gap: 48px;
  width: 100%;
  @media (max-width: ${breakpoints.laptop}) {
    align-items: center;
  }
  @media (max-width: ${breakpoints.tablet}) {
    gap: 30px;
    align-items: center;
  }
`;

const SocialContainer = styled(SideImage)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  max-width: 900px;
  width: auto;
  padding-bottom: 10rem;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 30px;
  }
`;

const SocialItem = styled(SideImage)`
  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: row;
    gap: 15px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: 10px;
  }
`;

const SocialIcon = styled.div`
  width: 92px;
  height: 92px;
  color: var(--orange);

  @media (max-width: ${breakpoints.tablet}) {
    width: 72px;
    height: 72px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 52px;
    height: 52px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const SocialText = styled(Start)`
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 22px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const SCROLL_IMAGES = [
  mopt,
  pium,
  ywave,
  unibiz,
  yogiyongin,
];

const CAROUSEL_IMAGES = [
  ot,
  ideathon,
  miniproject,
];

export default function Introduce() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? CAROUSEL_IMAGES.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === CAROUSEL_IMAGES.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSocialClick = (url) => {
    window.location.href = url;
  };

  return (
    <>
      <Header />
      <Container>
        <Contents>
          <TitleContainer>
            <TitleText>
              <Title>About us</Title>
              <Explain>
                2013년, 서울대학교에서 이두희 대표를 필두로 시작된 '멋쟁이사자처럼 대학'. <br />
                현재는 국내외 122개 대학, 12,000명 이상이 활동하는
                국내 최대 규모의 AI/IT 동아리로 자리매김하였습니다. <br />
                "내 아이디어를 내 손으로 실현한다"는 모토로, <br />
                누구든지 자신이 원하는 IT 서비스를 구현할 수 있도록
                각종 스터디와 네트워킹, 행사를 지원하고 있습니다.
              </Explain>
            </TitleText>
            <ResponsiveImage src={introduce} alt="소개 이미지" />
          </TitleContainer>

          <Start>
            멋쟁이사자처럼 대학은 14기를 맞이해, <br />
            <span>보다 전문적인 AI/IT 동아리</span>로 새롭게 시작합니다.
          </Start>

          <First>
            <SubTitle>
              1. 개발 트랙을 &nbsp;<span>2가지</span>로 나누어 진행합니다.
            </SubTitle>
            <Track>
              <TrackName>FE(프론트엔드)</TrackName>
              <TrackName>BE(백엔드)</TrackName>
            </Track>
          </First>

          <Second>
            <SecondContainer>
              <SubTitle>
                2. 2025년보다 &nbsp;<span> 더욱 강화된 교육</span>을 제공합니다.
              </SubTitle>
              <ResponsiveImage src={logo} alt="멋사 로고" maxWidth="28rem" />
              <Text>
                멋쟁이사자처럼 대학 교육 플랫폼 멋사 VOD 강좌와 <br />
                교육 콘텐츠 PBL을 무상 제공합니다. <br />
                활동 시 선택한 트랙이 아니여도 모든 강의를 수강하실 수 있습니다.
              </Text>
            </SecondContainer>
          </Second>

          <ContentsContainer>
            <SubTitle>
              3. &nbsp;<span>다양한 해커톤</span>을 통해 여러분의 코딩 실력을
              상승시킬 수 있습니다.
            </SubTitle>
            <Text>
              중앙아이디어톤(5월), 중앙해커톤(8월), 연합해커톤, 기업해커톤 등 <br />
              다양한 해커톤을 통해 여러 사람과 교류하며 코딩 실력도 향상시킬 수 있습니다.
            </Text>
            <ResponsiveImage
              src={hackathon}
              alt="해커톤 이미지"
              maxWidth="906px"
              maxHeight="468px"
            />
            <ImageContainer>
              <ImageContent imageCount={SCROLL_IMAGES.length}>
                {SCROLL_IMAGES.map((src, i) => (
                  <img key={i} src={src} alt={`logo-${i}`} />
                ))}
                {SCROLL_IMAGES.map((src, i) => (
                  <img
                    key={`duplicate-${i}`}
                    src={src}
                    alt={`logo-duplicate-${i}`}
                  />
                ))}
              </ImageContent>
            </ImageContainer>
          </ContentsContainer>

          <ContentsContainer>
            <SubTitle>
              4. 다양한 개발 경험과 능력 있는 운영진들이 &nbsp;
              <span>직접 세션</span>을 진행합니다.
            </SubTitle>
            <Text>
              총 12분의 운영진이 각 팀 프로젝트의 팀장을 맡고
              정성들여 세션도 진행합니다.
            </Text>
            <ImageClick>
              <img
                src={Left}
                onClick={goToPrevious}
                className="arrow"
                alt="이전"
              />
              <img
                src={CAROUSEL_IMAGES[currentIndex]}
                className="content"
                alt={`세션 이미지 ${currentIndex + 1}`}
              />
              <img
                src={Right}
                onClick={goToNext}
                className="arrow"
                alt="다음"
              />
            </ImageClick>
          </ContentsContainer>

          <Start>
            추가적으로, 한국외대(글로벌) 멋사는 다음과 같은 <span>특별한</span>{" "}
            활동을 진행합니다.
          </Start>

          <SideImage>
            <ResponsiveImage
              src={pshs}
              alt="교육봉사"
              maxWidth="672px"
              maxHeight="336px"
            />
            <SideContainer>
              <SideTitle>풍생고 교육봉사 활동</SideTitle>
              <SideText>
                풍생고 학생들을 대상으로 코딩 멘토링 프로그램을 진행합니다. <br />
                프론트엔드와 백엔드 파트로 나누어 진행되며, 멘토들은 학생들과
                함께 스터디를 운영하거나 프로젝트를 수행합니다. <br />
                풍생고 교육봉사 진행 시, 봉사활동 시간이 인정되며 소정의 강사비도 지급됩니다.
              </SideText>
            </SideContainer>
          </SideImage>

          <SideImage>
            <SideContainer alignRight>
              <SideTitle alignRight>멋사인의 밤</SideTitle>
              <SideText alignRight>
                선배 사자들과 직접 만나는 한국외대 글캠 한정 행사를 진행합니다. <br />
                다양한 게임과 프로그램을 통해 선배 사자들과 자연스럽게 교류할 수 있고
                프로젝트 경험, 진로 고민, 취업 준비 과정 등을 나눌 수 있는 네트워킹 기회를 제공합니다.
              </SideText>
            </SideContainer>
            <ResponsiveImage
              src={night}
              alt="멋사인의 밤"
              maxWidth="672px"
              maxHeight="336px"
            />
          </SideImage>

          <Start>
            14기 아기사자 여러분, 1년동안 열정적으로 참여하시어 꼭{" "}
            <span>수료</span>하시길 바랍니다!
          </Start>
        </Contents>

        <First>
          <Start>한국외대(글로벌) 멋사에 대해 조금 더 알고 싶다면?</Start>
          <SocialContainer>
            <SocialItem
              onClick={() =>
                handleSocialClick(
                  "https://www.instagram.com/hufsglobal_likelion/"
                )
              }
            >
              <SocialIcon>
                <BsInstagram />
              </SocialIcon>
              <SocialText>
                <span>Instagram</span>&nbsp; hufs global
              </SocialText>
            </SocialItem>
            <SocialItem
              onClick={() =>
                handleSocialClick("https://velog.io/@hufsglobal09/posts")
              }
            >
              <SocialIcon>
                <SiVelog />
              </SocialIcon>
              <SocialText>
                <span>Velog</span>&nbsp; hufs global
              </SocialText>
            </SocialItem>
          </SocialContainer>
        </First>
      </Container >
    </>
  );
}
