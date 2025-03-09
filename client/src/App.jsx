import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LunchFormPage from "./pages/LunchFormPage";
import HomePage from "./pages/HomePage";
import LunchPage from "./pages/LunchPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/lunch" element={<LunchPage />} />
            <Route path="/add-lunch" element={<LunchFormPage />} />
            <Route path="/lunch/:id" element={<LunchFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
