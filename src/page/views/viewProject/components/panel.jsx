import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, ScrollArea } from "@/components";

import {  useLayoutEffect, useState } from "react";
import dayjs from "dayjs";
import Dashboard from "./dashboard";
import ProjectForm from "./form/projectForm";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/config/axios";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/api/api";
import useProject from "@/hook/useProject";
import Costo from "./Costo";


export default function Panel({ data }) {
    const {project} = useProject()
    const [, setCopied] = useState(false);
    const handleCopyClick = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar el texto: ", err);
        }
    };

    //estado actual del proyecto 
    const { data: status } = useSWR('Projects/statusProject', fetcher, {
        refreshInterval: false,
        revalidateOnFocus: false
    });

    ///lista de estado de proyecto  
    const { data: getStatus } = useSWR(`/NewProject/NewGetStatusProject?projectIdSap=${project?.projectId}`, fetcher, {
        refreshInterval: false,
        revalidateOnFocus: false,
        
    });

    /// estado local 

    const [localStatus, setLocalStatus] = useState(null);

    useLayoutEffect(() => {
        setLocalStatus(getStatus)
    })


    const update = async (data) => {
        const { data: response } = await axiosClient.api().post('/NewProject/NewStatusProject', data);
        return response;
    };

    const mutationUpdateStatus = useMutation({
        mutationFn: update,
        onSuccess: (data) => {
            // Actualizamos el estado local de SWR con los nuevos datos
            mutate(`/NewProject/NewGetStatusProject?projectIdSap=${project?.projectId}`, data, true);

        },

    });

    const handleUpdateStatus = async (value) => {
        let Json = {
            projectIdSap: project.projectId,
            estadoProject: value
        };

        await mutationUpdateStatus.mutateAsync(Json);

    };




    return (
        <>
            <div className="w-full flex min-h-[150px] h-[20%] border-b py-1 ">
                <section className=" h-full w-[40%] flex ">
                    <div className="flex flex-col">
                        <div>
                            <p className="font-bold text-[20px] text-wrap ">{data?.nombreProyecto.toUpperCase()}</p>
                            <div>
                                <p onClick={() => handleCopyClick(project?.projectId)} className="text-justify  font-semibold text-gray-400 mr-5 mb-3 cursor-pointer">{project?.projectId}</p>
                            </div>
                        </div>
                        <ScrollArea className="w-full min-h-[20px] max-h-[96px] mb-1">
                            <p className="text-justify font-extralight text-gray-500 mr-5">{data?.alcance}</p>
                        </ScrollArea>

                        <div className="flex text-gray-400 gap-2  text-[14px]">
                            <div className="mt-2 flex gap-2 ">
                                <span className="text-gray-700 font-bold">Real</span>
                                <p>{data?.lastUpdateReal ? dayjs(Date(data?.lastUpdateReal)).format('DD/MM/YY') : "N/A"}</p>
                            </div>
                            <div className="mt-2 flex gap-2  ">
                                <span className="text-gray-700 font-bold">Comprometido</span>
                                <p>{data?.lastUpdateComprometido !== "N/A" ? dayjs(Date(data?.lastUpdateComprometido)).format('DD/MM/YY') : "N/A"}</p>
                            </div>
                        </div>

                    </div>
                </section>
                <section className=" h-full w-[60%] flex flex-col ">
                    <div className=" w-full h-[50px] flex justify-between items-center mb-5 px-5">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`flex gap-4  py-2 ${localStatus?.estadoDeProjectoId == "2" ? "bg-green-500" : localStatus?.estadoDeProjectoId == "1" ? "bg-orange-500" : localStatus?.estadoDeProjectoId == "3" ? "bg-red-500" : null}  text-white  rounded-lg px-3 hover:bg-slate-200 hover:text-black`} >
                                    <p className="font-semibold border-r border-white pr-2">Estado </p>
                                    <p className="font-semibold"> {localStatus?.descripcion}</p>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {status?.map((estado) => (
                                    <DropdownMenuItem key={estado?.value} onClick={() => handleUpdateStatus(estado?.value)}>
                                        <p className="font-semibold">{estado?.label}</p>
                                    </DropdownMenuItem>
                                ))}

                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex gap-5">
                            <Costo/>
                            <ProjectForm  data={data} project={project} />
                        </div>
                    </div>

                    <Dashboard data={data} />
                </section>

            </div>
        </>
    )
}


