import CountUp from "react-countup";
import PropTypes from 'prop-types';

export default function Dashboard({ data }) {
    return (
        <>
            <div className="flex w-full justify-between pl-5 pr-7">
                <section className="">
                    <div className="flex justify-between">
                        <p className=" font-semibold text-gray-500">Presupuesto</p>
                    </div>

                    <h2 className=" font-bold text-[20px]">
                        <CountUp
                            start={0}
                            end={data?.budget}
                            duration={2}
                            prefix="$"
                        />
                    </h2>
                </section>
                <section className="">
                    <div className="flex justify-between ">
                        <p className=" font-semibold text-gray-500">Real</p>
                    </div>

                    <h2 className=" font-bold text-[20px]">
                        <CountUp
                            start={0}
                            end={data?.montoReal}
                            duration={2}
                            prefix="$"
                        />
                    </h2>
                </section>
                <section className="">
                    <div className="flex justify-between ">
                        <p className=" font-semibold text-gray-500">Comprometido</p>
                    </div>

                    <h2 className=" font-bold text-[20px]">
                        <CountUp
                            start={0}
                            end={data?.montoComprometido}
                            duration={2}
                            prefix="$"
                        />
                    </h2>
                </section>

                <section className="">
                    <div className="flex justify-between ">
                        <p className=" font-semibold text-gray-500">Disponible</p>
                    </div>

                    <h2 className=" font-bold text-[20px]">
                        <CountUp
                            start={0}
                            end={data?.montoDisponible}
                            duration={2}
                            prefix="$"
                        />
                    </h2>
                </section>

            </div>
        </>
    )
}


Dashboard.propTypes = {
    data: PropTypes.shape({
        budget: PropTypes.number,
        montoComprometido: PropTypes.number,
        montoReal: PropTypes.number,
        montoDisponible: PropTypes.number,
    }).isRequired,

};