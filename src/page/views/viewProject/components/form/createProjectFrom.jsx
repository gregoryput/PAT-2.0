import { fetcher } from "@/api/api";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Sheet, SheetContent, SheetTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import useProject from "@/hook/useProject";



export default function CreateProjectForm() {
    const [openCreate, setOpenCreate] = useState(false);
    const { project } = useProject();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();


    const { data: dataPais } = useSWR("/Pais/Pais", fetcher);

    const { data: getUsuario } = useSWR(
        `/Region/countryUser?idprojectSap=C126003-24-C04`,
        fetcher,
        { refreshInterval: false, revalidateOnFocus: false }
    );

    const Insert = async (data) => {
        const { data: response } = await axiosClient.api().post('/Projects/addNewProject', data);
        return response;
    };

    const mutationInsert = useMutation({
        mutationFn: Insert,
        onSuccess: (() => {
            mutate(`Projects/indicadoresDeCostoByProjectIdSap?projectId=${project.projectId}&year=${project.year}`, null, true)
            reset();
            setOpenCreate(false)
        })
    });

    const onSubmit = async (value) => {

        let Json = {
            projectIdSap: value.CodigoSAP,
            projectNameSap: value.NombreProyecto,
            budget: value.Presupuesto,
            paisId: value.Pais,
            responsableId: value.Responsable,
            alcance: value.Descripcion,
            naturalezaId: value.Naturaleza
        }

        await mutationInsert.mutate(Json)


    };



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
                        <p className="mb-3 mt-5">Codigo SAP</p>
                        <Input
                            id="CodigoSAP"
                            type="text"
                            {...register("CodigoSAP", {
                                required: "Este campo es obligatorio",

                            })}
                        />
                        {errors.CodigoSAP && (
                            <p className="text-red-500 text-sm mt-1">{errors.CodigoSAP.message}</p>
                        )}
                    </div>
                    <div>
                        <p className="mb-3 mt-5">Nombre del proyecto</p>
                        <Input
                            id="NombreProyecto"
                            type="text"
                            {...register("NombreProyecto", {
                                required: "Este campo es obligatorio",

                            })}
                        />
                        {errors.NombreProyecto && (
                            <p className="text-red-500 text-sm mt-1">{errors.NombreProyecto.message}</p>
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
                    <div>
                        <p className="mb-3 mt-6">Responsable</p>
                        <Controller
                            name="Responsable"
                            control={control}
                            defaultValue="" // Valor inicial
                            rules={{ required: "Selecciona un usuario" }} // Validación
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}  >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Usuarios</SelectLabel>
                                            {getUsuario?.map((u) => (
                                                <SelectItem
                                                    className="flex flex-row"
                                                    key={u?.value}
                                                    value={`${u.value}`}
                                                >
                                                    {u?.label}
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


                    <div>
                        <p className="mb-3 mt-6">Pais</p>
                        <Controller
                            name="Pais"
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

                        {errors.Pais && (
                            <p className="text-red-500 text-sm mt-1">{errors.Pais.message}</p>
                        )}
                    </div>

                    <div>
                        <p className="mb-3 mt-6">Naturaleza</p>
                        <Controller
                            name="Naturaleza"
                            control={control}
                            defaultValue="" // Valor inicial
                            rules={{ required: "Selecciona una naturaleza" }} // Validación
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}  >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Naturaleza</SelectLabel>
                                            <SelectItem value="1">Plataforma</SelectItem>
                                            <SelectItem value="2">Estrategico</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}></Controller>

                        {errors.Naturaleza && (
                            <p className="text-red-500 text-sm mt-1">{errors.Naturaleza.message}</p>
                        )}
                    </div>
                    <div>
                        <p className="mb-3 mt-5">Descripcion</p>
                        <Textarea
                            id="Descripcion"
                            type="text"
                            {...register("Descripcion", {
                                required: "Este campo es obligatorio",
                            })}
                        />
                        {errors.Descripcion && (
                            <p className="text-red-500 text-sm mt-1">{errors.Descripcion.message}</p>
                        )}
                    </div>

                    <Button className=" absolute bottom-10 w-[300px] right-10" type="submit">Crear proyecto</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
