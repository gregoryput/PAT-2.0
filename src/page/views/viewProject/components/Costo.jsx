import { Button, Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import useProject from "@/hook/useProject";
import { ChartNoAxesColumnIncreasing, Loader2 } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/api/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


export default function Costo() {
    const { project } = useProject();
    const { data, isValidating, isloanding } = useSWR(`/Projects/getCostTable?projectId=${project.projectId}`, fetcher, { refreshInterval: false, revalidateOnFocus: false })

    const [filter, setFilter] = useState("")
    const [lista, setLista] = useState(data)


      
        useEffect(()=>{
            if (filter === "Todo") {
                setLista(data)
            }
    
            if (filter === "Real") {
                setLista(data?.filter(item => item.costType === filter));
            }
    
            if (filter === "Comprometido") {
                setLista(data?.filter(item => item.costType === filter));
            }

        },[filter,setFilter])


    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="ghost"  onClick={()=> setFilter("Todo")} className="gap-5 rounded-sm bg-gray-100  hover:bg-blue-600 hover:text-white">
                        Costo
                        <ChartNoAxesColumnIncreasing width={20} />
                    </Button>
                </DrawerTrigger>
                <DrawerContent >
                    {isValidating == true || isloanding == true  ? <>
                        <div className="w-full h-[800px] flex justify-center items-center">
                            <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-700 " />
                        </div>
                    </> : <>
                        <div className="mx-36 h-[800px] ">
                            <div className="flex justify-between items-center">
                                <DrawerHeader>
                                    <DrawerTitle>Tabla de costo</DrawerTitle>
                                    <DrawerDescription>Registro de recurso utilizado en este proyecto.</DrawerDescription>
                                </DrawerHeader>
                                <div className=" rounded-md border border-gray-200">
                                    <Button variant="ghost" className={`rounded-r-none ${filter == "Todo" ? "bg-blue-500 text-white" : ""}`} onClick={() => setFilter("Todo")}  >
                                        Todo
                                    </Button>
                                    <Button variant="ghost" className={`rounded-none ${filter == "Real" ? "bg-blue-500 text-white" : ""} `} onClick={() => setFilter("Real")}  >
                                        Real
                                    </Button>
                                    <Button variant="ghost" className={`rounded-l-none ${filter == "Comprometido" ? "bg-blue-500 text-white" : ""}`} onClick={() => setFilter("Comprometido")}  >
                                        Comprometido
                                    </Button>

                                </div>
                            </div>

                            <div className="overflow-x-auto max-h-[90%]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Denominación</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>doc. de Referencia</TableHead>
                                            <TableHead>moneda</TableHead>
                                            <TableHead>Costo</TableHead>
                                            <TableHead>Estado OC </TableHead>
                                            <TableHead className="text-right">Fecha Entrega </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lista?.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mediumb w-[400px]">{data.denomination}</TableCell>
                                                <TableCell>{data.statusId === 4 ? 'Paid' : 'Pending'}</TableCell>
                                                <TableCell>{data.docReference || 'N/A'}</TableCell>
                                                <TableCell>{dayjs(data.date,"DD-MM-YYYY").format("DD-MM-YYYY")|| 'N/A'}</TableCell>
                                                <TableCell >{data.currency}</TableCell>
                                                <TableCell >{data.cost}</TableCell>
                                                <TableCell >{data.estadoOrden || "N/A"}</TableCell>
                                                <TableCell className="text-right">{data.expireOrder !== null ? dayjs(data.expireOrder,"DD-MM-YYYY").format("DD-MM-YYYY") : "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                        </div>
                    </>}
                </DrawerContent>
            </Drawer>
        </>
    )
}

