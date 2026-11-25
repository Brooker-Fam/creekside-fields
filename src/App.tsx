import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LegacyRedirect from './components/LegacyRedirect'
import Home from './pages/Home'
import Shares from './pages/Shares'
import GeeseAndDucks from './pages/GeeseAndDucks'
import OurPigs from './pages/OurPigs'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin pages pull in the database client; load them only when visited.
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shares" element={<Shares />} />
          <Route path="/geese-and-ducks" element={<GeeseAndDucks />} />
          <Route path="/our-pigs" element={<OurPigs />} />
          <Route path="/contact" element={<Contact />} />

          {/* Retired pages and old reservation links. */}
          <Route path="/how-it-works" element={<LegacyRedirect to="/#how" />} />
          <Route path="/about" element={<LegacyRedirect to="/#how" />} />
          <Route path="/reserve/*" element={<LegacyRedirect to="/shares#share-options" />} />
          <Route path="/pig/:id" element={<LegacyRedirect to="/our-pigs" />} />
          <Route path="/animal/:id" element={<LegacyRedirect to="/our-pigs" />} />

          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
