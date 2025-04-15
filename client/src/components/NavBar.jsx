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
      <button className="btnLogo bg-white rounded-t-lg  p-1 ml-3 mt-[9px] hover:scale-110 transition-all duration-[0.3s] ease-[ease] delay-[0s]">
        <Link to="/">
          <Logo />
        </Link>
      </button>
      {/* Navigation links */}
      <ul className="z-50">
        {isAuthenticated ? (
          <>
            <li className="text-xl ">Bienvenido: {user.NameStudent}</li>
            {user.isAdmin ? (
              <>
                <li>
                  <Link
                    className={
                      location.pathname === "/admin"
                        ? "active font-medium"
                        : "hipervinculo font-medium"
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
                        ? "active font-medium"
                        : "hipervinculo font-medium"
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
                        ? "active font-medium"
                        : "hipervinculo font-medium"
                    }
                    to="/admin/create/menu"
                  >
                    Crear Menu
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="resaltado">
                  <Link
                    className={
                      location.pathname === "/lunch/new"
                        ? "active font-medium"
                        : "hipervinculo font-medium"
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
                        ? "active font-medium"
                        : "hipervinculo font-medium"
                    }
                    to="/lunch"
                  >
                    Almuerzos
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/" onClick={() => logout()}>
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
                    ? "active font-medium"
                    : "hipervinculo font-medium"
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
                    ? "active font-medium"
                    : "hipervinculo font-medium"
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
