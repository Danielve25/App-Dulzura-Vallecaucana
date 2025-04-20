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

const LunchFormPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      userneedscomplete: false,
      userneedstray: false,
      EspecialStray: false,
      userneedsextrajuice: false,
      portionOfProtein: false,
      portionOfSalad: false,
    },
  });

  const { createLunch } = useLunch();

  const onSubmit = handleSubmit((data) => {
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
      EspecialStray: data.EspecialStray,
      userneedsextrajuice: data.userneedsextrajuice,
      portionOfProtein: data.portionOfProtein,
      portionOfSalad: data.portionOfSalad,
      date: today.toISOString(),
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

    createLunch(formattedData);
    setSubmitted(true);
  });

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
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
                <span className="ml-2">Almuerzo completo</span>
              </Label>

              <Separator />
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Detalles</AccordionTrigger>
                  <AccordionContent>
                    Almuerzo con sopa, cuesta 14.000
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("userneedstray")}
                  onCheckedChange={(val) => setValue("userneedstray", val)}
                />
                <span className="ml-2">Bandeja</span>
              </Label>

              <Separator />
              <Accordion type="single" collapsible>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Detalles</AccordionTrigger>
                  <AccordionContent>
                    Un almuerzo sin sopa, cuesta 13.000
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("EspecialStray")}
                  onCheckedChange={(val) => setValue("EspecialStray", val)}
                />
                <span className="ml-2">Bandeja especial</span>
              </Label>

              <Separator />
              <Accordion type="single" collapsible>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Detalles</AccordionTrigger>
                  <AccordionContent>
                    Bandeja normal con una carne y media
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("userneedsextrajuice")}
                  onCheckedChange={(val) =>
                    setValue("userneedsextrajuice", val)
                  }
                />
                <span className="ml-2">Jugo adicional</span>
              </Label>

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("portionOfProtein")}
                  onCheckedChange={(val) => setValue("portionOfProtein", val)}
                />
                <span className="ml-2">Porción de Proteína</span>
              </Label>

              <Label className="flex items-center my-3">
                <Checkbox
                  checked={watch("portionOfSalad")}
                  onCheckedChange={(val) => setValue("portionOfSalad", val)}
                />
                <span className="ml-2">Porción de Ensalada</span>
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

          <Button className="cursor-pointer w-full h-14 mt-6 rounded-2xl bg-[#008000] font-[1000] text-[16px]">
            Pedir
          </Button>
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
