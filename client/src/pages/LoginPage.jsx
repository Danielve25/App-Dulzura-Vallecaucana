import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    data.NameStudent = data.NameStudent.toUpperCase(); // Convertir a mayúsculas antes de enviar
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/lunch");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full p-5">
      <section className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
        {signinErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white text">
            {error}
          </div>
        ))}
        <header>
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        </header>
        <form onSubmit={onSubmit}>
          <div className="mb-[16px]">
            <Label htmlFor="NameStudent" className="label text-[14px]">
              Nombre
            </Label>
            <Input
              id="NameStudent"
              name="NameStudent"
              type="text"
              placeholder="Nombre"
              {...register("NameStudent", { required: true })}
              className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
            />
            {errors.NameStudent && (
              <p className="text-red-500 text-[14px]">El nombre es requerido</p>
            )}
          </div>
          <div className=" mt-4">
            <Label htmlFor="PhoneNumber" className="label text-[14px]">
              Número de Teléfono
            </Label>
            <Input
              id="PhoneNumber"
              type="text"
              name="PhoneNumber"
              placeholder="Número de Teléfono"
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
                El número de teléfono es requerido
              </p>
            )}
          </div>

          <Button
            className="cursor-pointer w-full h-14 my-6 rounded-2xl bg-[#008000] text-[#ffffff] font-[1000] text-[16px] "
            type="submit"
          >
            Iniciar Sesión
          </Button>
        </form>
        <footer className="flex justify-center">
          <Link to="/register" className="text-sky-500">
            ¿No tienes una cuenta?
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
