import { fetcher } from "@/api/api";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import useSearch from "@/hook/useSearch";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SelectGroup } from "@radix-ui/react-select";

import { Github, LifeBuoy, LogOut, SearchIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";


export default function Menu() {



  const [userName,setUserName] = useState(localStorage.getItem("Username"))
  // esta son la consultas
  const { data: dataPais } = useSWR("/Pais/Pais", fetcher);
  const { data: fecha } = useSWR("/Pais/GetYear", fetcher);
  // const { data: region } = useSWR("/Region", fetcher);
  const { ubicacion, setUbicacion } = useSearch();

  const { register, setValue, getValues } = useForm({
    defaultValues: {
      region: "SCA&C",
      year: "2024",
      pais: "Republica Dominicana",
      paisID: 1,
    },
  });

  const handlerForm = () => {
    let region = getValues("region");
    let year = getValues("year");
    let paisID = getValues("paisID");
    let paisNombre = getValues("pais");
    // Crear un objeto con nombres y valores
    let namedValues = {
      region: region,
      year: year,
      pais: paisNombre,
      paisID: paisID
    };

    setUbicacion(namedValues);
  };

  const navigate = useNavigate();
  
  useEffect(()=>{
    setUserName(localStorage.getItem("Username"))
  },[])
  
  
  return (
    <div className="bg-white h-full flex justify-between items-center  ">
      <div className=" text-gray-400 ">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex items-center ml-5">
              <SearchIcon className="absolute left-3 w-5 h-5" />
              <Button
                className="pl-10 hover:bg-blue-700 hover:text-white"
                variant="ghost"
              >
                <p className="tex-[20px]">
                  {ubicacion.region +
                    " - " +
                    ubicacion.year +
                    " - " +
                    ubicacion.pais}
                </p>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Parametros</h4>
              <p className="text-sm text-muted-foreground">
                Ajusta los parametros.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value="SCA&C"
                  className="col-span-2 h-8"
                  disabled={true}
                  {...register("region")}
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="year">Año</Label>
                <Select onValueChange={(value) => setValue("year", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={ubicacion?.year} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fecha?.map((item) => (
                        <SelectItem key={item.year} value={item.year}>
                          {item.year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="pais">Pais</Label>
                <Select
                  onValueChange={(value) => {
                    const selectedCountry = dataPais.find(
                      (item) => item.paisID === value
                    );
                    if (selectedCountry) {
                      setValue("paisID", value);
                      setValue("pais", selectedCountry.descripcion);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={ubicacion?.pais} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dataPais?.map((item) => (
                        <SelectItem key={item.paisID} value={item.paisID}>
                          {item.descripcion}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => handlerForm()} className="w-full mt-5">
              Buscar
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className=" flex  items-center gap-5 px-5 cursor-pointer mr-2 ">
            <p className="text-gray-400 font-light">{userName}</p>
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}

            <div className="w-11 h-11 bg-blue-700 rounded-full flex items-center justify-center">
              <p className="text-white font-bold text-[16px]">{userName?.slice(0,1)}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
