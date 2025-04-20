import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Line = lazy(() => import("../components/icos/Line"));

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
    setFormErrors({});
    values.NameStudent = values.NameStudent.toUpperCase();
    values.grade = `${values.Grade}-${values.Subgroup}`;
    delete values.Grade;
    delete values.Subgroup;
    signup(values);
  });

  useEffect(() => {
    const timer = setTimeout(() => setFormErrors({}), 5000);
    return () => clearTimeout(timer);
  }, [formErrors]);

  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <div className="loader" />
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

          <h1 className="text-2xl font-bold mb-4">register</h1>

          <form
            onSubmit={(e) => {
              setFormErrors(errors);
              onSubmit(e);
            }}
          >
            <div className="mb-[16px]">
              <Label htmlFor="NameStudent" className="label">
                Nombre
              </Label>
              <Input
                id="NameStudent"
                placeholder="Nombre"
                {...register("NameStudent", { required: true })}
                className="w-full bg-white text-black h-14 rounded-2xl px-4 text-[16px]"
              />
              {formErrors.NameStudent && (
                <p className="text-red-500 text-[14px]">Nombre es requerido</p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="PhoneNumber" className="label">
                Numero de teléfono
              </Label>
              <Input
                type="text"
                id="PhoneNumber"
                placeholder="Phone Number"
                {...register("PhoneNumber", {
                  required: true,
                  pattern: /^[0-9]*$/,
                  validate: (value) =>
                    value.length >= 6 ||
                    "El número debe tener al menos 6 dígitos",
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
                className="w-full h-14 bg-white text-black px-4 rounded-2xl text-[16px]"
              />
              {formErrors.PhoneNumber && (
                <p className="text-red-500 text-[14px]">
                  {formErrors.PhoneNumber.message ||
                    "Número de teléfono es requerido"}
                </p>
              )}
            </div>

            <section className="mt-4">
              <Label htmlFor="Grade" className="label">
                Grado
              </Label>
              <section className="flex max-h-[400px] gap-2">
                <Select {...register("Grade", { required: true })}>
                  <SelectTrigger className="w-6/12 bg-white  px-4 rounded-2xl text-[16px] data-[size=default]:h-14">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white ">
                    {Array.from({ length: 11 }, (_, i) => (
                      <SelectItem
                        className="font-bold"
                        key={i + 1}
                        value={`${i + 1}`}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="self-center">
                  <Line />
                </div>

                <Select
                  id="Subgroup"
                  {...register("Subgroup", { required: true })}
                  defaultValue=""
                >
                  <SelectTrigger className="w-6/12 bg-white text-black px-4 rounded-2xl text-[16px] data-[size=default]:h-14">
                    <SelectValue placeholder="SubGrupo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white ">
                    {Array.from({ length: 3 }, (_, i) => (
                      <SelectItem
                        className="font-bold"
                        key={i + 1}
                        value={`${i + 1}`}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              {formErrors.Subgroup && (
                <p className="text-red-500 text-[14px]">
                  Subgrupo es requerido
                </p>
              )}
              {formErrors.Grade && (
                <p className="text-red-500 text-[14px]">Grado es requerido</p>
              )}
            </section>

            <Button
              type="submit"
              className="cursor-pointer w-full h-14 my-6 rounded-2xl bg-[#008000] font-[1000] text-[16px]"
            >
              Register
            </Button>
          </form>

          <footer className="flex justify-center">
            <Link to="/" className="text-sky-500">
              ¿Ya tienes una cuenta?
            </Link>
          </footer>
        </section>
      </main>
    </Suspense>
  );
}

export default RegisterPage;
