// src/components/ErrorBoundary.js

import React from 'react';
import { Typography, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h4" color="error">发生错误。</Typography>
          <Typography variant="body1">请稍后再试。</Typography>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
