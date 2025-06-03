import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AdminDashboard from './pages/Admin/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/" render={() => <div>Welcome to TruYan</div>} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App

// Add to your existing imports
import LiveStream from './components/LiveStream';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Add this route to your existing routes
<Route path="/live" component={LiveStream} />
