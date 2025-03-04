import './App.css'
import Navbar from './components/Navbar/Navbar.tsx'
import Home from './pages/Home/Home.tsx'
import Welcome from './pages/Welcome/Welcome.tsx'
import Verify from './pages/Verify/Verify.tsx'
import Connect from './pages/Connect/Connect.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Studies from './pages/Studies/Studies.tsx'
import Scans from './pages/Scans/Scans.tsx'

import { AuthProvider } from './contexts/auth-context.tsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/' element={<Navbar />}>
            <Route path='welcome' element={<Welcome />} />
            <Route path='connect' element={<Connect />} />
            <Route path='verify/:studyId' element={<Verify />} />
            <Route path='Studies' element={<Studies />} />
            <Route path='scans/:studyId' element={<Scans />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App