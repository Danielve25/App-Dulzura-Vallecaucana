import React, { lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { createMenu } from "../api/menu";
import Loader from "@/components/icos/Loader";

const AddIcon = lazy(() => import("../components/icos/AddIcon"));

const CreateNewMenu = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formatedData = {
      Descripcion: data.Descripcion.toUpperCase(),
    };

    try {
      const res = await createMenu(formatedData);
      console.log(res);
      if (res.status === 200) {
        alert("Menu creado con exito");
      }
    } catch (err) {
      console.error("Error al crear el menu:", err);
      alert(`Error al crear el menu: ${err.message}`);
    }
  });

  return (
    <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
      <Suspense fallback={<Loader />}>
        <section className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
          <header>
            <h1 className="text-2xl font-bold">Crear Menu</h1>
          </header>
          <form action="submit" onSubmit={onSubmit}>
            <label htmlFor="Descripcion" className="sr-only">
              Descripción del almuerzo
            </label>
            <textarea
              className="w-full bg-white focus:outline-black p-2 h-44 rounded-md my-3"
              id="Descripcion"
              placeholder="Descripcion del almuerzo"
              {...register("Descripcion", { required: true })}
            />
            {errors.Descripcion && (
              <p className="text-red-500 text-[14px]">
                La descripcion es requerida
              </p>
            )}
            <button
              type="submit"
              className="w-full cursor-pointer flex justify-center items-center h-14 rounded-2xl bg-[#008000] text-[#ffffff] font-[1000] text-[17px] hover:scale-110 transition-all duration-[0.3s] ease-[ease] delay-[0s]"
            >
              <AddIcon className="mr-1" />
              Crear
            </button>
          </form>
        </section>
      </Suspense>
    </main>
  );
};

export default CreateNewMenu;
