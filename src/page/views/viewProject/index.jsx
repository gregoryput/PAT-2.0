import { fetcher } from "@/api/api";
import useProject from "@/hook/useProject";
import "./project.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import useActiveSearch from "@/hook/useActiveSearch";

import Panel from "./components/panel";
import { Loader2 } from "lucide-react";
import ComponenteGraficos from "./components/componenteGraficos";
import Actividad from "./components/actividad";
import ActiividadDetail from "./components/actividadDetail";
import ComentarioGalerias from "./components/comentarioGalerias";




export default function Project() {
  const { project } = useProject();
  const { activo, toggleActivoForFalse } = useActiveSearch();
  const navigate = useNavigate();

  const { data, isLoading, error } = useSWR(
    `Projects/indicadoresDeCostoByProjectIdSap?projectId=${project.projectId}&year=${project.year}`,
    fetcher,
    { refreshInterval: false, revalidateOnFocus: false }
  );


  const { data: getActivity } = useSWR(`/Activities/getActivityById?idProjectSap=${project.projectId}`, fetcher, { refreshInterval: false, revalidateOnFocus: false })
  const { data: grafica } = useSWR(
    `Projects/realvsComprometido?projectId=${project.projectId}&year=${project.year}`,
    fetcher,

    { refreshInterval: false, revalidateOnFocus: false }
  );

  const [statusActividad, setStatusActividad] = useState(1);
  const [selectedActividad, setSelectedActividad] = useState({});
  const actividad = getActivity?.filter((state) => state.status === statusActividad);

  useEffect(() => {
    if (error) {
      navigate("/home");
    }
  }, [error]);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-700 " />
      </div>
    );

  return (
    <>
      <Panel data={data} project={project}  />
      <section className=" w-full h-[80%] flex  ">
        <section className="flex">
          <Actividad actividad={actividad} selectedActividad={selectedActividad} setSelectedActividad={setSelectedActividad} setStatusActividad={setStatusActividad} toggleActivoForFalse={toggleActivoForFalse} />
          <ActiividadDetail activo={activo} selectedActividad={selectedActividad} />
        </section>
        <ComponenteGraficos data={data} grafica={grafica} />
        <ComentarioGalerias />
      </section>
    </>
  );
}