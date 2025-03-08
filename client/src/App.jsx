import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={<h1>tasks</h1>} />
        <Route path="/add-task" element={<h1>add Task</h1>} />
        <Route path="/task/:id" element={<h1>update task</h1>} />
        <Route path="/profile" element={<h1>profile</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
