import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import Menu from "./icos/Menu";
import Logo from "./icos/logo";

function NavBar() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  console.log(user);
  return (
    <nav className="open-sans z-10">
      {/* Checkbox for toggling menu */}
      <input type="checkbox" id="check" />
      {/* Menu icon */}
      <label
        htmlFor="check"
        className="checkbtn h-full content-center flex open-sans"
      >
        <Menu />
      </label>
      {/* Site logo */}
      <button className="btnLogo bg-white rounded-t-lg  p-1 ml-3 mt-[9px] hover:scale-110 transition-all duration-[0.3s] ease-[ease] delay-[0s] open-sans">
        <Link to="/">
          <Logo />
        </Link>
      </button>
      {/* Navigation links */}
      <ul className="z-50 open-sans">
        {isAuthenticated ? (
          <>
            <li className="text-xl open-sans">
              Bienvenido: {user.NameStudent}
            </li>
            {user.isAdmin ? (
              <>
                <li>
                  <Link
                    className={
                      location.pathname === "/admin"
                        ? "active  open-sans"
                        : "hipervinculo  open-sans"
                    }
                    to="/admin"
                  >
                    Panel Admin
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname === "/admin/listDay"
                        ? "active  open-sans"
                        : "hipervinculo  open-sans"
                    }
                    to="/admin/listDay"
                  >
                    Lista del Día
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname === "/admin/create/menu"
                        ? "active  open-sans"
                        : "hipervinculo  open-sans"
                    }
                    to="/admin/create/menu"
                  >
                    Crear Menu
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="resaltado open-sans">
                  <Link
                    className={
                      location.pathname === "/lunch/new"
                        ? "active  open-sans"
                        : "hipervinculo  open-sans"
                    }
                    to="/lunch/new"
                  >
                    Pedir Almuerzo
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname === "/lunch"
                        ? "active  open-sans"
                        : "hipervinculo  open-sans"
                    }
                    to="/lunch"
                  >
                    Almuerzos
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link className="open-sans" to="/" onClick={() => logout()}>
                Cerrar Sesión
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className={
                  location.pathname === "/"
                    ? "active  open-sans"
                    : "hipervinculo  open-sans"
                }
                to="/"
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                className={
                  location.pathname === "/register"
                    ? "active  open-sans"
                    : "hipervinculo  open-sans"
                }
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
