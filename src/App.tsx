import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import Register from './pages/Register/Register';
import Search from './pages/Search/Search';
import Venue from './pages/Venue/Venue';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Navbar />
        <div className="routeContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/venues/:id" element={<Venue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfileSettings />} />
            <Route path="/dashboard/profile/edit" element={<EditProfile />} />
            <Route
              path="/dashboard/manager/venues"
              element={<ManagerVenues />}
            />
            <Route
              path="/dashboard/manager/bookings"
              element={<IncomingBookings />}
            />
            <Route path="/become-manager" element={<BecomeManager />} />
            <Route path="/venues/create" element={<CreateVenue />} />
            <Route path="/venues/:id/edit" element={<EditVenue />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
