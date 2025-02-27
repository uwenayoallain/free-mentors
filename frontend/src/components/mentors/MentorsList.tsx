import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Pagination,
  Stack,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import MentorCard from "./MentorCard";
import Loading from "../common/Loading";
import { Mentor } from "../../api/types";

const MENTORS_PER_PAGE = 6;

const MentorsList: React.FC = () => {
  const { mentors, isLoading } = useSelector(
    (state: RootState) => state.mentors,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [expertise, setExpertise] = useState("all");
  const [page, setPage] = useState(1);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleExpertiseChange = (event: SelectChangeEvent) => {
    setExpertise(event.target.value);
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const availableExpertise = useMemo(() => {
    const skillsSet = new Set<string>();
    mentors.forEach((mentor) => {
      mentor.expertise.forEach((skill) => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        searchTerm === "" ||
        `${mentor.firstName} ${mentor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesExpertise =
        expertise === "all" || mentor.expertise.includes(expertise);

      return matchesSearch && matchesExpertise;
    });
  }, [mentors, searchTerm, expertise]);

  const paginatedMentors = useMemo(() => {
    const startIndex = (page - 1) * MENTORS_PER_PAGE;
    return filteredMentors.slice(startIndex, startIndex + MENTORS_PER_PAGE);
  }, [filteredMentors, page]);

  const pageCount = Math.ceil(filteredMentors.length / MENTORS_PER_PAGE);

  if (isLoading) {
    return <Loading message="Loading mentors..." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name or expertise..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="expertise-filter-label">
                Filter by Expertise
              </InputLabel>
              <Select
                labelId="expertise-filter-label"
                id="expertise-filter"
                value={expertise}
                label="Filter by Expertise"
                onChange={handleExpertiseChange}
              >
                <MenuItem value="all">All Expertise</MenuItem>
                {availableExpertise.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredMentors.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No mentors found matching your criteria.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {paginatedMentors.length} of {filteredMentors.length}{" "}
            mentors
          </Typography>

          <Grid container spacing={3}>
            {paginatedMentors.map((mentor) => (
              <Grid item key={mentor.id} xs={12} sm={6} md={4}>
                <MentorCard mentor={mentor} />
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default MentorsList;
