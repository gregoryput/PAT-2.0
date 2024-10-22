import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { AlarmClock, Edit2, EllipsisVertical, Inbox, Trash } from "lucide-react";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ActivityForm from "./form/activityForm";
import useActividadStatus from "@/hook/useActivida";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/config/axios";
import useSWR, { mutate } from "swr";
import useProject from "@/hook/useProject";
import { fetcher } from "@/api/api";
import useSelectedActividad from "@/hook/useSelectedActividad";
import { useState } from "react";
import useActiveSearch from "@/hook/useActiveSearch";
import ActiividadDetail from "./actividadDetail";


/// esto sirver para darle formato a fecha con formatos "DD/MM/YYYY hh:mm:ss a" o mas complicados
dayjs.extend(customParseFormat);

export default function Actividad({ toggleActivoForFalse }) {
  const { valor, setValor } = useActividadStatus();
  const {actividad, setActividad} = useSelectedActividad();
  const { project } = useProject();
  const [ediOpen, setEditOpen] = useState(false);
  const [id, setId] = useState(null);
  const { activo, } = useActiveSearch();

  const { data: getActivity } = useSWR(`/Activities/getActivityById?idProjectSap=${project.projectId}`, fetcher, { refreshInterval: false, revalidateOnFocus: false })


      const calcularDiasRestantes = (fechaInicio, fechaFin) => {
        const hoy = dayjs(); // Hoy es 16-10-2024 en este ejemplo

        const inicio = dayjs(fechaInicio, "DD-MM-YYYY");
        const fin = dayjs(fechaFin, "DD-MM-YYYY");

        if (hoy.isBefore(inicio)) {

          return <p className="text-orange-500 flex items-center gap-1">{`La tarea aún no ha comenzado. Faltan ${hoy.diff(inicio, 'day')}`}<AlarmClock strokeWidth={1.25} width={14} /></p>
        } else if (hoy.isAfter(fin)) {
          return <p className="text-red-500 flex items-center gap-1">{`La tarea está atrasada por ${fin.diff(hoy, 'day')} días.`}<AlarmClock strokeWidth={1.25} width={14} /></p>
        } else {
          return <p className="text-green-500 flex items-center gap-1">{`Quedan ${fin.diff(hoy, 'day')} días para completar la tarea.`}<AlarmClock strokeWidth={1.25} width={14} /></p>
        }
      };

      const actividadRemover = async (data) => {
        const { data: response } = await axiosClient.api().put(`/Activities/deleteActivity?idActivity=${data.actividadId}`);
        return response;
      };


      const mutationRemover = useMutation({
        mutationFn: actividadRemover,
        onSuccess: (() => {
          mutate(`/Activities/getActivityById?idProjectSap=${project.projectId}`, null, true)
        })

      });

      const Remover = async (data) => {
        await mutationRemover.mutateAsync(data)
      }

      


     
    
   

     

  return (
    <>
      <div className="w-[350px] h-full border-r pr-2 relative bg-white">
        <div className="p-3 border-b  flex justify-between items-center">
          <span className=" font-bold text-[18px]">Actividades </span>
          <Tabs defaultValue="1"   >
            <TabsList className="bg-gray-100 ">
              <TabsTrigger value="1" onClick={() => setValor(1)}>Pendiente</TabsTrigger>
              <TabsTrigger value="2" onClick={() => setValor(2)}>Completa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {
          getActivity?.length == 0 ?
            <div className="flex flex-col h-64 justify-center items-center text-gray-500">
              <Inbox width={50} />
              <p>Sin data</p>
            </div> :
            <>
              <ScrollArea className="h-[60vh]">
                {getActivity?.filter((state) => state.status === valor).length > 0 ? (
                  getActivity
                    ?.filter((state) => state.status === valor)
                    .map((data, i) => (
                      <div
                        key={i}
                        className={`${actividad?.actividadId === data?.actividadId
                          ? "m-1 border mb-2 p-3 cursor-pointer rounded-sm bg-gray-100"
                          : "m-1 border mb-2 p-3 cursor-pointer rounded-sm hover:bg-blue-50"
                          }`}
                        onClick={() => {
                          setActividad(data);
                          setId(data.actividadId)
                          toggleActivoForFalse();
                        }}
                      >
                        <div className="flex justify-between w-full">
                          <p className="font-semibold text-wrap text-[12px] text-black">
                            {data.title.toUpperCase()}
                          </p>
                          <div className=" cursor-pointer">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <EllipsisVertical width={15} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-15 absolute right-0">
                                <DropdownMenuItem className="flex justify-between"  onClick={()=> {setEditOpen(true),  setActividad(data)}}>
                                  <p className="font-semibold">Editar</p>
                                  <Edit2 width={15} />
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex justify-between" onClick={() => {Remover(data),toggleActivoForFalse()}  } >
                                  <p className="font-semibold">Eliminar</p>
                                  <Trash width={15} />
                                </DropdownMenuItem>



                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="font-light text-gray-400 text-[12px]">{data.responsableAuthor}</p>
                        <div className="mt-2 gap-3">
                          <p className="font-semibold text-[12px] mt-2">{data.category}</p>

                          {data?.status === 1 && (
                            <p className="text-[12px] flex items-center gap-1">
                              {calcularDiasRestantes(data?.fechaInicio, data?.fechaFinal)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col h-64 justify-center items-center text-gray-500">
                    <Inbox width={50} />
                    <p>Sin data</p>
                  </div>
                )}
              </ScrollArea>

            </>
        }
        <div className="w-full absolute bottom-2 pr-3 ">
          <ActivityForm  ediOpen={ediOpen} setEditOpen={setEditOpen} />
        </div>
      </div>
      <ActiividadDetail activo={activo} getActivity={getActivity} id={id}/>
    </>
  )
}



Actividad.propTypes = {
  actividad: PropTypes.arrayOf(
    PropTypes.shape({
      actividadId: PropTypes.number,
      title: PropTypes.string,
      author: PropTypes.string,
      category: PropTypes.string,
    })
  ),
  selectedActividad: PropTypes.shape({
    actividadId: PropTypes.number,
    title: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
  }),
  setSelectedActividad: PropTypes.func.isRequired,
  setStatusActividad: PropTypes.func.isRequired,
  toggleActivoForFalse: PropTypes.func.isRequired
};
