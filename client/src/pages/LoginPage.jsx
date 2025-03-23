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
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
      <div className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
        {signinErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white text">
            {error}
          </div>
        ))}
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={onSubmit}>
          <div className="mb-[16px]">
            <label htmlFor="NameStudent" className="label text-[14px]">
              Nombre
            </label>
            <input
              id="NameStudent"
              name="NameStudent"
              type="text"
              placeholder="Nombre"
              {...register("NameStudent", { required: true })}
              className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
            />
            {errors.NameStudent && (
              <p className="text-red-500 text-[14px]">Nombre es requerido</p>
            )}
          </div>
          <div className=" mt-4">
            <label htmlFor="PhoneNumber" className="label text-[14px]">
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
            Login
          </button>
        </form>
        <p className="flex justify-center">
          <Link to="/register" className="text-sky-500 ">
            no tienes una cuenta?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
