import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Joan',
      'serif'
    ].join(','),
    h6: {
      fontWeight: 400
    },
    body1: {
      fontFamily: 'Joan, serif'
    }
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1.4rem',
          fontWeight: 500,
          color: '#673430'
        }
      }
    }
  }
});