import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PendingLunchesAccordion({
  pendingLunches,
  users,
  setSelectedUser,
  handleAssign,
}) {
  return (
    <Accordion type="single" collapsible>
      {Object.keys(pendingLunches).map((clientName) => (
        <AccordionItem key={clientName} value={clientName}>
          <AccordionTrigger>{clientName} (Pendiente)</AccordionTrigger>
          <AccordionContent>
            {pendingLunches[clientName].map((lunch) => (
              <div key={lunch._id}>
                Fecha: {new Date(lunch.date).toLocaleDateString()} - Monto: $
                {lunch.userNeedsPay}
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
              <Button onClick={() => handleAssign(clientName)} className="mt-2">
                Asignar
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default PendingLunchesAccordion;
