import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input } from "@/components";
import dayjs from "dayjs";
import { Calendar, Dices } from "lucide-react";
import { useState } from "react";



export default function BestEstimateForm({ data }) {
    const mesesAbreviados = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const fechaFormateada = (data) => {
        const mesIndex = dayjs(data?.fecha).month(); // Obtiene el índice del mes (0-11)
        return mesesAbreviados[mesIndex].toLocaleUpperCase();
    };

    const [activo, setActivado] = useState(0);


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
                        {data?.map((data, i) => (
                            <div
                                key={i}
                                onClick={() => setActivado(i)}
                                className={`group border rounded-lg w-[250px] h-[90px] p-3 font-thin cursor-pointer hover:bg-green-500 hover:text-white ${activo == i ? "bg-blue-700 text-white" : ""}`}
                            >
                                <div className={`flex text-gray-500 gap-2 items-center group-hover:text-white ${activo == i ? " text-white" : ""}  `}>
                                    <Calendar width={18} />
                                    <p className="text-[15px]">{fechaFormateada(data)}</p>
                                </div>

                                {activo == i ? <><Input className="h-8 w-30 mt-2 text-blue-600"  placeholder="0" /></> : <p className="mt-3 text-[16px] ml-2"> $ {data.estimated}</p>}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
