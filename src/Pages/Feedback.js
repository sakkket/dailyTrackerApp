import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  useTheme,
  Paper,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import TopFeedbackCarousel from "../components/ReviewCarousel";
import { createReview, checkReviewExists } from "../API/APIService";
import { toast } from "react-toastify";

export default function FeedbackForm() {
  const theme = useTheme();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
   e.preventDefault();
   createReview({rating: rating, review: feedback})
   .then((res) => {
    if(res){
        setSubmitted(true)
    }
   })
   .catch(error => toast.error("Failed to submit feedback"));
  };

   useEffect(() => {
    checkReviewExists()
    .then((res) => {
        if(res && res === true){
            setSubmitted(true);
        }
    })
   }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={theme.palette.background.default}
        p={1}
      >
        {!submitted ? (
          <Paper
            elevation={4}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 500,
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Help us grow with your feedback
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Your Feedback"
                multiline
                rows={4}
                fullWidth
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                margin="normal"
              />

              <Box display="flex" alignItems="center" mt={2} mb={3}>
                <Typography variant="subtitle1" mr={1}>
                  Rating:
                </Typography>
                <Rating
                  name="feedback-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "gold", // or use '#FFD700' for a richer yellow
                    },
                    "& .MuiRating-iconHover": {
                      color: "#FFC107",
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit Feedback
              </Button>
            </form>
          </Paper>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 4,
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <CheckCircleOutline
                color="success"
                sx={{ fontSize: 60, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Thank you!
              </Typography>
              <Typography variant="body1">
                Your feedback has been submitted successfully.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Box>
       <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={theme.palette.background.default}
        p={1}
      >
        <TopFeedbackCarousel />
      </Box>
    </>
  );
}
