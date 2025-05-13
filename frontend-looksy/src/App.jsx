import './App.css'
import Layout from './components/Layout'
import HomeView from './views/HomeView'
import RingsView from './views/RingsViews'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/rings" element={<RingsView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App