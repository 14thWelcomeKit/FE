import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
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
    ${({ $isOpen }) => ($isOpen ? "#fff" : "rgba(255, 255, 255, 0.19)")};

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

  background-color: #63798a;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 1.5rem;

  box-sizing: border-box;
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

export default function Dropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
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