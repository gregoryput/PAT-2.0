import { fetcher } from "@/api/api";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Sheet, SheetContent, SheetTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";



export default function CreateProjectForm() {
    const [openCreate, setOpenCreate] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();


    const { data: dataPais, isLoading } = useSWR("/Pais/Pais", fetcher);

    const onSubmit = async (value) => {
        console.log(value)

    };

    console.log(dataPais)


    return (
        <Sheet open={openCreate} onOpenChange={setOpenCreate}>
            <SheetTrigger asChild>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            className="w-full mb-5 text-gray-400 flex justify-center group-hover:justify-start transition-all duration-300 ease-in-out"
                            onClick={() => setOpenCreate(true)} // Agrega el cambio de estado aquí
                        >
                            <Plus size={25} strokeWidth={2} className="flex-shrink-0" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className="p-2 rounded shadow-lg"
                    >
                        <p>Nuevo proyecto</p>
                    </TooltipContent>
                </Tooltip>
            </SheetTrigger>
            <SheetContent side="left" >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <p className="mb-3 mt-5">CodigoSAP</p>
                        <Input
                            id="CodigoSAP"
                            type="text"
                            {...register("CodigoSAP", {
                                required: "Este campo es obligatorio",
                               
                            })}
                        />
                        {errors.Presupuesto && (
                            <p className="text-red-500 text-sm mt-1">{errors.Presupuesto.message}</p>
                        )}
                    </div>
                    <div>
                        <p className="mb-3 mt-5">Nombre del proyecto</p>
                        <Input
                            id="CodigoSAP"
                            type="text"
                            {...register("CodigoSAP", {
                                required: "Este campo es obligatorio",
                               
                            })}
                        />
                        {errors.Presupuesto && (
                            <p className="text-red-500 text-sm mt-1">{errors.Presupuesto.message}</p>
                        )}
                    </div>

                    <div>
                        <p className="mb-3 mt-5">Presupuesto</p>
                        <Input
                            id="Presupuesto"
                            type="text"
                            {...register("Presupuesto", {
                                required: "Este campo es obligatorio",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Solo se permiten números",
                                },
                            })}
                        />
                        {errors.Presupuesto && (
                            <p className="text-red-500 text-sm mt-1">{errors.Presupuesto.message}</p>
                        )}
                    </div>

                    {
                        isLoading == false ? <>
                            <div>
                                <p className="mb-3 mt-6">Pais</p>
                                <Controller
                                    name="Responsable"
                                    control={control}
                                    defaultValue="" // Valor inicial
                                    rules={{ required: "Selecciona el pais" }} // Validación
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}  >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccione el pais" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Pais</SelectLabel>
                                                    {dataPais?.map((u) => (
                                                        <SelectItem
                                                            className="flex flex-row"
                                                            key={u?.paisID}
                                                            value={`${u.paisID}`}
                                                        >
                                                            {u?.descripcion}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}></Controller>

                                {errors.Responsable && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Responsable.message}</p>
                                )}
                            </div>
                        </> : <>
                            <div className="w-full h-full flex justify-center items-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-700 " />
                            </div>
                        </>
                    }
                    <Button className=" absolute bottom-10 w-[300px] right-10" type="submit">Actualizar</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
