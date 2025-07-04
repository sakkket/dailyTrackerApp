import React from "react";
import { Box, Typography, Paper, Rating, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { getAllReview } from "../API/APIService";

// const feedbacks = [
//   { id: 1, name: 'Alice', rating: 5, comment: 'Absolutely love this app!' },
//   { id: 2, name: 'Bob', rating: 4, comment: 'Very helpful and easy to use.' },
//   { id: 3, name: 'Charlie', rating: 5, comment: 'Beautiful UI and insightful graphs.' },
// ];

export default function TopFeedbackCarousel() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [current, setCurrent] = React.useState({});

  React.useEffect(() => {
    let timer;
    getAllReview().then((review) => {
        setCurrent(review[0]);
            timer = setInterval(() => {
            const randomNumber = Math.floor(Math.random() * review.length);
             setCurrent(review[randomNumber]);
        }, 4000);
        return () => clearInterval(timer);
    });
     return () => {
    if (timer) clearInterval(timer);
  };
  }, []);


  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        🌟 What our users are saying
      </Typography>

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
    </Box>
  );
}
