import "../layout.css";
import { fetcher } from "@/api/api";
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import useSearch from "@/hook/useStore";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SelectGroup } from "@radix-ui/react-select";
import { Annoyed, Frown, Laugh, ListFilter, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import useSWR from "swr";

export default function Search() {
  const { ubicacion } = useSearch();

  const { data } = useSWR(
    ubicacion
      ? `Projects/AccomplishmentInformation?year=${ubicacion.year}&paisId=${ubicacion.paisID}`
      : null,
    fetcher,

    { refreshInterval: 360000, revalidateOnFocus: false }
  );

  const { data: naturaleza } = useSWR("/Pais/GetNaturaleza", fetcher, {
    refreshInterval: false,
    revalidateOnFocus: false,
  });

  const [selectData, setSelectData] = useState([]);
  const [currentSelect, setCurrentSelect] = useState("Todos");
  const [dataState, setDataState] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [buttonValue, setButtonValue] = useState(0);

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    setInputValue(searchTerm);

    if (searchTerm === "") {
      setDataState(dataState);
    } else {
      const filter = dataState?.filter((item) =>
        item.projectName.toUpperCase().includes(searchTerm.toUpperCase())
      );
      setDataState(filter);
    }
  };
  const agregarPorCumplimineto = (data) => {
    return data?.map((item) => {
      let cumplimientoClasificacion = "";

      // Clasificar el cumplimiento
      if (item.cumplimiento > 105) {
        cumplimientoClasificacion = "n/a"; // No especificado, ajusta según tus necesidades
      } else if (item.cumplimiento >= 60 && item.cumplimiento <= 105) {
        cumplimientoClasificacion = "1";
      } else if (item.cumplimiento >= 40 && item.cumplimiento < 60) {
        cumplimientoClasificacion = "2";
      } else if (item.cumplimiento < 30) {
        if (item.cumplimiento < 0) {
          item.cumplimiento = 0;
        }
        cumplimientoClasificacion = "3";
      }

      // Devolver el objeto modificado con la clasificación de cumplimiento
      return {
        ...item,
        cumplimientoClasificacion,
      };
    });
  };

  const filtrado = (select, value) => {
    let d = agregarPorCumplimineto(data);
    if (select == "Plataforma") {
      setButtonValue(0);
      setDataState(d?.filter((item) => item.narutalezaNombre === "Plataforma"));
    }
    if (select == "Estrategico") {
      setButtonValue(0);

      setDataState(
        d?.filter((item) => item.narutalezaNombre === "Estrategico")
      );
    }
    if (select == "Todos") {
      setButtonValue(0);
      setDataState(d);
    }
    if (select == "Mis proyectos") {
      setButtonValue(0);

      setDataState(
        d?.filter(
          (item) => item.responsable == localStorage.getItem("Username")
        )
      );
    }

    if (value == "1") {
      setButtonValue(1);
      let dat = d?.filter((item) => item.cumplimientoClasificacion == "1");
      setDataState(dat);
    } else if (value == "2") {
      setButtonValue(2);

      let dat = d?.filter((item) => item.cumplimientoClasificacion == "2");
      setDataState(dat);
    } else if (value == "3") {
      setButtonValue(3);

      let dat = d?.filter((item) => item.cumplimientoClasificacion == "3");
      setDataState(dat);
    }
  };

  useEffect(() => {
    if (naturaleza) {
      setSelectData(
        [
          ...naturaleza,
          { naturalezaId: 0, nombre: "Todos", name: "All" },
          { naturalezaId: 3, nombre: "Mis proyectos", name: "My projects" },
        ].sort((a, b) => a.naturalezaId - b.naturalezaId)
      );
    }
  }, [naturaleza]);

  useEffect(() => {
    let d = agregarPorCumplimineto(data);
    setDataState(d);
    setCurrentSelect("Todos");
  }, [data]);

  useEffect(() => {
    if (inputValue == "") {
      let d = agregarPorCumplimineto(data);
      setDataState(d);
    } else {
      setCurrentSelect("Todos");
    }
  }, [inputValue]);

  return (
    <div className="w-[400px] h-screen absolute top-0 border-r bg-white ">
      <div className="px-5">
        <section className="  flex items-center h-[70px] ">
          <h3 className=" text-[15px] font-bold">
            Project Administration Tool
          </h3>
        </section>

        <section>
          <div className="flex items-center justify-between py-5 ">
            <p className="font-bold text-[25px]  ">Proyectos</p>
            <span className="text-gray-400 mr-5 text-[20px]">
              <CountUp start={0} end={dataState?.length} duration={4} />
            </span>
          </div>
          <div className="relative flex items-center pb-5">
            <SearchIcon className="absolute left-3 w-5 h-5 text-gray-400" />
            {inputValue !== "" ? (
              <>
                <X
                  onClick={() => setInputValue("")}
                  className="absolute right-3 w-5 h-5 text-gray-500 bg-white cursor-pointer"
                />
              </>
            ) : null}
            <Input
              placeholder="Buscar proyecto"
              className="pl-10"
              value={inputValue}
              onChange={handleChange}
            />
          </div>
        </section>
        <section className="pb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <ListFilter className=" w-5 h-5 text-gray-400" />
                <Label className="ml-2 text-gray-500">Filtrar</Label>
                <div className=" absolute left-32 w-18 bg-gray-200 rounded-lg px-5 py-2  text-gray-400">
                  <Label>{currentSelect}</Label>
                </div>

                {buttonValue !== 0 ? (
                  <>
                    <div className=" absolute left-56 w-18 bg-gray-200 rounded-lg px-5 py-2  text-gray-400">
                      <Label>
                        {buttonValue == "1"
                          ? "Alto"
                          : buttonValue == "2"
                          ? "Medio"
                          : buttonValue == "3"
                          ? "Bajo"
                          : null}
                      </Label>
                    </div>
                  </>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="ml-20 flex gap-2  w-[500px] bg-blue-800 text-white">
              <Select
                onValueChange={(value) => {
                  filtrado(value);
                  setCurrentSelect(value);
                }}
              >
                <SelectTrigger className="w-[180px] text-black">
                  <SelectValue placeholder={`${currentSelect}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectData?.map((item, i) => (
                      <SelectItem key={i} value={item.nombre}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                id={1}
                onClick={() => {
                  setButtonValue(event.target.id);
                  filtrado("Todos", 1);
                  setCurrentSelect("Todos");
                }}
                variant="ghost"
                className={`gap-2 ${
                  buttonValue == "1" ? "bg-white text-blue-800" : ""
                }`}
              >
                <Laugh className=" cursor-default" />
                Alto
              </Button>
              <Button
                id={2}
                onClick={() => {
                  setButtonValue(event.target.id);
                  filtrado("Todos", 2);
                  setCurrentSelect("Todos");
                }}
                variant="ghost"
                className={`gap-2 ${
                  buttonValue == "2" ? "bg-white text-blue-800" : ""
                }`}
              >
                <Annoyed className=" cursor-default" />
                Medio
              </Button>
              <Button
                id={3}
                onClick={(event) => {
                  setButtonValue(event.target.id);
                  filtrado("Todos", 3);
                  setCurrentSelect("Todos");
                }}
                variant="ghost"
                className={`gap-2 ${
                  buttonValue == "3" ? "bg-white text-blue-800" : ""
                }`}
              >
                <Frown className=" cursor-default" />
                Bajo
              </Button>
            </PopoverContent>
          </Popover>
        </section>
      </div>
      <ScrollArea className="viewport p-2 ">
        <div className="flex flex-col h-full cursor-pointer">
          {dataState?.map((item, i) => (
            <div
              key={i}
              className="border m-1 p-3 rounded-[10px] bg-white hover:bg-slate-100 "
            >
              <div className="flex justify-between items-center">
                <div className="w-[290px]">
                  <p className="text-[13px] font-semibold">
                    {item.projectName.toUpperCase()}
                  </p>
                  <p className="text-gray-400  font-extralight text-[13px]">
                    {item.responsable}
                  </p>
                </div>

                <div className="text-gray-400 text-[14px]">
                  {/* {item.cumplimiento + "%"} */}
                  <CountUp
                    start={0}
                    end={item.cumplimiento}
                    duration={4}
                    suffix="%"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Badge variant="outline" className="text-[11px]">
                  {item.narutalezaNombre}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
