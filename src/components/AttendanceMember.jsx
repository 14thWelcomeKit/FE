import styled from "styled-components";
import breakpoints from "./breakpoints";
import { ATTENDANCE_STATUS_LABELS } from "./AttendanceStatusDropdown";

const Panel = styled.section`
  padding: 2rem;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.25rem;
  }
`;

const PanelTitle = styled.h2`
  margin: 0 0 1.25rem;
  color: #ffff;
  font-family: Pretendard;
  font-size: 1.5rem;
`;

const Button = styled.button`
  min-height: 3.25rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 3.125rem;
  background: #ffff;
  color: var(--orange);
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--orange);
    color: #ffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const MobileAttendanceButton = styled(Button)`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: block;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  color: #ffff;
  font-family: Pretendard;
`;

const MobileEmptyText = styled(EmptyText)`
  display: block;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const AttendanceInfo = styled.div`
  display: flex;
  padding: 1rem 0;
  flex-direction: column;
  gap: 0.9rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-family: Pretendard;
  font-size: 0.9rem;
`;

const InfoValue = styled.strong`
  color: #ffff;
  font-family: Pretendard;
  text-align: right;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid rgba(255, 96, 0, 0.45);
  border-radius: 3.125rem;
  background: rgba(255, 96, 0, 0.1);
  color: var(--orange);
  font-family: Pretendard;
  font-size: 0.9rem;
  font-weight: 600;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const HistoryItem = styled.div`
  display: flex;
  min-height: 3.75rem;
  padding: 0.75rem 1rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.9rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.86);
  color: var(--black);
  font-family: Pretendard;
`;

const HistoryDate = styled.strong`
  font-size: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #ffff;
  font-family: Pretendard;
`;

const PaginationButton = styled(Button)`
  min-height: 2.5rem;
  padding: 0.4rem 1rem;
`;

function getStatusLabel(status) {
  return ATTENDANCE_STATUS_LABELS[status] || status || "-";
}

export default function AttendanceMember({
  todayAttendance,
  myAttendance,
  pagination,
  onOpenScanModal,
  onPageChange,
  formatDate,
}) {
  const todayAttendanceInfo =
    Array.isArray(todayAttendance) && todayAttendance.length > 0
      ? todayAttendance[0]
      : null;

  return (
    <>
      <Panel>
        <PanelTitle>QR 출석</PanelTitle>
        <MobileAttendanceButton type="button" onClick={onOpenScanModal}>
          출석하기
        </MobileAttendanceButton>
        <MobileEmptyText>출석하기 버튼은 모바일 화면에서 표시됩니다.</MobileEmptyText>
      </Panel>

      <Panel>
        <PanelTitle>오늘 내 출석</PanelTitle>
        {todayAttendanceInfo ? (
          <AttendanceInfo>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{todayAttendanceInfo.name || "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>팀</InfoLabel>
              <InfoValue>{todayAttendanceInfo.teamName ?? "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>출석 상태</InfoLabel>
              <StatusBadge>
                {getStatusLabel(todayAttendanceInfo.attendanceStatus)}
              </StatusBadge>
            </InfoRow>
          </AttendanceInfo>
        ) : (
          <EmptyText>오늘 출석 세션이 없습니다.</EmptyText>
        )}
      </Panel>

      <Panel>
        <PanelTitle>내 전체 출석 내역</PanelTitle>
        {Array.isArray(myAttendance) && myAttendance.length > 0 ? (
          <HistoryList>
            {myAttendance.map((attendance, index) => (
              <HistoryItem key={`${attendance.date}-${index}`}>
                <HistoryDate>{formatDate(attendance.date)}</HistoryDate>
                <StatusBadge>
                  {getStatusLabel(attendance.attendanceStatus)}
                </StatusBadge>
              </HistoryItem>
            ))}
          </HistoryList>
        ) : (
          <EmptyText>출석 내역이 없습니다.</EmptyText>
        )}

        {pagination.totalPages > 1 && (
          <Pagination>
            <PaginationButton
              type="button"
              disabled={pagination.first || pagination.number === 0}
              onClick={() => onPageChange(pagination.number - 1)}
            >
              이전
            </PaginationButton>
            <span>
              {pagination.number + 1} / {pagination.totalPages}
            </span>
            <PaginationButton
              type="button"
              disabled={
                pagination.last ||
                pagination.number + 1 >= pagination.totalPages
              }
              onClick={() => onPageChange(pagination.number + 1)}
            >
              다음
            </PaginationButton>
          </Pagination>
        )}
      </Panel>
    </>
  );
}
