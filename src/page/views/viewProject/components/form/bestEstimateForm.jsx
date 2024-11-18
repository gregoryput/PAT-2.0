import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input } from "@/components";
import axiosClient from "@/config/axios";
import useProject from "@/hook/useProject";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, Dices } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";



export default function BestEstimateForm({ data }) {
    const { project } = useProject();

    const mesesAbreviados = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const fechaFormateada = (data) => {
        const mesIndex = dayjs(data?.fecha).month(); // Obtiene el índice del mes (0-11)
        return mesesAbreviados[mesIndex].toLocaleUpperCase();
    };

    const [activo, setActivado] = useState(0);
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();

    const Insert = async (data) => {
        const { data: response } = await axiosClient.api().post('/Projects/modifyBestEstimate', data);
        return response;
    };

    const mutationInsert = useMutation({
        mutationFn: Insert,
        onSuccess: (() => {
            mutate(`Projects/indicadoresDeCostoByProjectIdSap?projectId=${project.projectId}&year=${project.year}`, null, true)

        })
    });

    const onSubmit = async (formData) => {

        const Json = {
            "bestEstimateId": activo?.bestEstimateId,
            "fecha": activo?.fecha,
            "estimated": formData?.estimated
        }
        await mutationInsert.mutateAsync([Json])
        reset();
    };

    // Manejador personalizado de envío
    const handleCustomSubmit = async () => {
        const isValid = await trigger(); // Dispara la validación manualmente

        if (isValid) {
            handleSubmit(onSubmit)(); // Si es válido, envía el formulario
        } else {
            console.log("Falló la validación del formulario:", errors); // Muestra los errores
        }
    };


    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="gap-5 rounded-sm bg-gray-100 hover:bg-green-600 hover:text-white">
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
                        {data?.map((data) => (
                            <div
                                key={data.bestEstimateId}
                                onClick={() => setActivado(data)}
                                className={`group border rounded-lg w-[250px] h-[90px] p-3 font-thin cursor-pointer hover:bg-orange-500 hover:text-white ${activo.bestEstimateId == data.bestEstimateId ? "bg-green-500 text-white" : ""}`}
                            >
                                <div className={`flex text-gray-500 gap-2 items-center group-hover:text-white ${activo.bestEstimateId == data.bestEstimateId ? " text-white" : ""}  `}>
                                    <Calendar width={18} />
                                    <p className="text-[15px]">{fechaFormateada(data)}</p>
                                </div>

                                {activo.bestEstimateId == data.bestEstimateId ? <>

                                    <form >
                                        <Input
                                            {...register("estimated", {
                                                required: "Este campo es obligatorio",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Solo se permiten números",
                                                },
                                            })}
                                            className="h-8 w-30 mt-2 text-orange-600"
                                            placeholder={`${data?.estimated}`}
                                        />

                                    </form>
                                </> : <p className="mt-3 text-[16px] ml-2"> $ {data?.estimated}</p>}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCustomSubmit} // Llama a nuestra función de envío personalizada
                            className="w-40 flex  mt-4 bg-green-500 text-white p-2 rounded"
                        >
                            Actualizar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
