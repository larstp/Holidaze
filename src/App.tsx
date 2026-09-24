import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import BecomeManager from './pages/BecomeManager/BecomeManager';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateVenue from './pages/CreateVenue/CreateVenue';
import EditProfile from './pages/EditProfile/EditProfile';
import EditVenue from './pages/EditVenue/EditVenue';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ManagerVenues from './pages/ManagerVenues/ManagerVenues';
import IncomingBookings from './pages/IncomingBookings/IncomingBookings';
import ManagerOverview from './pages/ManagerOverview/ManagerOverview';
import Register from './pages/Register/Register';
import Search from './pages/Search/Search';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Venue from './pages/Venue/Venue';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { NotFoundPage } from './components/PageStates/PageStates';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Navbar />
        <div className="routeContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/venues/:id" element={<Venue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manager/venues"
              element={
                <ProtectedRoute managerOnly>
                  <ManagerVenues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manager/bookings"
              element={
                <ProtectedRoute managerOnly>
                  <IncomingBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manager/overview"
              element={
                <ProtectedRoute managerOnly>
                  <ManagerOverview />
                </ProtectedRoute>
              }
            />
            <Route path="/become-manager" element={<BecomeManager />} />
            <Route
              path="/become-manager/upgrade"
              element={<BecomeManager upgradeOnly />}
            />
            <Route
              path="/venues/create"
              element={
                <ProtectedRoute managerOnly>
                  <CreateVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venues/:id/edit"
              element={
                <ProtectedRoute managerOnly>
                  <EditVenue />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
