import './App.css'
import { Typography } from '@mui/material'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Typography variant="h4" component="h1" >
        Welcome to Looksy
      </Typography>
      <Typography>
        Your main content goes here
      </Typography>
    </Layout>
  )
}

export default App