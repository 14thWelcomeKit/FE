import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import breakpoints from "./breakpoints";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ReactComponent as mainlogo } from "../images/mainlogo.svg";

export const AuthContainer = styled.div`
  display: flex;
  width: 29rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.laptop}) {
    width: 24rem;
    padding: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 20rem;
    padding: 2rem;
  }
`;

export const AuthTitle = styled.h1`
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.05rem;
  margin: 0 0 0.5rem;
  color: #fff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const AuthLabel = styled.h1`
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.02813rem;
  color: #fff;
  margin: 1rem 0;
`;

export const AuthInput = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;

  border-radius: 3.125rem;
  border: 1px solid rgba(255, 255, 255, 0.19);
  background-color: rgba(255, 255, 255, 0.19);

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 400;

  color: #fff;
  caret-color: #fff;

  outline: none;

  &:focus {
    border-color: #fff;
  }

  &::placeholder {
    color: #9d9d9d;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const PasswordField = styled(AuthInput)`
  margin-bottom: 0;
  padding-right: 4rem;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: none;
  background: transparent;

  color: #fff;
  font-size: 1.1rem;

  cursor: pointer;
`;

export function AuthPasswordInput({
  value,
  onChange,
  placeholder,
  id,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordWrapper>
      <PasswordField
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <PasswordToggleButton
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </PasswordToggleButton>
    </PasswordWrapper>
  );
}

export const AuthActionRow = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: 3.25rem;

  padding: 0.375rem;
  padding-left: 2rem;
  box-sizing: border-box;

  border-radius: 3.125rem;
  border: 1px solid rgba(255, 255, 255, 0.19);
  background-color: rgba(255, 255, 255, 0.19);

  margin-bottom: 0.5rem;

  &:focus-within {
    border-color: #fff;
  }
`;

export const AuthActionInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;

  padding: 0 1rem 0 0;
  box-sizing: border-box;

  border: none;
  outline: none;
  background: transparent;

  color: #fff;
  caret-color: #fff;

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 400;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: #9d9d9d;
  }
`;

export const AuthActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  height: 2.5rem;

  padding: 0 1.25rem;

  border: none;
  border-radius: 3.125rem;

  background-color: #fff;
  color: var(--orange);

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 600;

  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: var(--orange);
    color: #fff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const AuthButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AuthButton = styled.button`
  display: flex;
  width: 12.375rem;
  height: 3.25rem;
  padding: 0.75rem 2rem;

  box-sizing: border-box;
  justify-content: center;
  align-items: center;

  border: none;
  border-radius: 3.125rem;

  background-color: #fff;
  color: var(--orange);

  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.03125rem;

  margin-top: 2rem;
  margin-bottom: 2rem;

  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: var(--orange);
    color: #fff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const AuthCautionText = styled.p`
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 300;
  line-height: 140%;
  letter-spacing: -0.02188rem;

  color: var(--orange);
  margin-left: 2rem;
`;

export const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  width: min(45vw, 670px);
  height: min(45vw, 670px);
  aspect-ratio: 1 / 1;

  @media (max-width: ${breakpoints.laptop}) {
    width: min(50vw, 500px);
    height: min(50vw, 500px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: min(60vw, 400px);
    height: min(60vw, 400px);
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: min(75vw, 300px);
    height: min(75vw, 300px);
  }
`;

export const Circle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  border-radius: 50%;
  opacity: 0.7;

  background: linear-gradient(
    180deg,
    rgba(28, 7, 1, 0.87) 0%,
    rgba(0, 0, 0, 0) 47.5%,
    var(--orange) 100%
  );

  transform: rotate(-75deg);
`;

export const MainLogo = styled(mainlogo)`
  position: absolute;
  width: 80%;
  height: auto;
`;

export const TextOverlay = styled.h1`
  position: absolute;

  color: #fff;
  font-family: Montserrat;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -2.4%;

  font-size: clamp(2rem, 5vw, 6rem);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: clamp(1.5rem, 4vw, 3rem);
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 3.25rem;

  padding: 0.75rem 2rem;

  border-radius: 3.125rem;
  box-sizing: border-box;

  background-color: rgba(255, 255, 255, 0.19);

  border: 1px solid
    ${({ $isOpen }) =>
      $isOpen ? "#fff" : "rgba(255, 255, 255, 0.19)"};

  color: #fff;

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 400;

  cursor: pointer;
`;

const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;

  width: 100%;
  padding: 0.5rem 0;

  border-radius: 1.5rem;
  box-sizing: border-box;

  background-color: #63798a;
  border: 1px solid rgba(255, 255, 255, 0.4);

  overflow: hidden;
  z-index: 100;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;

  width: 100%;
  padding: 0.75rem 2rem;

  border: none;

  background-color: ${({ $selected }) =>
    $selected ? "rgba(255, 255, 255, 0.19)" : "transparent"};

  color: #fff;

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 400;

  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.19);
  }
`;

export function AuthDropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownButton
        type="button"
        $isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{value}</span>

        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          {options.map((option) => (
            <DropdownItem
              key={option}
              type="button"
              $selected={value === option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
}
