import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLunch } from "../context/LunchContext";
import { Temporal } from "temporal-polyfill";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Loader from "@/components/icos/Loader";

const LunchPayForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      userneedscomplete: false,
      userneedstray: false,
      userneedsextrajuice: false,
      portionOfProtein: false,
      portionOfSalad: false,
      onlysoup: false,
    },
  });

  const { createLunch } = useLunch();

  const onSubmit = handleSubmit(async (data) => {
    const hoy = Temporal.Now.plainDateISO();
    const seleccionada = Temporal.PlainDate.from(data.date);

    let today;

    if (Temporal.PlainDate.compare(hoy, seleccionada) === 0) {
      today = new Date();
    } else {
      today = new Date(data.date);
    }

    const formattedData = {
      userneedscomplete: data.userneedscomplete,
      userneedstray: data.userneedstray,
      userneedsextrajuice: data.userneedsextrajuice,
      portionOfProtein: data.portionOfProtein,
      portionOfSalad: data.portionOfSalad,
      onlysoup: data.onlysoup,
      date: today.toISOString(),
    };

    if (
      !formattedData.userneedscomplete &&
      !formattedData.userneedstray &&
      !formattedData.userneedsextrajuice &&
      !formattedData.portionOfProtein &&
      !formattedData.portionOfSalad &&
      !formattedData.onlysoup
    ) {
      alert("Debe seleccionar al menos una opción");
      return;
    }

    if (
      formattedData.userneedscomplete ||
      formattedData.userneedstray ||
      formattedData.onlysoup
    ) {
      const count =
        Number(formattedData.userneedscomplete) +
        Number(formattedData.userneedstray) +
        Number(formattedData.onlysoup);

      if (count > 1) {
        alert("No puede seleccionar más de una opción principal");
        return;
      }
    }

    try {
      setLoading(true);
      await createLunch(formattedData);

      setSubmitted(true);
      setShowAlert(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error al enviar el pedido");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const ayer = Temporal.Now.plainDateISO();

  const minDate = ayer.toString();

  return (
    <main className="PedirAlmuerso flex h-[calc(100vh-80px)]  items-center justify-center w-full -z-10">
      <section className="max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
        <header>
          <h1 className="text-2xl font-bold">Pedir Almuerzo</h1>
        </header>
        <form onSubmit={onSubmit}>
          <div className="mt-4">
            <Label className="label">Opciones</Label>
            <div className="flex flex-col">
              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("userneedscomplete")}
                  onCheckedChange={(val) => setValue("userneedscomplete", val)}
                />
                <span className="ml-2">Almuerzo completo cuesta 16.000</span>
              </Label>

              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("userneedstray")}
                  onCheckedChange={(val) => setValue("userneedstray", val)}
                />
                <span className="ml-2">Bandeja cuesta 15.000</span>
              </Label>

              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("onlysoup")}
                  onCheckedChange={(val) => setValue("onlysoup", val)}
                />
                <span className="ml-2">solo sopa cuesta 5.000</span>
              </Label>

              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("userneedsextrajuice")}
                  onCheckedChange={(val) =>
                    setValue("userneedsextrajuice", val)
                  }
                />
                <span className="ml-2">Jugo adicional cuesta 1.000</span>
              </Label>

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("portionOfProtein")}
                  onCheckedChange={(val) => setValue("portionOfProtein", val)}
                />
                <span className="ml-2">Porción de Proteína cuesta 8.000</span>
              </Label>

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("portionOfSalad")}
                  onCheckedChange={(val) => setValue("portionOfSalad", val)}
                />
                <span className="ml-2">Porción de Ensalada cuesta 3.000</span>
              </Label>
            </div>

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
          </div>

          <Button
            disabled={loading}
            className="cursor-pointer w-full h-14 rounded-2xl bg-[#008000] font-[1000] text-[16px] flex items-center justify-center"
          >
            {loading ? <Loader /> : "Pedir"}
          </Button>
        </form>
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

        {submitted && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            Se pidió el almuerzo
          </div>
        )}
      </section>
    </main>
  );
};

export default LunchPayForm;
