import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import Menu from "./icos/Menu";
import Logo from "./icos/logo";

function NavBar() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  console.log(user);
  return (
    <nav>
      {/* Checkbox for toggling menu */}
      <input type="checkbox" id="check" />
      {/* Menu icon */}
      <label htmlFor="check" className="checkbtn h-full content-center flex ">
        <Menu />
      </label>
      {/* Site logo */}
      <button className="bg-white rounded-t-lg  p-1 ml-3 mt-[9px] hover:scale-110 transition-all duration-[0.3s] ease-[ease] delay-[0s]">
        <Link to="/">
          <Logo />
        </Link>
      </button>
      {/* Navigation links */}
      <ul>
        {isAuthenticated ? (
          <>
            <li className="text-xl uppercase">
              bienvenido: {user.NameStudent}
            </li>
            <li className="resaltado">
              <Link
                className={location.pathname === "/lunch/new" ? "active" : ""}
                to="/lunch/new"
              >
                Pedir almuerzo
              </Link>
            </li>
            <li>
              <Link
                className={location.pathname === "/lunch" ? "active" : ""}
                to="/lunch"
              >
                Almuerzos
              </Link>
            </li>
            <li>
              <Link
                className={location.pathname === "/lunch/pay" ? "active" : ""}
                to="/lunch/pay"
              >
                pagar almuerzo
              </Link>
            </li>
            <li>
              <Link to="/" onClick={() => logout()}>
                Cerrar sesión
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className={location.pathname === "/" ? "active" : ""}
                to="/"
              >
                inicio
              </Link>
            </li>
            <li>
              <Link
                className={location.pathname === "/login" ? "active" : ""}
                to="/login"
              >
                Inicio de Sesion
              </Link>
            </li>
            <li>
              <Link
                className={location.pathname === "/register" ? "active" : ""}
                to="/register"
              >
                Registrar
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
