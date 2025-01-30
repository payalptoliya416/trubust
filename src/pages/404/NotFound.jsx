import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container 
      maxWidth="sm" 
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
    >
      <Box textAlign="center">
        <Typography variant="h1" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/" 
          size="large"
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
}
