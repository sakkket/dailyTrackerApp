import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { fetchUserData } from '../API/APIService';

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const fetchUserDetails = async () => {
     const userDetails = await fetchUserData();
     if(userDetails){
        setUser(userDetails);
      setFormData({ name: userDetails.name, phone: userDetails.phone });
     }
  }
  useEffect(() => {
    // Simulate API call to fetch user data
    fetchUserDetails()
//    const fetchedUser = {
//         name: 'Saket Kumar',
//         phone: '9876543210',
//         email: 'saket@example.com',
//       };
//       setUser(fetchedUser);
//       setFormData({ name: fetchedUser.name, phone: fetchedUser.phone });
  }, []);

  const handleSave = () => {
    // Simulate API call to save updated info
    console.log('Saving:', formData);
    setUser({ ...user, ...formData });
    setEditMode(false);
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
        />
        <TextField
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          fullWidth
          disabled={!editMode}
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
              type="password"
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
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
