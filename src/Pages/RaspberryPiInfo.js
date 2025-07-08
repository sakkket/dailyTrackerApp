import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  useTheme,
} from "@mui/material";
import { getSystemInfo } from "../API/APIService";

const RaspberryPiInfo = () => {
  const theme = useTheme();

  const [hostname, setHostname] = useState("");
  const [platform, setPlatform] = useState("");
  const [architecture, setarchitecture] = useState("");
  const [cpuTemperature, setcpuTemperature] = useState('');
  const [cpuUsage, setcpuUsage] = useState([]);
  const [memory, setmemory] = useState({});

  useEffect(()=> {
    getSystemInfo()
    .then((info) => {
        if(info && info.hostname){
            setHostname(info.hostname);
        }
        if(info && info.platform){
            setPlatform(info.platform);
        }
        if(info && info.architecture){
            setarchitecture(info.architecture);
        }
        if(info && info.cpuTemperature){
            setcpuTemperature(info.cpuTemperature);
        }
        if(info && info.cpuUsage){
            setcpuUsage(info.cpuUsage);
        }
        if(info && info.memory){
            setmemory(info.memory);
        }
    })
    .catch((error)=> console.log(error));
  },[])


  return (
    <Box sx={{ p: 4, bgcolor: "background.default", color: "text.primary" }}>
      <Typography variant="h4" gutterBottom align="center">
        Raspberry Pi
      </Typography>

      <Card sx={{ maxWidth: 600, mx: "auto", p: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}><strong>Hostname:</strong></Grid>
            <Grid item xs={6}>{hostname}</Grid>

            <Grid item xs={6}><strong>Platform:</strong></Grid>
            <Grid item xs={6}>{platform}</Grid>

            <Grid item xs={6}><strong>Architecture:</strong></Grid>
            <Grid item xs={6}>{architecture}</Grid>

            <Grid item xs={6}><strong>CPU Temperature:</strong></Grid>
            <Grid item xs={6}>{cpuTemperature}°C</Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              CPU Usage
            </Typography>
            {cpuUsage?.map((usage, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2">Core {index}: {usage?.toFixed(1)}%</Typography>
                <LinearProgress variant="determinate" value={usage} />
              </Box>
            ))}
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Memory Usage
            </Typography>
            <Typography variant="body2">
              Used: {memory?.used?.toFixed(2)} GB / {memory?.total?.toFixed(2)} GB
            </Typography>
            <LinearProgress variant="determinate" value={(memory?.used / memory?.total) * 100} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RaspberryPiInfo;
