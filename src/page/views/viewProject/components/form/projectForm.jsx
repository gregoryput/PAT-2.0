import { Button, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Sheet, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components";
import { Textarea } from "@/components/ui/textarea";
import { Bolt, Loader2, } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/config/axios";


export default function ProjectForm({ data, project }) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

   

    // Función para prellenar el campo de nombre de forma programática
    const handleSetName = () => {
        setValue('Presupuesto', data?.budget);
        setValue('Alcance', data?.alcance);
        setValue('Responsable', `${data?.responsableId}`);
    };

    const { data: getUsuario, isLoading } = useSWR(
        `/Region/countryUser?idprojectSap=${project?.projectId}`,
        fetcher,
        { refreshInterval: false, revalidateOnFocus: false }
    );



    const update = async (data) => {
        const { data: response } = await axiosClient.api().post('/NewProject/NewEditProject', data);
        return response;
    };

    const mutationUpdate = useMutation({
        mutationFn: update,
        onSuccess: () => {
            // Actualizamos el estado local de SWR con los nuevos datos
            mutate(`Projects/indicadoresDeCostoByProjectIdSap?projectId=${project.projectId}&year=${project.year}`, null, true);

        },

    });

    const onSubmit = async (data) => {
        setIsSheetOpen(false); // Cierra el sheet manualmente
        let Json = {

            projectIdSap: project?.projectId,
            budget: data.Presupuesto,
            responsableId: data.Responsable,
            alcance: data.Alcance

        };

         await mutationUpdate.mutateAsync(Json);
    };



    return (

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} >
            <SheetTrigger asChild>
                <Button onClick={() => { setIsSheetOpen(true), handleSetName() }} variant="ghost" className="gap-5  rounded-sm bg-gray-100 hover:bg-blue-600 hover:text-white">
                    <Bolt width={20} />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Editar proyecto</SheetTitle>
                    <SheetDescription>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <p className="mb-3 mt-5">Presupuesto</p>
                                <Input
                                    id="Presupuesto"
                                    type="text"
                                    {...register("Presupuesto", {
                                        required: true,
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
                            <div >
                                <p className="mb-3 mt-10">Alcance del proyecto</p>

                                <Textarea
                                    id="Alcance"
                                    type="text"
                                    {...register("Alcance", { required: true })}
                                    className="h-56"

                                />
                                {errors.Alcance && (
                                    <p className="text-red-500 text-sm mt-1">error</p>
                                )}
                            </div>

                            {
                                isLoading == false ? <>
                                    <div>
                                        <p className="mb-3 mt-6">Responsable del proyecto</p>
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

                                        {errors.fruit && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fruit.message}</p>
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
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}


ProjectForm.propTypes = {

    status: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    filter: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })),

    data: PropTypes.arrayOf(
        PropTypes.shape({
            budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            alcance: PropTypes.string.isRequired,
        })),

};