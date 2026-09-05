import styled from "styled-components";
import { FiRefreshCw } from "react-icons/fi";
import breakpoints from "./breakpoints";
import AttendanceStatusDropdown from "./AttendanceStatusDropdown";

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

const PanelTitleRow = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const SessionPanelTitle = styled(PanelTitle)`
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  color: #ffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--orange);
    background: rgba(255, 96, 0, 0.18);
    color: var(--orange);
  }

  &:focus-visible {
    outline: 2px solid var(--orange);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const RefreshIcon = styled(FiRefreshCw)`
  width: 1.25rem;
  height: 1.25rem;
`;

const SelectedSessionDate = styled.p`
  margin: -0.75rem 0 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: Pretendard;
  font-size: 1rem;
  line-height: 140%;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
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

const DateInput = styled.input`
  min-height: 3.25rem;
  padding: 0.65rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3.125rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  color: #ffff;
  color-scheme: dark;
  font-family: Pretendard;
`;

const SessionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 19.5rem);
  justify-content: start;
  gap: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const SessionCard = styled.div`
  width: 19.5rem;
  min-height: 10rem;
  padding: 1.25rem;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--orange)" : "transparent")};
  border-radius: 1rem;
  box-sizing: border-box;
  background: ${(props) =>
    props.$selected
      ? "rgba(255, 244, 237, 0.96)"
      : "rgba(255, 255, 255, 0.9)"};
  box-shadow: ${(props) =>
    props.$selected ? "0 0 0 3px rgba(255, 96, 0, 0.18)" : "none"};
  color: var(--black);
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${(props) =>
      props.$selected ? "var(--orange)" : "rgba(255, 96, 0, 0.55)"};
  }

  &:focus-visible {
    outline: 2px solid var(--orange);
    outline-offset: 3px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
  }
`;

const SessionDate = styled.strong`
  display: block;
  margin-bottom: 0.75rem;
  font-family: Pretendard;
  font-size: 1.05rem;
`;

const CountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-family: Pretendard;
  font-size: 0.9rem;
`;

const DeleteButton = styled(Button)`
  min-height: 2.5rem;
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  background: #721c24;
  color: #ffff;
  font-size: 0.875rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 1rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 48rem;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.86);
  color: var(--black);
  font-family: Pretendard;

  th,
  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(28, 28, 28, 0.1);
    text-align: center;
  }

  th {
    background: rgba(255, 96, 0, 0.1);
    color: #50372d;
    font-size: 0.95rem;
    font-weight: 600;
  }

  tbody tr {
    transition: background-color 0.15s ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.48);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  color: #ffff;
  font-family: Pretendard;
`;

export default function AttendanceAdmin({
  sessions,
  selectedSessionId,
  selectedSession,
  sessionDetails,
  sessionDate,
  isDetailsLoading,
  isRefreshing,
  openDropdownId,
  updatingAttendanceIds,
  onSessionDateChange,
  onCreateSession,
  onDeleteSession,
  onSessionSelect,
  onStatusChange,
  onDropdownToggle,
  onDropdownClose,
  onOpenQrModal,
  onRefreshAttendance,
  formatDateTime,
}) {
  return (
    <>
      <Panel>
        <PanelTitle>출석 운영</PanelTitle>
        <ActionRow as="form" onSubmit={onCreateSession}>
          <DateInput
            type="datetime-local"
            value={sessionDate}
            onChange={onSessionDateChange}
            aria-label="출석 세션 날짜와 시간"
          />
          <Button type="submit">세션 생성</Button>
          <Button type="button" onClick={onOpenQrModal}>
            QR 생성
          </Button>
        </ActionRow>
      </Panel>

      <Panel>
        <PanelTitleRow>
          <SessionPanelTitle>전체 출석 세션</SessionPanelTitle>
          <RefreshButton
            type="button"
            onClick={onRefreshAttendance}
            disabled={isRefreshing}
            aria-label="출석 정보 새로고침"
            title="출석 정보 새로고침"
          >
            <RefreshIcon />
          </RefreshButton>
        </PanelTitleRow>

        {sessions.length > 0 ? (
          <SessionGrid>
            {sessions.map((session) => (
              <SessionCard
                key={session.sessionId}
                role="button"
                tabIndex={0}
                $selected={selectedSessionId === session.sessionId}
                aria-pressed={selectedSessionId === session.sessionId}
                onClick={() => onSessionSelect(session.sessionId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSessionSelect(session.sessionId);
                  }
                }}
              >
                <SessionDate>{formatDateTime(session.sessionDate)}</SessionDate>
                <CountGrid>
                  <span>전체 {session.totalCount}</span>
                  <span>출석 {session.presentCount}</span>
                  <span>지각 {session.lateCount}</span>
                  <span>결석 {session.absentCount}</span>
                </CountGrid>
                <DeleteButton
                  type="button"
                  onClick={(event) =>
                    onDeleteSession(event, session.sessionId)
                  }
                >
                  세션 삭제
                </DeleteButton>
              </SessionCard>
            ))}
          </SessionGrid>
        ) : (
          <EmptyText>등록된 출석 세션이 없습니다.</EmptyText>
        )}
      </Panel>

      {selectedSessionId != null && (
        <Panel>
          <PanelTitle>세션별 출석 상세</PanelTitle>
          {selectedSession && (
            <SelectedSessionDate>
              {formatDateTime(selectedSession.sessionDate)}
            </SelectedSessionDate>
          )}
          {isDetailsLoading ? (
            <EmptyText>상세 정보를 불러오는 중입니다.</EmptyText>
          ) : sessionDetails.length > 0 ? (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>학번</th>
                    <th>팀</th>
                    <th>출석 상태</th>
                    <th>출석 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionDetails.map((attendance) => (
                    <tr key={attendance.attendanceId}>
                      <td>{attendance.name}</td>
                      <td>{attendance.studentNum}</td>
                      <td>{attendance.teamName ?? "-"}</td>
                      <td>
                        <AttendanceStatusDropdown
                          attendanceId={attendance.attendanceId}
                          value={attendance.status}
                          onChange={(status) =>
                            onStatusChange(attendance.attendanceId, status)
                          }
                          disabled={updatingAttendanceIds.has(
                            attendance.attendanceId
                          )}
                          ariaLabel={`${attendance.name} 출석 상태`}
                          isOpen={
                            openDropdownId === attendance.attendanceId
                          }
                          onToggle={(shouldOpen) =>
                            onDropdownToggle(
                              shouldOpen ? attendance.attendanceId : null
                            )
                          }
                          onClose={() =>
                            onDropdownClose(attendance.attendanceId)
                          }
                        />
                      </td>
                      <td>{formatDateTime(attendance.attendanceTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          ) : (
            <EmptyText>이 세션의 출석 정보가 없습니다.</EmptyText>
          )}
        </Panel>
      )}
    </>
  );
}
