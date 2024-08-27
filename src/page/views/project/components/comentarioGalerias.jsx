import { fetcher } from "@/api/api";
import { ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";
import useProject from "@/hook/useProject";
import dayjs from "dayjs";
import { Inbox, Loader2 } from "lucide-react";
import useSWR from "swr";


export default function ComentarioGalerias() {
    const { project } = useProject();
    const { data, isLoading } = useSWR(
        `/Comentary/getCommentaries?idProjectSap=${project.projectId}`,
        fetcher,

        { refreshInterval: false, revalidateOnFocus: true }
    );


    if (isLoading)
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-700 " />
            </div>
        );




    return (
        <>
            <section className="w-[50%]">
                <div className=" h-full border-r pr-2 relative bg-white">
                    <div className="p-3 border-b  flex justify-between items-center">
                        <Tabs defaultValue="1"  >
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="1" >Comentarios</TabsTrigger>
                                <TabsTrigger value="2" >Galeria</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <ScrollArea className="h-[60vh]">
                        {data == undefined ? <>
                            <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                                <Inbox width={50} />
                                <p>Sin Comenetarios</p>
                            </div>
                        </> : <>
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
                        </>}
                    </ScrollArea>
                    <div className="w-full absolute bottom-2  ">

                    </div>
                </div>
            </section>
        </>
    )
}
