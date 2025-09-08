import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";
import Image from "../image/Logo.png";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/Breakpoints";

const MypageContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 85.5rem;
  height: auto;
  min-height: 47.56rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 100%;
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    padding: 2rem 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;

const MypageHeader = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 5.56rem;
  flex-direction: row;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.tablet}) {
    height: auto;
    gap: 24px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const MypageBody = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 32.44rem;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: ${breakpoints.laptop}) {
    height: auto;
  }

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const TextBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: auto;
  min-height: 29.25rem;
  margin-left: 2rem;

  @media (max-width: ${breakpoints.laptop}) {
    margin-left: 2rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
  }
`;

const ImgBody = styled.img`
  width: 45%;
  max-width: 32.4375rem;
  height: auto;
  object-fit: contain;
  aspect-ratio: 1/1;

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 25rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    max-width: 20rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 17.87rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    margin-top: 1rem;
    justify-content: space-between;
  }
`;

const HeaderText = styled.h1`
  width: auto;
  max-width: 51.63rem;
  margin: 0;
  color: #ffff;
  font-family: Montserrat;
  font-size: 4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 5.6rem */
  letter-spacing: -0.1rem;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    font-size: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const MypageButton = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 13rem;
  height: 3.25rem;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  border-radius: 3.125rem;
  background-color: #ffff;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.75rem */
  letter-spacing: -0.03125rem;
  cursor: pointer;

  &:hover {
    background-color: #ff7710;
    color: #ffff;
  }

  @media (max-width: ${breakpoints.laptop}) {
    width: 10rem;
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin: 0;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 48%;
    height: 2.5rem;
    font-size: 0.875rem;
    padding: 0.5rem;
    line-height: 100%;
    letter-spacing: -0.02188rem;
  }
`;

const MypageText = styled.h1`
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.02813rem;
  color: #ffff;
  margin: 0;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const MypageBox = styled.div`
  display: flex;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  align-items: center;
  border-radius: 3.125rem;
  box-sizing: border-box;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.19);
  border-color: rgba(255, 255, 255, 0.19);
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    height: 2.75rem;
    padding: 0.5rem 1.5rem;
  }
`;

export default function MyPage() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [manito, setManito] = useState(null);
  const [manitoMessage, setManitoMessage] = useState("");
  const [manitoError, setManitoError] = useState("");

  useEffect(() => {
    fetchMyData();
    fetchMyProfile();
    fetchMyManito();
  }, []);

  const fetchMyData = async () => {
    try {
      const response = await axiosInstance.get("/user/info");
      console.log(response.data);
      setUserdata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profileImage", {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const fetchMyManito = async () => {
    try {
      const res = await axiosInstance.get("/manito/my");
      if (typeof res.data === "string") {
        setManito(null);
        setManitoMessage(res.data); // "아직 마니또 생성 전입니다!" 등
      } else {
        setManito(res.data);
        setManitoMessage("");
      }
      setManitoError("");
    } catch (err) {
      setManitoError(
        err.response?.data || "마니또 정보를 불러오지 못했습니다."
      );
    }
  };

  return (
    <>
      <Header></Header>
      <PageContainer>
        <MypageContainer>
          <MypageHeader>
            <HeaderText>MY Page</HeaderText>
            <ButtonContainer>
              <MypageButton onClick={() => navigate("/change-profile")}>
                프로필 이미지 변경
              </MypageButton>
              <MypageButton onClick={() => navigate("/change-password")}>
                비밀번호 변경
              </MypageButton>
            </ButtonContainer>
          </MypageHeader>
          <MypageBody>
            <ImgBody src={profileImage || Image} alt="프로필 이미지" />
            <TextBody>
              <MypageText>이름</MypageText>
              <MypageBox>{userdata.name}</MypageBox>
              <MypageText>학번</MypageText>
              <MypageBox>{userdata.studentName}</MypageBox>
              <MypageText>소속팀</MypageText>
              <MypageBox>{userdata.teamName}</MypageBox>
              <MypageText>개발트랙</MypageText>
              <MypageBox>{userdata.devPart}</MypageBox>
              <MypageText>나의 마니또</MypageText>
              <MypageBox>
                {manito?.name || manitoMessage || (manitoError ? "-" : "-")}
              </MypageBox>
            </TextBody>
          </MypageBody>
        </MypageContainer>
      </PageContainer>
    </>
  );
}
