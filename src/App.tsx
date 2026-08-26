import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

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
      <Routes>
        <Route path="/" element={<PagePlaceholder title="Home" />} />
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
    </BrowserRouter>
  );
}

export default App;
