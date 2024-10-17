import { fetcher } from "@/api/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";
import useProject from "@/hook/useProject";
import dayjs from "dayjs";
import { Edit2, EllipsisVertical, Inbox, Loader2, SendHorizontal, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Img } from "react-image";
import useSWR, { mutate } from "swr";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/config/axios";
import { useForm } from "react-hook-form";


export default function ComentarioGalerias() {
    const { project } = useProject();

    const { data: commentario, isLoading } = useSWR(
        `/Comentary/getCommentaries?idProjectSap=${project.projectId}`,
        fetcher,

        { refreshInterval: false, revalidateOnFocus: true }
    );
    const { data: Media } = useSWR(
        `Activities/getListMedia?projectIdSap=${project.projectId}`,
        fetcher,

        { refreshInterval: false, revalidateOnFocus: true }
    );
    const [state, setState] = useState(1)
    const [Messenger, setMessenger] = useState(null)
    const [edit, setEdit] = useState(null)

    const {
        register,
        handleSubmit,
        reset,
        setValue,

        formState: { errors },
    } = useForm();

    const menssegerEdit = async (data) => {
        const { data: response } = await axiosClient.api().post(`/Comentary/modifyCommentary`, data);
        return response;
    };
    const mutationEdit = useMutation({
        mutationFn: menssegerEdit,
        onSuccess: () => {
            mutate(`/Comentary/getCommentaries?idProjectSap=${project.projectId}`, null, true);
        },

    });

    const menssegerRemover = async (data) => {
        const { data: response } = await axiosClient.api().delete(`/Comentary/deleteCommentaries?commentaryId=${data}`);
        return response;
    };

    const mutationRemover = useMutation({
        mutationFn: menssegerRemover,
        onSuccess: () => {
            mutate(`/Comentary/getCommentaries?idProjectSap=${project.projectId}`, null, true);
        },

    });


    const sendMensseger = async (data) => {
        const { data: response } = await axiosClient.api().post('/Comentary/addCommentaries', data);
        return response;
    };

    const mutationSend = useMutation({
        mutationFn: sendMensseger,
        onSuccess: () => {
            mutate(`/Comentary/getCommentaries?idProjectSap=${project.projectId}`, null, true);
        },

    });


    const onSubmit = async (value) => {



        if (edit) {
            let JsonEdit = {
                descripcion: value.Mesaje,
                commentaryId: edit?.comentarioId,
                ProjectoIdSap: project.projectId
            }
            await mutationEdit.mutateAsync(JsonEdit).then(
                setEdit(null)
            )

        } else {
            let Json = {
                commentaryId: value.comentarioId || 0,
                descripcion: value.Mesaje,
                projectoIdSap: project.projectId
            }
            await mutationSend.mutateAsync(Json)
        }
        reset();
    };

    const handlerRemover = async (idComenetario) => {
        await mutationRemover.mutateAsync(idComenetario)
    }

    const EditMensseger = (data) => {
        setValue('Mesaje', data?.descripcion);
        setEdit(data)
    }


    useEffect(() => {
        setMessenger(commentario)
    })



    if (isLoading)
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-700 " />
            </div>
        );


    return (
        <>
            <section className="w-[50%] border-x">
                <div className=" h-full border-r pr-2 relative bg-white">
                    <div className="p-3 border-b  flex justify-between items-center">
                        <Tabs defaultValue="1"  >
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="1" onClick={() => setState(1)} >Comentarios</TabsTrigger>
                                <TabsTrigger value="2" onClick={() => setState(2)}>Galeria</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {state == 1 ? <>
                        {
                            Messenger?.length == 0 ? <>
                                <div className="flex flex-col h-[79%] justify-center items-center text-gray-500">
                                    <Inbox width={50} />
                                    <p className="text-[13px]">Sin comentarios</p>
                                </div>
                                <>
                                    {errors.Mesaje && (
                                        <p className="text-red-500 text-[9px] ml-5">{errors.Mesaje.message}</p>
                                    )}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="px-4 gap-3 flex items-center mt-2">
                                            <Input
                                                id="Mesaje"
                                                placeholder="Nuevo comentario"
                                                type="text"
                                                {...register("Mesaje", {
                                                    required: "Este campo es obligatorio", // Mensaje de error para el campo requerido
                                                    maxLength: {
                                                        value: 200,
                                                        message: "El valor máximo permitido es 200 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "El valor mínimo permitido es 3 caracteres",
                                                    },
                                                })}

                                            />
                                            <button type="submit" className="bg-blue-500 rounded-full text-blue-50 p-2 cursor-pointer">
                                                <SendHorizontal width={20} height={20} />
                                            </button>
                                        </div>

                                    </form>
                                </>

                            </> : <>
                                <ScrollArea className="h-[58vh]">
                                    <>
                                        {Messenger?.map((data) => (
                                            <div
                                                key={data.comentarioId}
                                                className="  mt-3 rounded-lg p-3 text-gray-600 text-[12px]"
                                            >
                                                <div className="flex  justify-between items-center">
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <div className="w-6 h-6 bg-red-300 rounded-full flex items-center justify-center">
                                                            <p className="text-white font-bold text-[10px]">{data?.nombreCompleto?.slice(0, 1)}</p>
                                                        </div>
                                                        <p className="font-bold">{data.nombreCompleto}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <p className="font-extralight text-[11px]">
                                                            {dayjs(data.fechaPublicada).format("DD-MM-YYYY")}
                                                        </p>
                                                        <div className=" cursor-pointer">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <EllipsisVertical width={15} />
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-15 absolute right-0">
                                                                    <DropdownMenuItem className="flex justify-between" onClick={() => EditMensseger(data)} >
                                                                        <p className="font-semibold">Editar</p>
                                                                        <Edit2 width={15} />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="flex justify-between" onClick={() => handlerRemover(data.comentarioId)}>
                                                                        <p className="font-semibold">Eliminar</p>
                                                                        <Trash width={15} />
                                                                    </DropdownMenuItem>



                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 border p-3 rounded-lg">
                                                    <p className="font-mono">{data.descripcion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </ScrollArea>
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {errors.Mesaje && (
                                            <p className="text-red-500 absolute bottom-2 text-[9px] ml-5 ">{errors.Mesaje.message}</p>
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
                                </>
                            </>
                        }
                        <div className="w-full absolute bottom-2  ">

                        </div>
                    </> :
                        <>

                            {
                                Media[0]?.mediaList == undefined ? <>
                                    <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                                        <Inbox width={50} />
                                        <p className="text-[13px]">Sin data</p>
                                    </div>
                                </> : <>
                                    <ScrollArea className="h-[60vh]">
                                        {Media?.flatMap(({ mediaList }) =>

                                            mediaList.map((d) => (
                                                <div
                                                    key={d?.galeriaId}
                                                    className="flex justify-center m-1 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Img
                                                        src={`http://uscldcomvmq01/PATAPI/api/Activities/getActivityMedia?mediaId=${d.galeriaId}`}
                                                        alt={d?.alt || "Descripción de la imagen"}
                                                        className="w-[200px] h-[200px] object-cover"
                                                    />
                                                </div>
                                            ))

                                        )}
                                    </ScrollArea>
                                </>
                            }
                        </>


                    }
                </div>
            </section>
        </>
    )
}



