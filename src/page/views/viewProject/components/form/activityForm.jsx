import { fetcher } from '@/api/api';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import { SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axiosClient from '@/config/axios';
import useProject from '@/hook/useProject';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { Calendar } from "@/components/ui/calendar"


export default function ActivityForm() {
    const { project } = useProject();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    let fecha = new Date();
    const [date1, setDate1] = useState(fecha);
    const [date2, setDate2] = useState(fecha);



    // // Función para prellenar el campo de nombre de forma programática
    // const handleSetName = () => {
    //     setValue('Presupuesto', data?.budget);
    //     setValue('Alcance', data?.alcance);
    //     setValue('Responsable', `${data?.responsableId}`);
    // };

    const { data: getUsuario, isLoading } = useSWR(
        `/Region/countryUser?idprojectSap=${project?.projectId}`,
        fetcher,
        { refreshInterval: false, revalidateOnFocus: false }
    );

    const { data: getTipo } = useSWR(
        `/Activities/getTipoActividadId`,
        fetcher,
        { refreshInterval: false, revalidateOnFocus: false }
    );



    const Insert = async (data) => {
        const { data: response } = await axiosClient.api().post('/Activities/addActivity', data);
        return response;
    };

    const mutationUpdate = useMutation({
        mutationFn: Insert,
        onSuccess: () => {
            // Actualizamos el estado local de SWR con los nuevos datos
            mutate(`Projects/indicadoresDeCostoByProjectIdSap?projectId=${project.projectId}&year=${project.year}`, null, true);

        },

    });

    const onSubmit = async (data) => {
        setIsSheetOpen(false); // Cierra el sheet manualmente
        let Json = {
            actividadId: 0,
            idProjectSap: project.projectId,
            title: data.Titulo,
            description: data.descripcion,
            author: 0,
            category: 0,
            endString: data.fechafinal,
            startString: data.fecha,
            usuarioIdResponsable: 0,
            comentary: null,
            file: null
        }
    };



    return (
        <>
            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen} >
                <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full " >Crear actividad</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Nueva actividad </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <p className="mb-3 mt-5">Actividad</p>
                                    <Input
                                        id="Titulo"
                                        type="text"
                                        {...register("Titulo", {
                                            required: "Este campo es obligatorio",
                                            max: {
                                                value: 100,
                                                message: "solo admiten 100 caracteres."
                                            }

                                        })}
                                    />
                                    {errors.Titulo && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Titulo.message}</p>
                                    )}
                                </div>
                                <div >
                                    <p className="mb-3 mt-10">Descripcion </p>

                                    <Textarea
                                        id="descripcion"
                                        type="text"
                                        {...register("descripcion", {
                                            required: "Este campo es obligatorio",
                                            max: {
                                                value: 100,
                                                message: "solo admiten 100 caracteres."
                                            }
                                        })}
                                        className="h-36"

                                    />
                                    {errors.descripcion && (
                                        <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
                                    )}
                                </div>

                                {
                                    isLoading == false ? <>
                                        <div>
                                            <p className="mb-3 mt-6">Responsable</p>
                                            <Controller
                                                name="Responsable"
                                                control={control}
                                                defaultValue="" // Valor inicial
                                                rules={{ required: "Este campo es obligatorio", }} // Validación
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
                                    </> : <>
                                        <div className="w-full h-full flex justify-center items-center">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-700 " />
                                        </div>
                                    </>
                                }

                                {
                                    isLoading == false ? <>
                                        <div>
                                            <p className="mb-3 mt-6">Categoria</p>
                                            <Controller
                                                name="Categoria"
                                                control={control}
                                                defaultValue="" // Valor inicial
                                                rules={{ required: "este campo es obligatorio" }} // Validación
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}  >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione una categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Categoria</SelectLabel>
                                                                {getTipo?.map((u) => (
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

                                            {errors.Categoria && (
                                                <p className="text-red-500 text-sm mt-1">{errors.Categoria.message}</p>
                                            )}
                                        </div>
                                    </> : <>
                                        <div className="w-full h-full flex justify-center items-center">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-700 " />
                                        </div>
                                    </>
                                }

                                <div className='flex  gap-10'>
                                    <div>
                                        <p className="mb-3 mt-6">Inicio</p>

                                        <Controller
                                            name="fecha"
                                            control={control}
                                            rules={{ required: "este campo es obligatorio" }} // Validación
                                            render={({ field }) => (
                                                <Select>
                                                    <SelectTrigger className="w-full">
                                                        <div className='flex items-center'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            <SelectValue placeholder={`${date1 ? format(date1, `dd-MM-yyyy`) : <span>Pick a date</span>}`}>
                                                            </SelectValue>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <Calendar
                                                                mode="single"
                                                                selected={date2}
                                                                onSelect={(selectedDate) => {
                                                                    setDate1(selectedDate); // Esto actualiza el estado local
                                                                    field.onChange(selectedDate); // Esto actualiza el valor en el controlador
                                                                }}
                                                            />
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}></Controller>
                                    </div>
                                    <div>
                                        <p className="mb-3 mt-6">Estimado </p>

                                        <Controller
                                            name="fechafinal"
                                            control={control}
                                            rules={{ required: "Este campo es obligatorio." }}
                                            render={({ field }) => (
                                                <Select>
                                                    <SelectTrigger className="w-full">
                                                        <div className='flex items-center'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            <SelectValue placeholder={`${date2 ? format(date2, `dd-MM-yyyy`) : <span>Pick a date</span>}`}>
                                                            </SelectValue>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <Calendar
                                                                mode="single"
                                                                selected={date2}
                                                                onSelect={(selectedDate) => {
                                                                    setDate2(selectedDate); // Esto actualiza el estado local
                                                                    field.onChange(selectedDate); // Esto actualiza el valor en el controlador
                                                                }}
                                                            />
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        ></Controller>
                                    </div>
                                </div>
                                <Button className="w-full mt-10" type="submit">Crear actividad</Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>

                </DialogContent>
            </Dialog>
        </>
    )
}
