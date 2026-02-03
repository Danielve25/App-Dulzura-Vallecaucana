import React, { lazy, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { createMenu } from "../api/menu";
import Loader from "@/components/icos/Loader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Temporal } from "temporal-polyfill";

const CirclePlus = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.CirclePlus })),
);

const ayer = Temporal.Now.plainDateISO();

const minDate = ayer.toString();

const CreateNewMenu = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formatedData = {
      Descripcion: data.Descripcion.toUpperCase(),
      date: data.date,
    };
    console.log(formatedData);

    try {
      setLoading(true);
      await createMenu(formatedData);
      setShowAlert(true);
    } catch (err) {
      console.error("Error al crear el menu:", err);
      alert(`Error al crear el menu: ${err.message}`);
    } finally {
      setLoading(false);
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
            <Label htmlFor="Descripcion" className="sr-only">
              Descripción del almuerzo
            </Label>
            <Textarea
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
            <section className="my-3">
              <Label htmlFor="date">Fecha:</Label>
              <input
                {...register("date", { required: true })}
                type="date"
                id="date"
                name="date"
                min={minDate}
              />
            </section>

            <Button
              disabled={loading}
              type="submit"
              className="w-full cursor-pointer flex justify-center items-center h-14 rounded-2xl bg-[#008000] text-[#ffffff] font-[1000] text-[17px] hover:scale-110 transition-all duration-300 ease-[ease] delay-[0s]"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <CirclePlus size={30} /> Crear Menu{" "}
                </>
              )}
            </Button>
          </form>
        </section>
        {showAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl text-center text-2xl font-bold">
              🍽️ Pedido enviado con éxito
              <button
                className="block mt-6 px-6 py-2 bg-green-600 text-white rounded-xl"
                onClick={() => setShowAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </Suspense>
    </main>
  );
};

export default CreateNewMenu;
