import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLunch } from "../context/LunchContext";

const LunchFormPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createLunch } = useLunch();

  const onSubmit = handleSubmit((data) => {
    const formattedData = {
      userneedscomplete: !!data.userneedscomplete,
      userneedstray: !!data.userneedstray,
      EspecialStray: !!data.EspecialStray,
      userneedsextrajuice: !!data.userneedsextrajuice,
      portionOfProtein: !!data.portionOfProtein,
      portionOfSalad: !!data.portionOfSalad,
    };

    if (
      !formattedData.userneedscomplete &&
      !formattedData.userneedstray &&
      !formattedData.EspecialStray &&
      !formattedData.userneedsextrajuice &&
      !formattedData.portionOfProtein &&
      !formattedData.portionOfSalad
    ) {
      alert("Debe seleccionar al menos una opción");
      return;
    }

    if (
      (formattedData.userneedscomplete && formattedData.userneedstray) ||
      (formattedData.EspecialStray &&
        (formattedData.userneedscomplete || formattedData.userneedstray))
    ) {
      alert(
        "No puede seleccionar combinaciones no permitidas: Almuerzo completo y Bandeja, o Bandeja especial junto con Almuerzo completo o Bandeja"
      );
      return;
    }

    console.log(formattedData);
    createLunch(formattedData);
    setSubmitted(true);
  });

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
      <section className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
        <header>
          <h1 className="text-2xl font-bold">Pedir Almuerzo</h1>
        </header>
        <form onSubmit={onSubmit}>
          <div className="mt-4">
            <label className="label" htmlFor="opciones">
              Opciones
            </label>
            <div id="opciones" className="flex flex-col">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("userneedscomplete")}
                  className="mr-2"
                />
                Almuerzo completo
              </label>

              <small>
                <details className="cursor-pointer">
                  <summary>detalles</summary>
                  <p>Almuerzo con sopa, cuesta 14.000</p>
                </details>
              </small>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("userneedstray")}
                  className="mr-2"
                />
                Bandeja
              </label>

              <small>
                <details className="cursor-pointer">
                  <summary>detalles</summary>
                  <p>Un almuerzo sin sopa, cuesta 13.000</p>
                </details>
              </small>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("EspecialStray")}
                  className="mr-2"
                />
                Bandeja especial
              </label>

              <small>
                <details className="cursor-pointer">
                  <summary>detalles</summary>
                  <p>Bandeja normal con una carne y media</p>
                </details>
              </small>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("userneedsextrajuice")}
                  className="mr-2"
                />
                Jugo adicional
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("portionOfProtein")}
                  className="mr-2"
                />
                Porción de Proteína
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("portionOfSalad")}
                  className="mr-2"
                />
                Porción de Ensalada
              </label>
            </div>
            {errors.options && (
              <span className="text-red-500 text-[14px]">
                {errors.options.message}
              </span>
            )}
          </div>

          <button className="cursor-pointer w-full bg-green-500 font-bold p-2 rounded-2xl">
            Pedir
          </button>
        </form>
        {submitted && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            Se pidió el almuerzo
          </div>
        )}
      </section>
    </main>
  );
};

export default LunchFormPage;
