import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Rating,
  useTheme,
  IconButton,
  Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { getAllReview } from "../API/APIService";

export default function TopFeedbackCarousel() {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getAllReview().then((res) => {
      setReviews(res || []);
      const randomNumber = Math.floor(Math.random() * res.length);
      setIndex(randomNumber);
    });
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleDotClick = (i) => {
    setIndex(i);
  };

  const current = reviews[index];

  return (
    <Box mt={4} textAlign="center">
      <Typography variant="h6" gutterBottom>
       🌟 What our users are saying
      </Typography>

      {current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 2,
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {current?.name}
              </Typography>
              <Rating
                value={current?.rating}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": { color: "gold" },
                }}
              />
              <Typography variant="body2" mt={1}>
                {current?.review}
              </Typography>
            </Paper>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation Buttons */}
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={2}>
        <IconButton onClick={handlePrev}>
          <ArrowBackIos />
        </IconButton>
         <Typography variant="body2">
          {index + 1} of {reviews.length}
        </Typography>
        <IconButton onClick={handleNext}>
          <ArrowForwardIos />
        </IconButton>
      </Stack>
    </Box>
  );
}
