import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLunch } from "../context/LunchContext";
import { X } from "lucide-react";
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

const LunchPayForm = ({ setIsOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      userneedscomplete: false,
      userneedstray: false,
      userneedsextrajuice: false,
      portionOfProtein: false,
      portionOfSalad: false,
      onlysoup: false,
      name: "",
      grade: "",
    },
  });

  const { CreateLunchAdmin } = useLunch();

  const onSubmit = handleSubmit(async (data) => {
    setIsProcessing(true);

    const payload = {
      title: "Almuerzo",
      userneedscomplete: data.userneedscomplete,
      userneedstray: data.userneedstray,
      userneedsextrajuice: data.userneedsextrajuice,
      portionOfProtein: data.portionOfProtein,
      portionOfSalad: data.portionOfSalad,
      onlysoup: data.onlysoup,
      pay: false,
      date: new Date().toISOString(),
      user: {
        NameStudent: data.name,
        grade: data.grade,
      },
      statePayment: "",
    };

    const mainCount =
      Number(data.userneedscomplete) +
      Number(data.userneedstray) +
      Number(data.onlysoup);

    if (!mainCount) {
      alert("Seleccione al menos una opción principal");
      setIsProcessing(false);
      return;
    }

    if (mainCount > 1) {
      alert("Solo una opción principal");
      setIsProcessing(false);
      return;
    }

    try {
      await CreateLunchAdmin(payload);
      setIsOpen(false);
      window.location.reload();
    } finally {
      setIsProcessing(false);
    }
  });

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-10">
      <section className="relative max-w-md w-full bg-[#E9E9E9] py-8 px-8 rounded-md">
        <X
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 cursor-pointer"
        />

        <h1 className="text-2xl font-bold mb-4">Pedir Almuerzo</h1>

        <form onSubmit={onSubmit}>
          <Label>Nombre del estudiante</Label>
          <input
            className="w-full h-10 px-3 rounded mb-3"
            {...register("name", { required: true })}
          />

          <Label>Grado</Label>
          <input
            className="w-full h-10 px-3 rounded mb-4"
            {...register("grade", { required: true })}
          />

          <Label className="block mb-2">Opciones</Label>

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("userneedscomplete")}
              onCheckedChange={(v) => setValue("userneedscomplete", v)}
            />
            <span className="ml-2">Almuerzo completo</span>
          </Label>

          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="1">
              <AccordionTrigger>Detalles</AccordionTrigger>
              <AccordionContent>Con sopa · $14.000</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("userneedstray")}
              onCheckedChange={(v) => setValue("userneedstray", v)}
            />
            <span className="ml-2">Bandeja</span>
          </Label>

          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="2">
              <AccordionTrigger>Detalles</AccordionTrigger>
              <AccordionContent>Sin sopa · $13.000</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("onlysoup")}
              onCheckedChange={(v) => setValue("onlysoup", v)}
            />
            <span className="ml-2">Solo sopa</span>
          </Label>

          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="3">
              <AccordionTrigger>Detalles</AccordionTrigger>
              <AccordionContent>$5.000</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("userneedsextrajuice")}
              onCheckedChange={(v) => setValue("userneedsextrajuice", v)}
            />
            <span className="ml-2">Jugo extra</span>
          </Label>

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("portionOfProtein")}
              onCheckedChange={(v) => setValue("portionOfProtein", v)}
            />
            <span className="ml-2">Proteína</span>
          </Label>

          <Label className="flex items-center my-2">
            <Checkbox
              checked={watch("portionOfSalad")}
              onCheckedChange={(v) => setValue("portionOfSalad", v)}
            />
            <span className="ml-2">Ensalada</span>
          </Label>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full h-14 mt-4 rounded-2xl bg-[#008000] text-white font-bold"
          >
            {isProcessing ? "Procesando..." : "Confirmar"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default LunchPayForm;
