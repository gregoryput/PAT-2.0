import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"
import PropTypes from 'prop-types';

export default function ComponenteGraficos({data,grafica}) {

    const dataGrafica = (grafica) => {
        const meses = [
          { mes: 1, nombre: 'ene' },
          { mes: 2, nombre: 'feb' },
          { mes: 3, nombre: 'mar' },
          { mes: 4, nombre: 'abr' },
          { mes: 5, nombre: 'may' },
          { mes: 6, nombre: 'jun' },
          { mes: 7, nombre: 'jul' },
          { mes: 8, nombre: 'ago' },
          { mes: 9, nombre: 'sep' },
          { mes: 10, nombre: 'oct' },
          { mes: 11, nombre: 'nov' },
          { mes: 12, nombre: 'dic' },
        ];
    
    
        // Combina la lista de meses con los datos adicionales de "grafica" si coinciden
        const datosGrafica = meses.map((mes) => {
          const datosMes = grafica?.find((g) => g.mes === mes.mes);
          return {
            ...mes,
            anio: datosMes?.anio || null,
            fecha: datosMes?.fecha || `${mes.nombre} ${datosMes?.anio || ''}`,
            comprometido: datosMes?.comprometido || 0,
            real: datosMes?.real || 0,
            presupuesto: data?.budget || 0
          };
        });
    
        return datosGrafica;
      };


    const chartConfig = {
        desktop: {
          label: "comprometido",
          color: "red",
        },
        mobile: {
          label: "real",
          color: "blue",
        },
      }
    

    return (
        <>
            <section className="flex w-[50%]">

                <div className="border-r flex flex-col w-full">
                    <div className=" max-w-[500px] mb-2 p-1">
                        <div>
                            <p className="font-bold p-2">Best Estimated</p>
                        </div>
                        <ChartContainer config={chartConfig}>
                            <BarChart accessibilityLayer data={dataGrafica(grafica)}>
                                <CartesianGrid vertical={false} horizontal={false} />
                                <XAxis
                                    className="text-[13px]"
                                    dataKey="nombre"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 10)}
                                />
                                <ChartTooltip
                                    cursor={true}
                                    content={<ChartTooltipContent className="w-56" />}
                                />
                                <Bar dataKey="comprometido" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="real" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className=" max-w-[500px] p-1">
                        <div>
                            <p className="font-bold p-2">Real/Comprometido</p>
                        </div>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={dataGrafica(grafica)}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} horizontal={true} />
                                <XAxis
                                    dataKey="nombre"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-56" />} />
                                <Line
                                    dataKey="presupuesto"
                                    type="monotone"
                                    stroke="green"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="comprometido"
                                    type="monotone"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    dataKey="real"
                                    type="monotone"
                                    stroke="var(--color-mobile)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>


            </section>
        </>
    )
}


ComponenteGraficos.propTypes = {
    data: PropTypes.shape({
        budget: PropTypes.number,
    }).isRequired,
    grafica: PropTypes.arrayOf(
        PropTypes.shape({
            mes: PropTypes.number.isRequired,
            anio: PropTypes.number,
            fecha: PropTypes.string,
            comprometido: PropTypes.number,
            real: PropTypes.number,
        })
    ).isRequired,
};