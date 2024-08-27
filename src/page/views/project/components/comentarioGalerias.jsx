import { ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";


export default function ComentarioGalerias() {
    return (
        <>
            <section className="w-[50%]">
                <div className=" h-full border-r pr-2 relative bg-white">
                    <div className="p-3 border-b  flex justify-between items-center">
                        <span className=" font-bold text-[18px]">Comentarios </span>
                        <Tabs bdefaultValue="1"  >
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="1" >Comentarios</TabsTrigger>
                                <TabsTrigger value="2" >Galeria</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <ScrollArea className="h-[60vh]">

                    </ScrollArea>
                    <div className="w-full absolute bottom-2  ">

                    </div>
                </div>
            </section>
        </>
    )
}
