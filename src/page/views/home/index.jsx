import Search from "@/layout/components/search";
import "./home.css";
import {
  CircleDollarSign,
  Handshake,
  PiggyBank,
  WalletMinimal,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetcher } from "@/api/api";
import useSWR from "swr";
import useSearch from "@/hook/useStore";
import CountUp from "react-countup";

export default function Home() {
  const { ubicacion } = useSearch();
  const { data } = useSWR(
    ubicacion
      ? `/Projects/indicadoresDeCostoByCountry?idPais=${ubicacion.paisID}&year=${ubicacion.year}`
      : null,
    fetcher
  );

  const chartData = [
    { pais: data?.nombreProyecto, Asginado: data?.montoAsignado, Disponible: data?.montoDisponible },
  ];
  return (
    <div className="">
      <Search />

      <div>
        <div className="ml-[400px] pl-10  ">
          <h1 className="text-[40px] mt-5 font-extrabold">
            {data?.nombreProyecto}
          </h1>
        </div>
        <div className="ml-[400px] p-5 mt-2 flex flex-wrap justify-around">
          <div className=" p-5  rounded-sm w-[230px]  ">
            <div className="flex justify-between mb-5 ">
              <p className=" font-semibold">Presupuesto</p>
              <CircleDollarSign />
            </div>

            <h2 className=" font-bold text-[30px]">  <CountUp
                start={0}
                end={data?.budget}
                duration={4}
                prefix="$"
                
              /></h2>
          </div>

          <div className=" p-5  rounded-sm  w-[230px] ">
            <div className="flex justify-between mb-5">
              <p className=" font-semibold">Real</p>
              <WalletMinimal />
            </div>

            <h2 className=" font-bold text-[30px]">
              <CountUp
                start={0}
                end={data?.montoReal}
                duration={4}
                prefix="$"
               
              />
            </h2>
          </div>

          <div className=" p-5  rounded-sm w-[230px]   ">
            <div className="flex justify-between mb-5">
              <p className=" font-semibold">Comprometido</p>
              <Handshake />
            </div>

            <h2 className=" font-bold text-[30px]">
             
              <CountUp
                start={0}
                end={data?.montoComprometido}
                duration={4}
                prefix="$"
              
              />
            </h2>
          </div>

          <div className=" p-5  rounded-sm  w-[230px]  ">
            <div className="flex justify-between mb-5">
              <p className=" font-semibold">Disponible</p>
              <PiggyBank />
            </div>

            <h2 className=" font-bold text-[30px]">  <CountUp
                start={0}
                end={data?.montoDisponible}
                duration={4}
                prefix="$"
                
              /></h2>
          </div>
        </div>
      </div>

      <div className="ml-[400px] flex justify-center mt-24">
        <Component chartData={chartData} />
      </div>
    </div>
  );
}



export function Component({chartData}) {

  
  const chartConfig = {
    Asginado: {
      label: "Asginado ",
      color: "#2563eb",
    },
    Disponible: {
      label: "Disponible ",
      color: "#E4003A",
    },
  };
  return (
    <ChartContainer config={chartConfig} className="w-[600px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="pais"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 50)}
        />
        <ChartTooltip className="w-[300px]"  content={<ChartTooltipContent />} />
        <Bar
          dataKey="Disponible"
          fill="var(--color-Disponible)"
          radius={4}
          
        />
        <Bar dataKey="Asginado" fill="var(--color-Asginado)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
