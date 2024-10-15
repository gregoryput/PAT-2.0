import { ScrollArea, Tabs, TabsList, TabsTrigger } from "@/components";
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { AlarmClock, Inbox } from "lucide-react";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ActivityForm from "./form/activityForm";

/// esto sirver para darle formato a fecha con formatos "DD/MM/YYYY hh:mm:ss a" o mas complicados
dayjs.extend(customParseFormat);

export default function Actividad({ actividad, selectedActividad, setSelectedActividad, setStatusActividad, toggleActivoForFalse }) {


  const calcularDiasRestantes = (fechaInicio, fechaFin) => {
    const hoy = dayjs();

    const inicio = dayjs(fechaInicio, "DD/MM/YYYY hh:mm:ss a");
    const fin = dayjs(fechaFin, "DD/MM/YYYY hh:mm:ss a");

    if (hoy.isBefore(inicio)) {
      // Si la fecha actual es anterior al inicio, devuelve los días negativos
      return hoy.diff(inicio, 'day'); // Esto ya debería devolver negativo
    } else if (hoy.isAfter(fin)) {
      // Si la fecha actual es posterior al final, devuelve los días negativos
      return fin.diff(hoy, 'day');
    } else {
      // Si la fecha actual está entre el inicio y el final, devuelve los días restantes
      return fin.diff(hoy, 'day');
    }
  }


  return (
    <>
      <div className="w-[350px] h-full border-r pr-2 relative bg-white">
        <div className="p-3 border-b  flex justify-between items-center">
          <span className=" font-bold text-[18px]">Actividades </span>
          <Tabs defaultValue="1"   >
            <TabsList className="bg-gray-100 ">
              <TabsTrigger value="1" onClick={() => setStatusActividad(1)}>Pendiente</TabsTrigger>
              <TabsTrigger value="2" onClick={() => setStatusActividad(2)}>Completa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {
          actividad?.length == 0 ?
            <div className="flex flex-col h-64 justify-center items-center text-gray-500">
              <Inbox width={50} />
              <p>Sin data</p>
            </div> :
            <><ScrollArea className="h-[60vh]">
              {actividad?.map((data, i) => (
                <div key={i} className={`${selectedActividad.actividadId == data.actividadId ? "m-1 border mb-2 p-3 cursor-pointer rounded-sm bg-gray-100" : "m-1 border mb-2 p-3 cursor-pointer rounded-sm hover:bg-blue-50"}`} onClick={() => { setSelectedActividad(data); toggleActivoForFalse() }}>
                  <p className="font-semibold text-wrap text-[12px] text-black " >{data.title.toUpperCase()}</p>
                  <p className="font-light text-gray-400 text-[12px]" >{data.author}</p>
                  <div className="mt-2 gap-3">
                    <p className="font-semibold  text-[12px] mt-2 " >{data.category}</p>

                    {
                      data?.status == 1 ? <>
                        <p className={`text-[12px] flex items-center gap-1 ${calcularDiasRestantes(data?.fechaInicio, data?.fechaFinal) <= 0 ? "text-red-600" : "text-green-500"}`}>
                          {calcularDiasRestantes(data?.fechaInicio, data?.fechaFinal)}
                          <AlarmClock strokeWidth={1.25} width={14} />
                        </p>
                      </> : null
                    }
                  </div>
                </div>
              ))}
            </ScrollArea></>
        }
        <div className="w-full absolute bottom-2 pr-3 ">
        <ActivityForm/>
        </div>
      </div>
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
