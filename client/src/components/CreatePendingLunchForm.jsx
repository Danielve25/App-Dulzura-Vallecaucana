import { useForm } from "react-hook-form";
import { Temporal } from "temporal-polyfill";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import Loader from "./icos/Loader";

function CreatePendingLunchForm({ onSubmit, setIsOpen }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      nameClient: "",
      userneedscomplete: false,
      userneedstray: false,
      userneedsextrajuice: false,
      portionOfProtein: false,
      portionOfSalad: false,
      onlysoup: false,
      teacher: false,
      date: Temporal.Now.plainDateISO().toString(),
    },
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmitForm = handleSubmit(async (data) => {
    const hoy = Temporal.Now.plainDateISO();
    const seleccionada = Temporal.PlainDate.from(data.date);

    let today;

    if (Temporal.PlainDate.compare(hoy, seleccionada) === 0) {
      today = new Date();
    } else {
      today = new Date(data.date);
    }

    const formattedData = {
      nameClient: data.nameClient.toUpperCase(),
      userneedscomplete: data.userneedscomplete,
      userneedstray: data.userneedstray,
      userneedsextrajuice: data.userneedsextrajuice,
      portionOfProtein: data.portionOfProtein,
      portionOfSalad: data.portionOfSalad,
      onlysoup: data.onlysoup,
      teacher: data.teacher,
      date: today.toISOString(),
    };

    if (
      !formattedData.userneedscomplete &&
      !formattedData.userneedstray &&
      !formattedData.userneedsextrajuice &&
      !formattedData.portionOfProtein &&
      !formattedData.portionOfSalad &&
      !formattedData.onlysoup &&
      !formattedData.teacher
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
        Number(formattedData.onlysoup) +
        Number(formattedData.teacher);

      if (count > 1) {
        alert("No puede seleccionar más de una opción principal");
        return;
      }
    }

    try {
      setLoading(true);
      await onSubmit(formattedData); // 👈 promesa
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      alert("Error al enviar el pedido");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="relative mb-4 max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
      <X
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 cursor-pointer"
      />
      <header>
        <h1 className="text-2xl font-bold">Crear Almuerzo Pendiente</h1>
      </header>

      <form onSubmit={onSubmitForm}>
        <div className="mt-4">
          <Label className="label">Nombre del Cliente</Label>
          <Input
            {...register("nameClient", { required: true })}
            placeholder="Nombre del cliente"
          />

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
                checked={watch("onlysoup")}
                onCheckedChange={(val) => setValue("onlysoup", val)}
              />
              <span className="ml-2">solo sopa</span>
            </Label>

            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-3">
                <AccordionTrigger>Detalles</AccordionTrigger>
                <AccordionContent>solo sopa, cuesta 5.000</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Label className="flex items-center my-3">
              <Checkbox
                checked={watch("teacher")}
                onCheckedChange={(val) => setValue("teacher", val)}
              />
              <span className="ml-2">PROFE</span>
            </Label>

            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Detalles</AccordionTrigger>
                <AccordionContent>Profe cuesta 13.000</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Separator />

            <Label className="flex items-center my-3">
              <Checkbox
                checked={watch("userneedsextrajuice")}
                onCheckedChange={(val) => setValue("userneedsextrajuice", val)}
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
            />
          </section>
        </div>

        <Button
          disabled={loading}
          className="cursor-pointer w-full h-14 rounded-2xl bg-[#008000] font-[1000] text-[16px] flex items-center justify-center"
        >
          {loading ? <Loader /> : "Crear Pendiente"}
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
    </div>
  );
}

export default CreatePendingLunchForm;
