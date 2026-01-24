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

function CreatePendingLunchForm({ onSubmit, submitted, setIsOpen }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      nameClient: "",
      userneedscomplete: false,
      userneedstray: false,
      userneedsextrajuice: false,
      portionOfProtein: false,
      portionOfSalad: false,
      onlysoup: false,
      date: Temporal.Now.plainDateISO().toString(),
    },
  });

  const onSubmitForm = handleSubmit((data) => {
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

    onSubmit(formattedData);
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

        <Button className="cursor-pointer w-full h-14 rounded-2xl bg-[#008000] font-[1000] text-[16px]">
          Crear Pendiente
        </Button>
      </form>

      {submitted && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Almuerzo pendiente creado
        </div>
      )}
    </div>
  );
}

export default CreatePendingLunchForm;
