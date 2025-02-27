import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Session, SessionStatus, Mentor, User } from "../../api/types";
import SessionCard from "./SessionCard";
import Loading from "../common/Loading";

interface SessionsListProps {
  sessions: Session[];
  isLoading: boolean;
  mentors?: Mentor[];
  users?: User[];
}

const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  isLoading,
  mentors = [],
  users = [],
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (statusFilter === "all") return true;
      return session.status === statusFilter;
    });
  }, [sessions, statusFilter]);

  const pendingSessions = useMemo(() => {
    return filteredSessions.filter(
      (session) => session.status === SessionStatus.PENDING,
    );
  }, [filteredSessions]);

  const activeSessions = useMemo(() => {
    return filteredSessions.filter(
      (session) => session.status === SessionStatus.ACCEPTED,
    );
  }, [filteredSessions]);

  const pastSessions = useMemo(() => {
    return filteredSessions.filter(
      (session) =>
        session.status === SessionStatus.COMPLETED ||
        session.status === SessionStatus.DECLINED,
    );
  }, [filteredSessions]);

  const getMentorName = (mentorId: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    return mentor && `${mentor.firstName} ${mentor.lastName}`;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id == userId);
    console.log(user, userId)
    return user && `${user.firstName} ${user.lastName}`;
  };

  const renderSessions = (sessionsList: Session[]) => {
    if (sessionsList.length === 0) {
      return (
        <Box sx={ { py: 4, textAlign: "center" } }>
          <Typography variant="body1" color="text.secondary">
            No sessions found.
          </Typography>
        </Box>
      );
    }

    return sessionsList.map((session) => (
      <SessionCard
        key={ session.id }
        session={ session }
        mentorName={ getMentorName(session.mentorId) }
        userName={ getUserName(session.userId) }
      />
    ));
  };

  if (isLoading && sessions.length === 0) {
    return <Loading message="Loading your sessions..." />;
  }

  return (
    <Box>
      <Box
        sx={ {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        } }
      >
        <Typography variant="h6" component="h2">
          Your Mentorship Sessions
        </Typography>

        <FormControl sx={ { width: 200 } }>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={ statusFilter }
            label="Filter by Status"
            onChange={ handleStatusFilterChange }
            size="small"
          >
            <MenuItem value="all">All Sessions</MenuItem>
            <MenuItem value={ SessionStatus.PENDING }>Pending</MenuItem>
            <MenuItem value={ SessionStatus.ACCEPTED }>Accepted</MenuItem>
            <MenuItem value={ SessionStatus.DECLINED }>Declined</MenuItem>
            <MenuItem value={ SessionStatus.COMPLETED }>Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs
        value={ activeTab }
        onChange={ handleTabChange }
        variant="fullWidth"
        sx={ { mb: 3 } }
      >
        <Tab
          label={ `Pending (${pendingSessions.length})` }
          id="sessions-tab-0"
          aria-controls="sessions-tabpanel-0"
        />
        <Tab
          label={ `Active (${activeSessions.length})` }
          id="sessions-tab-1"
          aria-controls="sessions-tabpanel-1"
        />
        <Tab
          label={ `Past (${pastSessions.length})` }
          id="sessions-tab-2"
          aria-controls="sessions-tabpanel-2"
        />
      </Tabs>

      <Box
        role="tabpanel"
        hidden={ activeTab !== 0 }
        id="sessions-tabpanel-0"
        aria-labelledby="sessions-tab-0"
      >
        { activeTab === 0 && renderSessions(pendingSessions) }
      </Box>

      <Box
        role="tabpanel"
        hidden={ activeTab !== 1 }
        id="sessions-tabpanel-1"
        aria-labelledby="sessions-tab-1"
      >
        { activeTab === 1 && renderSessions(activeSessions) }
      </Box>

      <Box
        role="tabpanel"
        hidden={ activeTab !== 2 }
        id="sessions-tabpanel-2"
        aria-labelledby="sessions-tab-2"
      >
        { activeTab === 2 && renderSessions(pastSessions) }
      </Box>
    </Box>
  );
};

export default SessionsList;
