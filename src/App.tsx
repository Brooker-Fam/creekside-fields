import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AnimalPage from './pages/Animal'
import Reserve from './pages/Reserve'
import ReserveConfirm from './pages/ReserveConfirm'
import About from './pages/About'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pig/:id" element={<AnimalPage />} />
          <Route path="/animal/:id" element={<AnimalPage />} />
          <Route path="/reserve/:shareId" element={<Reserve />} />
          <Route path="/reserve/:shareId/confirmed" element={<ReserveConfirm />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
