import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  CardActions,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getAvailableReportsList, downloadReport } from "../API/APIService";
import moment from "moment";
import { useGlobalStore } from "../store/globalStore";
const currentMonth = moment().format('YYYY-MM');


const ExpenditureReports = () => {
  const theme = useTheme();
  const [expenditureReports, setExpenditureReports] = useState([]);
  const currencySymbol = useGlobalStore((state) => state.currencySymbol);
 const handleDownload = async (month) => {
    //const month = '2025-06';
    try {
      const response = await downloadReport(month);
      if (!response.ok) {
        throw new Error('Failed to download');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `monthly-report-${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Cleanup
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  useEffect(()=>{
    getAvailableReportsList(currentMonth)
    .then((res) => setExpenditureReports(res))
    .catch(error=> console.log(error)); 
  }, [])

  return (
    <Box sx={{ py: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
        📊 Expenditure Reports
      </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
        Download your monthly expenditure reports in PDF format
      </Typography>
      {expenditureReports.length ?(<Grid container spacing={4} mt={2}>
        {expenditureReports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report?.month}>
            <Card
              sx={{
                borderRadius:3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 1,
                backdropFilter: "blur(8px)",
                background: theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(30, 30, 30, 0.9)",
                transition: "all 0.3s ease",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  transform: "translateY(-4px)",
                },
              }}
              elevation={0}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {report?.month ? moment(report?.month).format('MMM YYYY'):''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {moment().subtract(1, 'months').endOf('month').format('DD/MM/YYYY')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Spent:</strong> {currencySymbol+report.totalSpend}
                  </Typography>
                </Stack>
              </CardContent>

              <Divider sx={{ my: 1 }} />

              <CardActions sx={{ px: 2, pb: 2, mt: "auto" }}>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  fullWidth
                  onClick={() =>handleDownload(report?.month)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                  }}
                >
                  Download PDF
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>):(
         <Typography variant="body1" color="text.secondary" mb={4}>
       <i>No Reports Avaialable. Reports are generated at end of every month</i>
      </Typography>
      )}
    </Box>
  );
};

export default ExpenditureReports;
