import React from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createSession } from "@/store/sessionsSlice";
import { addDays } from "date-fns";

const sessionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(
      20,
      "Please provide a more detailed description (at least 20 characters)",
    ),
  scheduledDate: z.date().optional(),
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
    control,
    formState: { errors },
    reset,
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledDate: undefined,
    },
  });

  const onSubmit = async (data: SessionFormValues) => {
    try {
      await dispatch(
        createSession({
          mentorId,
          title: data.title,
          description: data.description,
          scheduledDate: data.scheduledDate?.toISOString(),
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
        label="Session Title"
        placeholder="e.g., Career Guidance in Web Development"
        autoFocus
        { ...register("title") }
        error={ !!errors.title }
        helperText={ errors.title?.message }
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="description"
        label="Description"
        placeholder="Describe what you'd like to discuss in this mentorship session"
        multiline
        minRows={ 4 }
        { ...register("description") }
        error={ !!errors.description }
        helperText={ errors.description?.message }
      />

      <Box sx={ { mt: 2 } }>
        <Controller
          name="scheduledDate"
          control={ control }
          render={ ({ field }) => (
            <DatePicker
              label="Preferred Date (Optional)"
              value={ field.value }
              onChange={ (newValue) => field.onChange(newValue) }
              minDate={ addDays(new Date(), 1) }
              maxDate={ addDays(new Date(), 30) }
              slotProps={ {
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  helperText:
                    "You can select a preferred date or leave it blank",
                },
              } }
            />
          ) }
        />
      </Box>

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
