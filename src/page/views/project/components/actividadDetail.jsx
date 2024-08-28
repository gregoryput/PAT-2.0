import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/components";
import { Inbox, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

/// esto sirver para darle formato a fecha con formatos "DD/MM/YYYY hh:mm:ss a" o mas complicados
dayjs.extend(customParseFormat);

export default function ActiividadDetail({ activo, selectedActividad }) {

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }

    console.log(selectedActividad)
    return (
        <>
            {
                selectedActividad?.responsableAuthor !== undefined  ?
                    <>
                        <div
                            className={`bg-white  ${activo === true
                                ? "w-[360px] h-full border-r px-2 relative visible "
                                : " h-full border-r px-2 relative  hidden "
                                } `}
                        >
                            <div className="p-3 border-b h-[65px] flex justify-between items-center">
                                <span className=" font-bold text-[18px]">Actividad </span>
                            </div>
                            <div className="border-b  relative  text-[12px] p-1 ">
                                <h2 className="mt-2 mb-3 font-bold">
                                    {truncateText(selectedActividad?.title?.toUpperCase(), 90)}
                                </h2>
                                {selectedActividad?.description == "undefined" ? null : (
                                    <div>
                                        <Popover>
                                            <PopoverTrigger className="font-semibold">
                                                Descripcion
                                            </PopoverTrigger>
                                            <PopoverContent><p className="text-justify text-[12px]">{selectedActividad?.description}</p></PopoverContent>
                                        </Popover>

                                    </div>

                                )}

                                <div>
                                    <p className=" font-semibold mt-1">
                                        Editor{" "}
                                        <span className="text-gray-500">{selectedActividad?.author}</span>
                                    </p>
                                    <p className=" font-semibold">
                                        Resposanble{" "}
                                        <span className="text-gray-500">
                                            {selectedActividad?.responsableAuthor}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mt-2 gap-2 flex-wrap  ">
                                    <p className=" font-bold">
                                        Inicio{" "}
                                        <span className="text-gray-500">
                                            {dayjs(
                                                selectedActividad?.fechaInicio,
                                                "DD/MM/YYYY hh:mm:ss a"
                                            ).format("DD-MM-YYYY")}
                                        </span>
                                    </p>
                                    <p className=" font-bold">
                                        Estimado{" "}
                                        <span className="text-gray-500">
                                            {dayjs(
                                                selectedActividad?.fechaFinal,
                                                "DD/MM/YYYY hh:mm:ss a"
                                            ).format("DD-MM-YYYY")}
                                        </span>
                                    </p>
                                    {selectedActividad?.status == 2 ? (
                                        <>
                                            <p className=" font-bold">
                                                Finalizado{" "}
                                                <span className="text-gray-500">
                                                    {dayjs(
                                                        selectedActividad?.fechaTerminacion,
                                                        "DD/MM/YYYY hh:mm:ss a"
                                                    ).format("DD-MM-YYYY")}
                                                </span>
                                            </p>
                                        </>
                                    ) : null}
                                </div>

                            </div>
                            <ScrollArea className="min-h-[35vh] h-[40vh] max-h-[45vh]">
                                {selectedActividad?.listaComentario == undefined || selectedActividad?.listaComentario?.length == 0 ? <>
                                    <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                                        <Inbox width={50} />
                                        <p className="text-[13px]">Sin comentarios</p>
                                    </div>
                                </> : <>
                                    {selectedActividad?.listaComentario?.map((data) => (
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
                            <div className="w-full absolute bottom-2 pr-3  flex">
                                <Button variant="ghost" className=" pr-4 w-16 active:text-red-700">
                                    <Trash2 width={20} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-52  active:bg-blue-700 active:text-white"
                                >
                                    Editar Actividad
                                </Button>
                            </div>
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
