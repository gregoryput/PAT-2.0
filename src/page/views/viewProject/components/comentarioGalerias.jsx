import { fetcher } from "@/api/api";
import { ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";
import useProject from "@/hook/useProject";
import dayjs from "dayjs";
import { Inbox, Loader2 } from "lucide-react";
import { useState } from "react";
import { Img } from "react-image";
import useSWR from "swr";


export default function ComentarioGalerias() {
    const { project } = useProject();
    const { data, isLoading } = useSWR(
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
                            data?.length == 0 ? <>
                                <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                                    <Inbox width={50} />
                                    <p className="text-[13px]">Sin comentarios</p>
                                </div>
                            </> : <>
                                <ScrollArea className="h-[60vh]">
                                    <>
                                        {data?.map((data) => (
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
                                                    <p className="font-extralight text-[11px]">
                                                        {dayjs(data.fechaPublicada).format("DD-MM-YYYY")}
                                                    </p>
                                                </div>
                                                <div className="mt-4 border p-3 rounded-lg">
                                                    <p className="font-mono">{data.descripcion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </ScrollArea>
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
