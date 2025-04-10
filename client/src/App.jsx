import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LunchFormPage from "./pages/LunchFormPage";
import HomePage from "./pages/HomePage";
import LunchPage from "./pages/LunchPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import { LunchProvider } from "./context/LunchContext";
import NavBar from "./components/NavBar";
import AdminLunchPage from "./pages/AdminLunchPage";
import ListDay from "./pages/ListDay";

function App() {
  return (
    <AuthProvider>
      <LunchProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/lunch" element={<LunchPage />} />
              <Route path="/lunch/new" element={<LunchFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminLunchPage />} />
              <Route path="/admin/listDay" element={<ListDay />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LunchProvider>
    </AuthProvider>
  );
}

export default App;
