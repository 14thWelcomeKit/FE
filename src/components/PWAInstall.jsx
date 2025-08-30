import { useState, useEffect } from "react";
import styled from "styled-components";
import breakpoints from "./Breakpoints";

const InstallButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  background: #ff7710;
  color: #ffff;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${breakpoints.mobile}) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
`;

const InstallPrompt = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 999;
  max-width: 20rem;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${breakpoints.mobile}) {
    bottom: 5rem;
    right: 1.5rem;
    left: 1.5rem;
    max-width: none;
  }
`;

const PromptTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
`;

const PromptText = styled.p`
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const PromptButton = styled.button`
  background: #ff7710;
  color: #ffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background: #e65a00;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // PWA 설치 이벤트 리스너
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // PWA 설치 완료 이벤트 리스너
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
    };

    // 이미 설치되어 있는지 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA 설치가 수락되었습니다.');
    } else {
      console.log('PWA 설치가 거부되었습니다.');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleShowPrompt = () => {
    setShowInstallPrompt(true);
  };

  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
  };

  // 이미 설치되어 있거나 설치 프롬프트가 없는 경우 버튼 숨김
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <>
      <InstallButton onClick={handleShowPrompt} title="앱 설치">
        📱
      </InstallButton>
      
      {showInstallPrompt && (
        <InstallPrompt>
          <PromptTitle>WelcomeKit 앱 설치</PromptTitle>
          <PromptText>
            홈 화면에 WelcomeKit을 추가하여 더 빠르고 편리하게 사용하세요.
          </PromptText>
          <PromptButton onClick={handleInstallClick}>
            설치
          </PromptButton>
          <CloseButton onClick={handleClosePrompt}>
            나중에
          </CloseButton>
        </InstallPrompt>
      )}
    </>
  );
}
