import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";

import { LunchProvider } from "./context/LunchContext";
import NavBar from "./components/NavBar";

const ProfilePage = import("./pages/ProfilePage");
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LunchFormPage = lazy(() => import("./pages/LunchFormPage"));
const LunchPage = lazy(() => import("./pages/LunchPage"));
const ListDay = lazy(() => import("./pages/ListDay"));
const CreateNewMenu = lazy(() => import("./pages/CreateMenu"));
const AdminLunchPage = lazy(() => import("./pages/AdminLunchPage"));

function App() {
  return (
    <AuthProvider>
      <LunchProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/lunch" element={<LunchPage />} />
              <Route path="/lunch/new" element={<LunchFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminLunchPage />} />
              <Route path="/admin/listDay" element={<ListDay />} />
              <Route path="/admin/create/menu" element={<CreateNewMenu />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LunchProvider>
    </AuthProvider>
  );
}

export default App;
