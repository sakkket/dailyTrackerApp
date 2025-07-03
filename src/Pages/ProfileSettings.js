import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { fetchUserData, updateUser } from '../API/APIService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function ProfileSettings({ onProfileChange }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword((prev) => !prev);

  const fetchUserDetails = async () => {
    const userDetails = await fetchUserData();
    if (userDetails) {
      setUser(userDetails);
      setFormData({ name: userDetails.name, phone: userDetails.phone });
    }
  }
  useEffect(() => {
    fetchUserDetails()
    .catch(error => console.log(error));
  }, []);

  const handleSave = async () => {
    const payload = { ...user, ...formData };
    if(payload && payload.password){
      if(payload.newPassword !== payload.confirmPassword || !payload.newPassword || !payload.confirmPassword){
        toast.error("New and Confirm password are not matching");
        return;
      }
    }
    delete payload['createdAt'];
    delete payload['__v'];
    delete payload['currencyCode'];
    delete payload['country'];
    try{
       const updatedUser = await updateUser(payload);
    if (updatedUser &&  !updatedUser.statusCode) {
      setUser({ name: updatedUser.name, phone: updatedUser.phone, id: updatedUser._id, email: updatedUser.email });
      onProfileChange({ name: updatedUser.name, phone: updatedUser.phone });
      setFormData({ name: updatedUser.name, phone: updatedUser.phone });
      toast.success("Updated Successfully!!");
      setEditMode(false);
    } else{
      toast.error(updatedUser.message);
      fetchUserDetails();
    }
    } catch(error){
    } finally {
    }
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', bgcolor: 'background.default' }}>
      <Typography variant="h6" mb={2}>Profile Settings</Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
          disabled={!editMode}
          sx={{
            input: {
              color: "text.primary",
              backgroundColor: "background.paper",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "divider",
              },
            },
          }}
        />
        <TextField
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          fullWidth
          disabled={!editMode}
          sx={{
            input: {
              color: "text.primary",
              backgroundColor: "background.paper",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "divider",
              },
            },
          }}
        />
        <TextField
          label="Email"
          value={user.email}
          fullWidth
          disabled
        />
        {showPasswordFields && (
          <>
            <TextField
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={!editMode}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                    disabled={!editMode}
                      onClick={handleToggle}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                input: {
                  color: "text.primary",
                  backgroundColor: "background.paper",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "divider",
                  },
                },
              }}
            />
            <TextField
              label="New Password"
             type={showPassword ? 'text' : 'password'}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              disabled={!editMode}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                    disabled={!editMode}
                      onClick={handleToggle}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                input: {
                  color: "text.primary",
                  backgroundColor: "background.paper",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "divider",
                  },
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={!editMode}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                    disabled={!editMode}
                      onClick={handleToggle}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                input: {
                  color: "text.primary",
                  backgroundColor: "background.paper",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "divider",
                  },
                },
              }}
            />
          </>
        )}
        <Box display="flex" justifyContent="space-between" mt={2}>
          {!editMode ? (
            <>
              <Button variant="contained" size='small' onClick={() => setEditMode(true)}>Edit</Button>
              <Button variant="outlined" size='small' onClick={() => setShowPasswordFields(!showPasswordFields)}>
                {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
              <Button variant="outlined" color="error" onClick={() => {
                setEditMode(false);
                setFormData({ name: user.name, phone: user.phone });
              }}>Cancel</Button>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
