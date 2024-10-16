import { fetcher } from '@/api/api';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
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
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [carga, setCarga] = useState(false);

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

    const  mutationInsert  = useMutation({
        mutationFn: Insert,
        onError: (() => {
            mutate(`/Activities/getActivityById?idProjectSap=${project.projectId}`, null, true)
            setCarga(false),
            setIsSheetOpen(false) // Cierra el sheet manualmente
        })
    });


    const onSubmit = async (data) => {
        let Json = {

            file: undefined,
            idProjectSap: project.projectId,
            title: data.Title,
            description: data.Description,
            author: data.Responsable,
            category: data.Category,
            endString: data.EndString,
            startString: data.StartString,
            usuarioIdResponsable: data.Responsable
        }
        setCarga(true)
        await mutationInsert.mutateAsync(Json)
    };



    return (

        <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen} >
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full " >Crear actividad</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                {carga == true ? <>
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-700 " />
                    </div>
                </> : <>
                    <DialogHeader>
                        <DialogTitle>Nueva actividad </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <p className="mb-3 mt-5">Actividad</p>
                                    <Input
                                        id="Title"
                                        type="text"
                                        {...register("Title", {
                                            required: "Este campo es obligatorio",
                                            max: {
                                                value: 100,
                                                message: "solo admiten 100 caracteres."
                                            }

                                        })}
                                    />
                                    {errors.Title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
                                    )}
                                </div>
                                <div >
                                    <p className="mb-3 mt-10">Descripcion </p>

                                    <Textarea
                                        id="Description"
                                        type="text"
                                        {...register("Description", {
                                            required: "Este campo es obligatorio",
                                            max: {
                                                value: 100,
                                                message: "solo admiten 100 caracteres."
                                            }
                                        })}
                                        className="h-36"

                                    />
                                    {errors.Description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
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
                                                name="Category"
                                                control={control}
                                                defaultValue="" // Valor inicial
                                                rules={{ required: "Este campo es obligatorio" }} // Validación
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

                                            {errors.Category && (
                                                <p className="text-red-500 text-sm mt-1">{errors.Category.message}</p>
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
                                            name="StartString"
                                            control={control}
                                            rules={{ required: "Este campo es obligatorio" }} // Validación
                                            render={({ field }) => (
                                                <Select>
                                                    <SelectTrigger className="w-full">
                                                        <div className='flex items-center'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            <SelectValue placeholder={`${date1 !== null ? format(date1, `dd-MM-yyyy`) : "Fecha Inicio"}`}>
                                                            </SelectValue>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <Calendar
                                                                mode="single"
                                                                selected={date1}
                                                                onSelect={(selectedDate) => {
                                                                    setDate1(selectedDate); // Esto actualiza el estado local
                                                                    field.onChange(selectedDate); // Esto actualiza el valor en el controlador
                                                                }}
                                                            />
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            )}></Controller>
                                        {errors.StartString && (
                                            <p className="text-red-500 text-sm mt-1">{errors.StartString.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-3 mt-6">Estimado </p>

                                        <Controller
                                            name="EndString"
                                            control={control}
                                            rules={{ required: "Este campo es obligatorio." }}
                                            render={({ field }) => (
                                                <Select>
                                                    <SelectTrigger className="w-full">
                                                        <div className='flex items-center'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            <SelectValue placeholder={`${date2 != null ? format(date2, `dd-MM-yyyy`) : "Fecha estimada"}`}>
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
                                        {errors.EndString && (
                                            <p className="text-red-500 text-sm mt-1">{errors.EndString.message}</p>
                                        )}
                                    </div>
                                </div>
                                <Button className="w-full mt-10" type="submit">Crear actividad</Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>

                </>}
            </DialogContent>
        </Dialog>


    )
}
