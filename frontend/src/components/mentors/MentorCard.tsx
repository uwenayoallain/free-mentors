import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Stack,
} from "@mui/material";
import { Mentor } from "../../api/types";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mentors/${mentor.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="200"
          image={
            mentor.profilePicture || `https://i.pravatar.cc/300?u=${mentor.id}`
          }
          alt={`${mentor.firstName} ${mentor.lastName}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {mentor.firstName} {mentor.lastName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating
              value={mentor.rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({mentor.totalReviews})
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {mentor.yearsOfExperience}{" "}
            {mentor.yearsOfExperience === 1 ? "year" : "years"} of experience
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {mentor.bio}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            ))}
            {mentor.expertise.length > 3 && (
              <Chip
                label={`+${mentor.expertise.length - 3}`}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MentorCard;
