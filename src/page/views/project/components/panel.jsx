import { Button, ScrollArea } from "@/components";
import { Bolt, ChartNoAxesColumnIncreasing } from "lucide-react";
import { useState } from "react";
import PropTypes from 'prop-types';
import dayjs from "dayjs";
import Dashboard from "./dashboard";


export default function Panel({ data, project, status }) {
    const [, setCopied] = useState(false);

    const handleCopyClick = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Restablece el estado después de 2 segundos
        } catch (err) {
            console.error("Error al copiar el texto: ", err);
        }
    };

    const filter = status?.filter((state) => state.value === data?.estadoProjectId) || 0;

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
                            <p className="text-justify font-extralight text-gray-400 mr-5">{data?.alcance}</p>
                        </ScrollArea>

                        <div className="flex text-gray-400 gap-2  text-[14px]">
                            <div className="mt-2 flex gap-2 ">
                                <span className="text-gray-700 font-bold">Real</span>
                                <p>{data?.lastUpdateReal ? dayjs(Date(data?.lastUpdateReal)).format('DD/MM/YY' ) : "N/A"}</p>
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
                        <div className="flex gap-4  py-2   text-gray-700 bg-gray-100 rounded-lg px-3 " >
                            <p className="font-semibold border-r border-gray-700 pr-2">Estado </p>
                            <p className="font-semibold"> {filter[0]?.label}</p>
                        </div>
                        <div className="flex gap-5">
                            <Button variant="ghost" className="gap-5 rounded-sm bg-gray-100  ">
                                Costo
                                <ChartNoAxesColumnIncreasing width={20} />
                            </Button>
                            <Button variant="ghost" className="gap-5  rounded-sm bg-gray-100 ">
                                Editar
                                <Bolt width={20} />
                            </Button>

                        </div>
                    </div>

                   <Dashboard data={data}/>
                </section>

            </div>
        </>
    )
}


Panel.propTypes = {
    data: PropTypes.shape({
        estadoProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombreProyecto: PropTypes.string.isRequired,
        alcance: PropTypes.string,
        lastUpdateReal: PropTypes.string,
        lastUpdateComprometido: PropTypes.string
    }).isRequired,
    project: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    status: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
};