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
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      {RegisterErrors.map((error, i) => (
        <div key={i} className="bg-red-500 p-2 text-white">
          {error}
        </div>
      ))}
      <h1 className="text-2xl font-bold">register</h1>
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
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
          />
          {errors.PhoneNumber && (
            <p className="text-red-500">numero de telefono es requerido</p>
          )}
        </div>

        <button className="cursor-pointer" type="submit">
          Register
        </button>
      </form>
      <p className="flex gap-x-2 justify-between">
        ya tienes una cuenta?
        <Link to="/login" className="text-sky-500">
          inicia sesion
        </Link>
      </p>
    </div>
  );
}
export default RegisterPage;
