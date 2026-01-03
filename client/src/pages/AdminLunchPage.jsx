import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form"; // Agregar import
import { useLunch } from "../context/LunchContext";
import { useAuth } from "../context/AuthContext"; // <- Agrega esta línea
import Loader from "@/components/icos/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelloImagen from "../components/icos/CanceladoSello";
import ChartComponent from "@/components/ChartComponent";
import { DataTable } from "@/components/DataTable";
import { Phone } from "lucide-react";
import { Temporal } from "temporal-polyfill"; // Agregar import
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Agregar import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <- Agrega esta línea

function AdminLunchPage() {
  const chartConfig = {
    Almuerzos: { label: "Almuerzos", color: "#6495ED" },
  };

  const [chartData, setChartData] = useState([]);
  const { getAllLunchs, putLunch, createLunchByAdmin } = useLunch();
  const { getUsers } = useAuth();
  const { assignPendingLunches } = useLunch();
  const [groupedLunchs, setGroupedLunchs] = useState({});
  const [loadingPay, setLoadingPay] = useState(null);
  const [dataTable, setDataTable] = useState([]);

  const [pendingLunches, setPendingLunches] = useState({});
  const [newPendingLunch, setNewPendingLunch] = useState({
    nameClient: "",
    userneedscomplete: false,
    userneedstray: false,
    userneedsextrajuice: false,
    portionOfProtein: false,
    portionOfSalad: false,
    onlysoup: false,
    date: new Date().toISOString().split("T")[0],
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assigningClient, setAssigningClient] = useState("");

  const loadLunchs = async () => {
    try {
      const lunches = await getAllLunchs();
      if (lunches.data.length === 0) {
        setGroupedLunchs({});
        setPendingLunches({});
        return;
      }
      const grouped = {};
      const pending = {};
      lunches.data.forEach((lunch) => {
        const key = lunch.user?.NameStudent || lunch.nameClient;
        const target = lunch.user ? grouped : pending;
        if (!target[key]) target[key] = [];
        target[key].push(lunch);
      });
      setGroupedLunchs(grouped);
      setPendingLunches(pending);
      const dailyCounts = lunches.data.reduce((acc, lunch) => {
        const date = new Date(lunch.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartFormattedData = Object.entries(dailyCounts).map(
        ([date, count]) => ({
          date,
          Almuerzos: count,
        })
      );

      const updatedData = chartFormattedData.map((item) => {
        const dateParts = item.date.split("-");
        let year = parseInt(dateParts[0]);
        let month = parseInt(dateParts[1]) - 1; // Los meses en JavaScript son 0-indexados
        let day = parseInt(dateParts[2]);

        const dateObject = new Date(year, month, day);
        dateObject.setDate(dateObject.getDate() + 1);

        const newYear = dateObject.getFullYear();
        const newMonth = (dateObject.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const newDay = dateObject.getDate().toString().padStart(2, "0");

        return {
          ...item,
          date: `${newYear}-${newMonth}-${newDay}`,
        };
      });
      setChartData(updatedData);
      const dataTable = Object.entries(grouped).map(([studentName, lunchs]) => {
        const totalAmount = lunchs.reduce(
          (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
          0
        );

        const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;
        const phoneNumberReal = lunchs[0]?.user.PhoneNumberReal || ""; // Asumiendo que PhoneNumberReal está en cada lunch

        return {
          id: studentName,
          amount: totalAmount,
          Pending: pendingPayments,
          PhoneNumberReal: phoneNumberReal, // Se agrega el PhoneNumberReal
        };
      });
      setDataTable(dataTable);
    } catch (error) {
      console.error("Error cargando almuerzos:", error);
    }
  };
  console.log(JSON.stringify(dataTable, null, 2));
  console.log("gropuped lunch", groupedLunchs);

  console.log(chartData);

  useEffect(() => {
    loadLunchs();
  }, []);

  const createPendingLunch = async () => {
    if (!newPendingLunch.nameClient)
      return alert("Ingresa el nombre del cliente");
    try {
      await createLunchByAdmin({
        ...newPendingLunch,
        nameClient: newPendingLunch.nameClient.toUpperCase(),
      });
      setNewPendingLunch({
        nameClient: "",
        userneedscomplete: false,
        userneedstray: false,
        userneedsextrajuice: false,
        portionOfProtein: false,
        portionOfSalad: false,
        onlysoup: false,
        date: new Date().toISOString().split("T")[0],
      });
      loadLunchs();
    } catch (error) {
      console.error(error);
    }
  };

  const [submitted, setSubmitted] = useState(false);
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

  const { CreateLunchAdmin } = useLunch();

  const onSubmitPending = handleSubmit((data) => {
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

    CreateLunchAdmin(formattedData);
    setSubmitted(true);
  });

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const ayer = Temporal.Now.plainDateISO();
  const minDate = ayer.toString();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.log(error);
      }
    };
    loadUsers();
  }, []);

  const handleAssign = async (nameClient) => {
    if (!selectedUser) {
      alert("Selecciona un usuario");
      return;
    }
    try {
      await assignPendingLunches({ userId: selectedUser, nameClient });
      alert("Almuerzos asignados");
      loadLunchs(); // Recargar
    } catch (error) {
      console.log(error);
      alert("Error al asignar");
    }
  };

  if (Object.keys(groupedLunchs).length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY PEDIDOS REGISTRADOS</h1>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <Suspense fallback={<Loader />}>
        <h2 className="text-2xl font-bold mb-4">
          Panel de Administrador - Almuerzos por Estudiante
        </h2>

        <ChartComponent
          className="bg-white border-slate-300  shadow-md"
          chartData={chartData}
          chartConfig={chartConfig}
          lineType="line"
          defaultTimeRange="30d"
          chartTitle="Almuerzos Pedidos"
          chartDescription="Monstrando todos los almuerzos pedidos"
        />
        <DataTable data={dataTable} />
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedLunchs).map(([studentName, lunchs]) => {
            const totalAmount = lunchs.reduce(
              (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
              0
            );
            const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;

            return (
              <AccordionItem value={studentName} key={studentName}>
                <AccordionTrigger className="text-left text-xl font-medium px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex-col items-start">
                  <span className="font-bold">{studentName}</span>
                  <span className="text-sm font-normal text-gray-700">
                    Total A Pagar: ${totalAmount} - Pendientes:{" "}
                    {pendingPayments}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white">
                  {lunchs.map((lunch) => (
                    <article
                      key={lunch._id}
                      className="p-4 border rounded-lg shadow-sm relative bg-gray-50"
                    >
                      {lunch.pay && <SelloImagen />}
                      <p className="text-gray-600">
                        {new Date(lunch.date).toLocaleDateString()}
                      </p>

                      <div className="mt-2 space-y-1">
                        {lunch.userneedscomplete && <p>✓ Almuerzo completo</p>}
                        {lunch.userneedstray && <p>✓ Bandeja</p>}
                        {lunch.userneedsextrajuice && <p>✓ Jugo extra</p>}
                        {lunch.portionOfProtein && <p>✓ Porción Proteína</p>}
                        {lunch.portionOfSalad && <p>✓ Porción Ensalada</p>}
                        {lunch.EspecialStray && <p>✓ Bandeja Especial</p>}
                        {lunch.onlysoup && <p>✓ Solo Sopa</p>}
                      </div>

                      <div className="mt-2 text-sm">
                        <p
                          className={`font-bold ${
                            lunch.pay ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {lunch.pay ? "PAGADO" : "PENDIENTE DE PAGO"}
                        </p>
                        <p className="font-bold">
                          Total: ${lunch.userNeedsPay}
                        </p>
                      </div>

                      {!lunch.pay && (
                        <button
                          onClick={async () => {
                            setLoadingPay(lunch._id);
                            try {
                              await putLunch({ pay: true }, lunch._id);
                              await loadLunchs();
                            } catch (error) {
                              console.log(error);
                            } finally {
                              setLoadingPay(null);
                            }
                          }}
                          className="w-full my-4 px-4 py-2 bg-[#008000] text-white rounded transition-transform duration-300 hover:scale-110 disabled:bg-[#338000] disabled:cursor-not-allowed"
                          disabled={loadingPay === lunch._id}
                        >
                          {loadingPay === lunch._id ? (
                            <span className="loader"></span>
                          ) : (
                            "Pagar Almuerzo"
                          )}
                        </button>
                      )}
                    </article>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Sección para crear almuerzos pendientes */}
        <div className="mb-4 max-w-md w-full bg-[#E9E9E9] px-6 p-10 rounded-md">
          <header>
            <h1 className="text-2xl font-bold">Crear Almuerzo Pendiente</h1>
          </header>
          <form onSubmit={onSubmitPending}>
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
                    onCheckedChange={(val) =>
                      setValue("userneedscomplete", val)
                    }
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
                  // min={minDate}  // <- Quita esta línea para permitir todas las fechas
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

        {/* Mostrar almuerzos pendientes */}
        <Accordion type="single" collapsible>
          {Object.keys(pendingLunches).map((clientName) => (
            <AccordionItem key={clientName} value={clientName}>
              <AccordionTrigger>{clientName} (Pendiente)</AccordionTrigger>
              <AccordionContent>
                {pendingLunches[clientName].map((lunch) => (
                  <div key={lunch._id}>
                    {/* Mostrar detalles del almuerzo */}
                    Fecha: {new Date(lunch.date).toLocaleDateString()} - Monto:
                    ${lunch.userNeedsPay}
                  </div>
                ))}
                <div className="mt-4">
                  <Label>Asignar a usuario:</Label>
                  <Select onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.NameStudent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleAssign(clientName)}
                    className="mt-2"
                  >
                    Asignar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Suspense>
    </div>
  );
}

export default AdminLunchPage;
