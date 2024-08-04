import { fetcher } from "@/api/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import useSearch from "@/hook/useStore";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SelectGroup } from "@radix-ui/react-select";

import { Github, LifeBuoy, LogOut, SearchIcon, User } from "lucide-react";
import { useForm } from "react-hook-form";
import useSWR from "swr";


export default function Menu() {
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
  return (
    <div className="h-[70px] flex justify-between items-center px-5 ">
      <div className="pl-[400px] text-gray-400 ">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex items-center">
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
                    <SelectValue placeholder="2024" />
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
                    <SelectValue placeholder="Republica Dominicana" />
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
          <div className=" flex  items-center gap-5 px-5 cursor-pointer ">
            <p className="text-gray-400 font-light">Raymond Diplan Torres</p>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
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
