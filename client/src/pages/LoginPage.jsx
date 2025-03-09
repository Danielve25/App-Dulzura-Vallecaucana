import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/lunch");
  }, [isAuthenticated]);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {signinErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white text-center">
            {error}
          </div>
        ))}
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={onSubmit}>
          <div className="mb-[3px]">
            <label htmlFor="NameStudent" className="label">
              Nombre
            </label>
            <input
              id="NameStudent"
              name="NameStudent"
              type="text"
              placeholder="Nombre"
              {...register("NameStudent", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
            />
            {errors.NameStudent && (
              <p className="text-red-500">Nombre es requerido</p>
            )}
          </div>
          <div className="mb-[3px]">
            <label htmlFor="PhoneNumber" className="label">
              Numero de telefono
            </label>
            <input
              id="PhoneNumber"
              type="text"
              name="PhoneNumber"
              placeholder="Phone Number"
              {...register("PhoneNumber", {
                required: true,
                pattern: /^[0-9]*$/, // Solo permite números
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
              }}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
            />
            {errors.PhoneNumber && (
              <p className="text-red-500">numero de telefono es requerido</p>
            )}
          </div>

          <button className="cursor-pointer" type="submit">
            Login
          </button>
        </form>
        <p className="flex gap-x-2 justify-between">
          no tienes una cuenta?{" "}
          <Link to="/register" className="text-sky-500">
            registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
