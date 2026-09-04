import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';

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
    <BrowserRouter>
      <Header />
      <Navbar />
      <div className="routeContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<PagePlaceholder title="Search" />} />
          <Route
            path="/venues/:id"
            element={<PagePlaceholder title="Venue details" />}
          />
          <Route path="/login" element={<PagePlaceholder title="Login" />} />
          <Route
            path="/register"
            element={<PagePlaceholder title="Register" />}
          />
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
  );
}

export default App;
