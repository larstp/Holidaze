import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Search from './pages/Search/Search';
import Venue from './pages/Venue/Venue';

type PageProps = {
  title: string;
};

function PagePlaceholder({ title }: PageProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}

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
            <Route path="/login" element={<PagePlaceholder title="Login" />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<PagePlaceholder title="Dashboard" />}
            />
            <Route
              path="/become-manager"
              element={<PagePlaceholder title="Become a manager" />}
            />
            <Route
              path="/venues/create"
              element={<PagePlaceholder title="Create venue" />}
            />
            <Route
              path="/venues/:id/edit"
              element={<PagePlaceholder title="Edit venue" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
