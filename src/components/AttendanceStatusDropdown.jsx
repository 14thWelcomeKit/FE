import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

export const ATTENDANCE_STATUS_LABELS = {
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
};

const StatusDropdownWrapper = styled.div`
  position: relative;
  min-width: 6.5rem;
  font-family: Pretendard;
`;

const StatusDropdownButton = styled.button`
  position: relative;
  width: 100%;
  min-height: 2.35rem;
  padding: 0.55rem 2rem 0.55rem 0.8rem;
  border: 1px solid var(--orange);
  border-radius: 3.125rem;
  background: rgba(255, 255, 255, 0.82);
  color: var(--black);
  font-family: Pretendard;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #ffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 96, 0, 0.3);
    outline-offset: 2px;
  }
`;

const StatusDropdownIcon = styled(IoIosArrowDown)`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%)
    rotate(${(props) => (props.$isOpen ? "180deg" : "0deg")});
  transition: transform 0.15s ease;
`;

const StatusDropdownList = styled.div`
  position: fixed;
  z-index: 1200;
  display: flex;
  padding: 0.3rem;
  flex-direction: column;
  gap: 0.15rem;
  border: 1px solid rgba(255, 96, 0, 0.45);
  border-radius: 1rem;
  box-sizing: border-box;
  background: #ffff;
`;

const StatusDropdownOption = styled.button`
  width: 100%;
  padding: 0.45rem;
  border: none;
  border-radius: 0.75rem;
  background: ${(props) =>
    props.$selected ? "rgba(255, 96, 0, 0.12)" : "transparent"};
  color: var(--black);
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$selected ? 600 : 400)};
  text-align: center;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: rgba(255, 96, 0, 0.12);
    outline: none;
  }
`;

export default function AttendanceStatusDropdown({
  attendanceId,
  value,
  onChange,
  disabled,
  ariaLabel,
  isOpen,
  onToggle,
  onClose,
}) {
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);
  const [listPosition, setListPosition] = useState(null);
  const options = Object.entries(ATTENDANCE_STATUS_LABELS);
  const listId = `attendance-status-${attendanceId}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !listRef.current?.contains(event.target)
      ) {
        onClose();
      }
    };

    if (!isOpen) return undefined;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (disabled && isOpen) onClose();
  }, [disabled, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return undefined;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const estimatedListHeight = 132;
    const openUpward =
      window.innerHeight - buttonRect.bottom < estimatedListHeight &&
      buttonRect.top > estimatedListHeight;

    setListPosition({
      left: buttonRect.left,
      top: openUpward ? buttonRect.top - 6 : buttonRect.bottom + 6,
      width: buttonRect.width,
      transform: openUpward ? "translateY(-100%)" : "none",
    });

    const handleViewportChange = () => onClose();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, onClose]);

  const focusOption = (index) => {
    optionRefs.current[index]?.focus();
  };

  const openAndFocusSelected = () => {
    onToggle(true);
    const selectedIndex = Math.max(
      options.findIndex(([optionValue]) => optionValue === value),
      0
    );
    requestAnimationFrame(() => focusOption(selectedIndex));
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocusSelected();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption((index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption((index - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusOption(options.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      buttonRef.current?.focus();
    }
  };

  const handleSelect = (optionValue) => {
    onClose();
    buttonRef.current?.focus();
    if (optionValue !== value) onChange(optionValue);
  };

  return (
    <StatusDropdownWrapper
      ref={dropdownRef}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          !listRef.current?.contains(event.relatedTarget)
        ) {
          onClose();
        }
      }}
    >
      <StatusDropdownButton
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => onToggle(!isOpen)}
        onKeyDown={handleButtonKeyDown}
      >
        {ATTENDANCE_STATUS_LABELS[value] || value || "-"}
        <StatusDropdownIcon aria-hidden="true" $isOpen={isOpen} />
      </StatusDropdownButton>

      {isOpen &&
        listPosition &&
        createPortal(
          <StatusDropdownList
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            style={listPosition}
          >
            {options.map(([optionValue, label], index) => (
              <StatusDropdownOption
                key={optionValue}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={value === optionValue}
                $selected={value === optionValue}
                onClick={() => handleSelect(optionValue)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                {label}
              </StatusDropdownOption>
            ))}
          </StatusDropdownList>,
          document.body
        )}
    </StatusDropdownWrapper>
  );
}
