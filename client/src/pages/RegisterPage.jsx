import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

function RegisterPage() {
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
    values.NameStudent = values.NameStudent.toUpperCase(); // Convierte el nombre a mayúsculas antes de enviarlo
    signup(values);
  });

  return (
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
        <form onSubmit={onSubmit}>
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
            {errors.NameStudent && (
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
            {errors.PhoneNumber && (
              <p className="text-red-500 text-[14px]">
                numero de telefono es requerido
              </p>
            )}
          </div>

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
  );
}
export default RegisterPage;
