import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Rating,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Session, SessionStatus, UserRole } from "../../api/types";
import { updateSessionStatus, createReview } from "../../store/sessionsSlice";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface SessionCardProps {
  session: Session;
  mentorName?: string;
  userName?: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(10, "Please provide at least 10 characters of feedback"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  mentorName,
  userName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.sessions);
  const { user } = useSelector((state: RootState) => state.auth);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(
    null,
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleOpenConfirmDialog = (type: "accept" | "decline") => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setActionType(null);
  };

  const handleUpdateStatus = async () => {
    if (!actionType) return;

    const status =
      actionType === "accept" ? SessionStatus.ACCEPTED : SessionStatus.DECLINED;

    try {
      await dispatch(
        updateSessionStatus({
          sessionId: session.id,
          status,
        }),
      ).unwrap();
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Failed to update session status", error);
    }
  };

  const handleOpenReviewDialog = () => {
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    reset();
  };

  const handleSubmitReview = async (data: ReviewFormValues) => {
    try {
      await dispatch(
        createReview({
          sessionId: session.id,
          rating: data.rating,
          comment: data.comment,
        }),
      ).unwrap();
      handleCloseReviewDialog();
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  const getStatusChipProps = () => {
    switch (session.status) {
      case SessionStatus.PENDING:
        return {
          label: "Pending",
          color: "warning" as const,
        };
      case SessionStatus.ACCEPTED:
        return {
          label: "Accepted",
          color: "success" as const,
        };
      case SessionStatus.DECLINED:
        return {
          label: "Declined",
          color: "error" as const,
        };
      case SessionStatus.COMPLETED:
        return {
          label: "Completed",
          color: "info" as const,
        };
      default:
        return {
          label: "Unknown",
          color: "default" as const,
        };
    }
  };

  const isMentor = user?.role === UserRole.MENTOR;
  const canTakeAction = isMentor && session.status === SessionStatus.PENDING;
  const canReview = !isMentor && session.status === SessionStatus.COMPLETED;

  return (
    <Card variant="outlined" sx={ { mb: 2 } }>
      <CardContent>
        <Box
          sx={ {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          } }
        >
          <Typography variant="h6" component="div">
            { session.title }
          </Typography>
          <Chip
            label={ getStatusChipProps().label }
            color={ getStatusChipProps().color }
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          { session.description }
        </Typography>

        { session.scheduledDate && (
          <Box sx={ { display: "flex", alignItems: "center", mb: 2 } }>
            <CalendarIcon
              fontSize="small"
              sx={ { mr: 1, color: "text.secondary" } }
            />
            <Typography variant="body2" color="text.secondary">
              Scheduled for:{ " " }
              { new Date(session.scheduledDate).toLocaleDateString() }
            </Typography>
          </Box>
        ) }

        <Box
          sx={ {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          } }
        >
          <Typography variant="body2" color="text.secondary">
            { isMentor
              ? `Requested by: ${userName || "User"}`
              : `Mentor: ${mentorName || "Mentor"}` }
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Created: { new Date(session.createdAt).toLocaleDateString() }
          </Typography>
        </Box>

        { canTakeAction && (
          <>
            <Divider sx={ { my: 2 } } />
            <Box sx={ { display: "flex", justifyContent: "flex-end", gap: 1 } }>
              <Button
                variant="outlined"
                color="error"
                startIcon={ <CloseIcon /> }
                onClick={ () => handleOpenConfirmDialog("decline") }
              >
                Decline
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={ <CheckIcon /> }
                onClick={ () => handleOpenConfirmDialog("accept") }
              >
                Accept
              </Button>
            </Box>
          </>
        ) }

        { canReview && (
          <>
            <Divider sx={ { my: 2 } } />
            <Box sx={ { display: "flex", justifyContent: "flex-end" } }>
              <Button
                variant="contained"
                color="primary"
                startIcon={ <StarIcon /> }
                onClick={ handleOpenReviewDialog }
              >
                Leave Review
              </Button>
            </Box>
          </>
        ) }
      </CardContent>

      {/* Confirmation Dialog */ }
      <Dialog open={ confirmDialogOpen } onClose={ handleCloseConfirmDialog }>
        <DialogTitle>
          { actionType === "accept"
            ? "Accept Mentorship Session?"
            : "Decline Mentorship Session?" }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            { actionType === "accept"
              ? "By accepting this session, you agree to provide mentorship to this mentee. Are you sure you want to proceed?"
              : "Are you sure you want to decline this mentorship session? This action cannot be undone." }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCloseConfirmDialog }>Cancel</Button>
          <Button
            onClick={ handleUpdateStatus }
            color={ actionType === "accept" ? "success" : "error" }
            variant="contained"
            disabled={ isLoading }
          >
            { isLoading ? (
              <CircularProgress size={ 24 } />
            ) : actionType === "accept" ? (
              "Accept"
            ) : (
              "Decline"
            ) }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */ }
      <Dialog
        open={ reviewDialogOpen }
        onClose={ handleCloseReviewDialog }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Review Your Mentorship Session</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={ handleSubmit(handleSubmitReview) }
            noValidate
          >
            <Typography variant="subtitle1" gutterBottom>
              How would you rate your session with { mentorName }?
            </Typography>

            <Box sx={ { mb: 3, mt: 1 } }>
              <Controller
                name="rating"
                control={ control }
                render={ ({ field }) => (
                  <Rating
                    { ...field }
                    precision={ 0.5 }
                    size="large"
                    onChange={ (_, value) => {
                      field.onChange(value);
                    } }
                  />
                ) }
              />
              { errors.rating && (
                <FormHelperText error>{ errors.rating.message }</FormHelperText>
              ) }
            </Box>

            <TextField
              label="Your Feedback"
              fullWidth
              multiline
              minRows={ 4 }
              placeholder="Share your experience with this mentor..."
              { ...register("comment") }
              error={ !!errors.comment }
              helperText={ errors.comment?.message }
              sx={ { mb: 2 } }
            />

            <DialogActions>
              <Button onClick={ handleCloseReviewDialog }>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={ isLoading }
              >
                { isLoading ? <CircularProgress size={ 24 } /> : "Submit Review" }
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SessionCard;
