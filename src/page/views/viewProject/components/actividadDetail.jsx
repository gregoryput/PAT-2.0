import { Button, Input, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/components";
import { CalendarCheck, Inbox, SendHorizontal } from "lucide-react";
import PropTypes from "prop-types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import axiosClient from "@/config/axios";
import useProject from "@/hook/useProject";
import  { mutate } from "swr";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import useSelectedActividad from "@/hook/useSelectedActividad";

/// esto sirver para darle formato a fecha con formatos "DD/MM/YYYY hh:mm:ss a" o mas complicados
dayjs.extend(customParseFormat);

export default function ActiividadDetail({ activo,getActivity ,id}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { project } = useProject();
    const {actividad, setActividad} = useSelectedActividad();


   

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }

    const UpdateStatus = async (data) => {
        const { data: response } = await axiosClient.api().post('/NewActivity/NewActivityStatus', data);
        return response;
    };

    const mutationUpdateStatus = useMutation({
        mutationFn: UpdateStatus,
        onSuccess: () => {
            mutate(`/Activities/getActivityById?idProjectSap=${project.projectId}`, null, true)

        },

    })

    const SendMessenger = async (data) => {
        const { data: response } = await axiosClient.api().post('/NewActivity/NewActivityComment', data);
        return response;
    };

    const mutationInsertMessenger = useMutation({
        mutationFn: SendMessenger,
        onSuccess: () => {
            mutate(`/Activities/getActivityById?idProjectSap=${project.projectId}`, null, true)
        },

    })


      
    const onSubmit = async (value) => {

        const Json = {
            actividadId: actividad?.actividadId,
            commentary: value.Mesaje,
            usuario: 2

        }

        mutationInsertMessenger.mutateAsync(Json)
        reset();
        
    };

    const handlerStatus = async () => {
        let Json = {
            "actividadId": parseInt(actividad?.actividadId),
            "idProjectSap": project?.projectId
        }
        if (actividad?.status == 1) {
            await mutationUpdateStatus.mutateAsync(Json)
        }

    }



    useEffect(() => {
      
        setActividad(getActivity?.filter((x)=> x.actividadId === id)[0])
      }, [getActivity]);


    return (
        <>
            {
                actividad?.responsableAuthor !== undefined ?
                    <>
                        <div
                            className={`bg-white  ${activo === true
                                ? "w-[360px] h-full border-r px-2 relative visible "
                                : " h-full border-r px-2 relative  hidden "
                                } `}
                        >
                            <div className="p-3 border-b h-[65px] flex justify-between items-center">
                                <span className=" font-bold text-[18px]">Actividad </span>
                                <div className="flex">
                                    <Button variant="ghost" className={`gap-4 text-gray-500 ${actividad.status == 1 ? "hover:text-white hover:bg-blue-500" : " text-white bg-green-500"} `} onClick={() => handlerStatus()}>
                                        {actividad.status == 1 ? "Incompleta" : "Completa"}
                                        <CalendarCheck />
                                    </Button>
                                </div>
                            </div>
                            <div className="border-b  relative  text-[12px] p-1  h-[24%]">
                                <h2 className="mt-2 mb-3 font-bold">
                                    {truncateText(actividad?.title?.toUpperCase(), 90)}
                                </h2>
                                {actividad?.description == "undefined" ? null : (
                                    <div>
                                        <Popover>
                                            <PopoverTrigger className="font-semibold">
                                                <Button  variant="ghost" className="h-7">
                                                    Descripcion...
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent><p className="text-justify text-[12px]">{actividad?.description}</p></PopoverContent>
                                        </Popover>

                                    </div>

                                )}

                                <div>
                                    <p className=" font-semibold mt-1">
                                        Editor{" "}
                                        <span className="text-gray-500">{actividad?.author}</span>
                                    </p>
                                    <p className=" font-semibold">
                                        Resposanble{" "}
                                        <span className="text-gray-500">
                                            {actividad?.responsableAuthor}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mt-2 gap-2 flex-wrap  ">
                                    <p className=" font-bold">
                                        Inicio{" "}
                                        <span className="text-gray-500">
                                            {dayjs(
                                                actividad?.fechaInicio,
                                                "DD/MM/YYYY hh:mm:ss a"
                                            ).format("DD-MM-YYYY")}
                                        </span>
                                    </p>
                                    <p className=" font-bold">
                                        Estimado{" "}
                                        <span className="text-gray-500">
                                            {dayjs(
                                                actividad?.fechaFinal,
                                                "DD/MM/YYYY hh:mm:ss a"
                                            ).format("DD-MM-YYYY")}
                                        </span>
                                    </p>
                                    {actividad?.status == 2 ? (
                                        <>
                                            <p className=" font-bold">
                                                Finalizado{" "}
                                                <span className="text-gray-500">
                                                    {dayjs(
                                                        actividad?.fechaTerminacion,
                                                        "DD/MM/YYYY hh:mm:ss a"
                                                    ).format("DD-MM-YYYY")}
                                                </span>
                                            </p>
                                        </>
                                    ) : null}
                                </div>

                            </div>
                            <ScrollArea className="min-h-[35vh] h-[41vh] max-h-[45vh]">
                                {actividad?.listaComentario == undefined || actividad?.listaComentario?.length == 0 ? <>
                                    <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                                        <Inbox width={50} />
                                        <p className="text-[13px]">Sin comentarios</p>
                                    </div>
                                </> : <>
                                    {actividad?.listaComentario?.map((data) => (
                                        <div
                                            key={data.comentarioId}
                                            className="  mt-3 rounded-lg p-3 text-gray-600 text-[12px]"
                                        >
                                            <div className="flex  justify-between items-center">
                                                <div className="flex gap-2 justify-center items-center">
                                                    <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
                                                        <p className="text-white font-bold text-[10px]">{data?.nombreCompleto?.slice(0, 1)}</p>
                                                    </div>
                                                    <p className="font-bold">{data.nombreCompleto}</p>
                                                </div>
                                                <p className="font-extralight text-[11px]">
                                                    {dayjs(data.fechaPublicada).format("DD-MM-YYYY")}
                                                </p>
                                            </div>
                                            <div className="mt-4 border p-3 rounded-lg">
                                                <p className="font-mono ">{data.descripcion}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>}
                            </ScrollArea>
                            {actividad?.status == 1 ? <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {errors.Mesaje && (
                                        <p className="text-red-500 absolute bottom-1 text-[9px] ml-5 ">{errors.Mesaje.message}</p>
                                    )}
                                    <div className="px-4 gap-3 flex items-center mt-2">
                                        <Input
                                            id="Mesaje"
                                            placeholder="Nuevo comentario"
                                            type="text"
                                            {...register("Mesaje", {
                                                required: "Este campo es obligatorio",
                                                maxLength: {
                                                    value: 200,
                                                    message: "El valor máximo permitido es 200 caracteres",
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message: "El valor mínimo permitido es 10 caracteres",
                                                },
                                            })}
                                        />
                                        <button type="submit" className="bg-blue-500 rounded-full text-blue-50 p-2 cursor-pointer">
                                            <SendHorizontal width={20} height={20} />
                                        </button>
                                    </div>

                                </form>
                            </> : <></>}
                        </div>
                    </> :
                    null
            }
        </>
    );
}

ActiividadDetail.propTypes = {
    activo: PropTypes.bool.isRequired,
    selectedActividad: PropTypes.shape({
        title: PropTypes.string,
        author: PropTypes.string,
        status: PropTypes.number,
        description: PropTypes.string,
        responsableAuthor: PropTypes.string,
        fechaInicio: PropTypes.string,
        fechaFinal: PropTypes.string,
        fechaTerminacion: PropTypes.string,
        listaComentario: PropTypes.arrayOf(
            PropTypes.shape({
                comentarioId: PropTypes.number.isRequired,
                nombreCompleto: PropTypes.string.isRequired,
                fechaPublicada: PropTypes.string.isRequired,
                descripcion: PropTypes.string.isRequired,
            })
        ),
    }),
};
