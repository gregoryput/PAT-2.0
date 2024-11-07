import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input } from "@/components";
import { Calendar, Dices } from "lucide-react";
import { act, useState } from "react";



export default function BestEstimateForm() {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const [activado, setActivado] = useState(null);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="gap-5 rounded-sm bg-gray-100 hover:bg-blue-600 hover:text-white">
                        <p>Best Estimate</p>
                        <Dices width={20} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle>Best Estimate</DialogTitle>
                        <DialogDescription>
                            Agregar un nuevo presupuesto al mes que sea necesario.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-wrap justify-center gap-4 py-4">
                        {meses.map((data, i) => (
                            <div
                                key={i}
                                onClick={() => setActivado(i)}
                                className={`border rounded-lg w-[250px] h-[90px] p-3 font-thin cursor-pointer`}
                            >
                                <div className="flex text-gray-500 gap-2 items-center">
                                    <Calendar width={18} />
                                    <p className="text-[15px]">{data.toUpperCase()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
