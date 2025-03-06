import React, { useCallback } from "react";
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
import { Mentor } from "@/api/types";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
  mentor: Mentor;
  rating?: number; // Optional rating prop
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, rating }) => {
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(`/mentors/${mentor.id}`);
  }, [navigate, mentor.id]);

  // Generate a default profile picture if none is provided.
  const defaultProfilePicture = `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=random`;

  // Use the provided rating or generate a random one if not available.
  const displayRating = rating !== undefined ? rating : Math.floor(Math.random() * 2) + 2;

  return (
    <Card
      sx={ {
        height: "100%",
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      } }
    >
      <CardActionArea onClick={ handleCardClick } sx={ { flexGrow: 1 } }>
        <Box sx={ { position: "relative" } }>
          <CardMedia
            component="img"
            height="200"
            image={ mentor.profilePicture || defaultProfilePicture }
            alt={ `${mentor.firstName} ${mentor.lastName}` }
          />
          <Box
            sx={ {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": { opacity: 1 },
            } }
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { mentor.firstName } { mentor.lastName }
          </Typography>
          <Box sx={ { display: "flex", alignItems: "center", mb: 1 } }>
            <Rating value={ displayRating } precision={ 0.5 } readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={ { ml: 1 } }>
              { mentor.occupation }
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={ {
              mb: 2,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            } }
          >
            { mentor.bio }
          </Typography>
          <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
            <Chip
              key={ mentor.id }
              label={ mentor.expertise }
              size="small"
              color="primary"
              variant="outlined"
              sx={ { mt: 1 } }
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MentorCard;
