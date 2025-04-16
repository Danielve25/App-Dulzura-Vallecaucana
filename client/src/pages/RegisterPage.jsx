import { useForm } from "react-hook-form";
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Line = lazy(() => import("../components/icos/Line")); // Corrige la función lazy eliminando el bloque innecesario

function RegisterPage() {
  const [formErrors, setFormErrors] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: RegisterErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/lunch");
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setFormErrors({}); // Limpia los errores al enviar el formulario
    values.NameStudent = values.NameStudent.toUpperCase(); // Convierte el nombre a mayúsculas antes de enviarlo
    values.grade = `${values.Grade}-${values.Subgroup}`; // Concatena grado y subgrupo
    delete values.Grade; // Elimina el campo Grade
    delete values.Subgroup; // Elimina el campo Subgroup
    signup(values);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormErrors({});
    }, 5000); // Limpia los errores después de 5 segundos
    return () => clearTimeout(timer);
  }, [formErrors]);

  return (
    <Suspense
      fallback={
        <div className="h-[100vh] w-full flex justify-center items-center">
          <div className="loader"></div>
        </div>
      }
    >
      <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full p-5">
        <section className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
          {RegisterErrors.map((error, i) => (
            <div key={i} className="bg-red-500 p-2 text-white">
              {error}
            </div>
          ))}
          <header>
            <h1 className="text-2xl font-bold">register</h1>
          </header>
          <form
            onSubmit={(e) => {
              setFormErrors(errors); // Actualiza los errores al intentar enviar
              onSubmit(e);
            }}
          >
            <div className="mb-[16px]">
              <label htmlFor="NameStudent" className="label">
                Nombre
              </label>
              <input
                id="NameStudent"
                name="NameStudent"
                type="text"
                placeholder="Nombre"
                {...register("NameStudent", {
                  required: true,
                })}
                className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
              />
              {formErrors.NameStudent && (
                <p className="text-red-500 text-[14px]">Nombre es requerido</p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="PhoneNumber" className="label">
                Numero de telefono
              </label>
              <input
                type="text"
                id="PhoneNumber"
                name="PhoneNumber"
                placeholder="Phone Number"
                {...register("PhoneNumber", {
                  required: true,
                  pattern: /^[0-9]*$/, // Solo permite números
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
                }}
                className="w-full h-14 bg-white text-black px-4 rounded-2xl text-[16px] "
              />
              {formErrors.PhoneNumber && (
                <p className="text-red-500 text-[14px]">
                  numero de telefono es requerido
                </p>
              )}
            </div>
            <section className=" mt-4">
              <label htmlFor="Grade" className="label">
                Grado
              </label>
              <section className="flex max-h-[400px] ">
                <select
                  id="Grade"
                  {...register("Grade", { required: true })}
                  className="w-6/12 h-14 bg-white text-black px-4 rounded-2xl text-[16px]"
                >
                  <option value="" selected disabled>
                    grado
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                </select>
                {formErrors.Grade && (
                  <p className="text-red-500 text-[14px]">Grado es requerido</p>
                )}
                <div className="self-center">
                  <Line />
                </div>
                <select
                  id="Subgroup"
                  {...register("Subgroup", { required: true })}
                  className="w-6/12 h-14 bg-white text-black px-4 rounded-2xl text-[16px]"
                >
                  <option value="" selected disabled>
                    subgrupo
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                {formErrors.Subgroup && (
                  <p className="text-red-500 text-[14px]">
                    Subgrupo es requerido
                  </p>
                )}
              </section>
            </section>
            <button
              className="cursor-pointer w-full h-14 my-6 rounded-2xl bg-[#008000] text-[#ffffff] font-[1000] text-[16px] "
              type="submit"
            >
              Register
            </button>
          </form>
          <footer className="flex justify-center">
            <Link to="/" className="text-sky-500">
              ya tienes una cuenta?
            </Link>
          </footer>
        </section>
      </main>
    </Suspense>
  );
}
export default RegisterPage;
