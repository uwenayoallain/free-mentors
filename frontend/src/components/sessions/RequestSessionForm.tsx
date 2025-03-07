import React from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createSession } from "@/store/sessionsSlice";

const sessionSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  questions: z
    .string()
    .min(
      20,
      "Please provide a more detailed description of your questions (at least 20 characters)",
    ),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

interface RequestSessionFormProps {
  mentorId: string;
  onSuccess?: () => void;
}

const RequestSessionForm: React.FC<RequestSessionFormProps> = ({
  mentorId,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.sessions);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      topic: "",
      questions: "",
    },
  });

  const onSubmit = async (data: SessionFormValues) => {
    try {
      await dispatch(
        createSession({
          mentorId,
          topic: data.topic,
          questions: data.questions,
        }),
      ).unwrap();

      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  return (
    <Box component="form" onSubmit={ handleSubmit(onSubmit) } noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Session Topic"
        placeholder="e.g., Career Guidance in Web Development"
        autoFocus
        { ...register("topic") }
        error={ !!errors.topic }
        helperText={ errors.topic?.message }
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="description"
        label="Questions"
        placeholder="Describe what you'd like to discuss in this mentorship session"
        multiline
        minRows={ 4 }
        { ...register("questions") }
        error={ !!errors.questions }
        helperText={ errors.questions?.message }
      />


      <FormHelperText>
        Your session request will be sent to the mentor, who can accept or
        decline.
      </FormHelperText>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={ isLoading }
        sx={ { mt: 3 } }
      >
        { isLoading ? <CircularProgress size={ 24 } /> : "Request Session" }
      </Button>
    </Box>
  );
};

export default RequestSessionForm;
