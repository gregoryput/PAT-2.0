import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import logo from "../../assets/LogoPat.svg";
import { House, Plus } from "lucide-react";



export default function Nav() {



  return (
    <div className="group w-[70px] h-full py-5 border-r flex flex-col items-center">
      <div className="flex justify-center">
        <img src={logo} alt="fondo" className="w-[30px]" />
      </div>

      <div className="mt-24 overflow-hidden p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full mb-5 text-gray-400 flex justify-center group-hover:justify-start transition-all duration-300 ease-in-out"
              >
                <Plus size={25} strokeWidth={2} className="flex-shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right" // Asumiendo que la librería soporta esta configuración
              className="  p-2 rounded shadow-lg"
            >
              <p>Nuevo proyecto</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full text-gray-400 flex justify-center group-hover:justify-start transition-all duration-300 ease-in-out"
              >
                <House size={25} strokeWidth={2} className="flex-shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right" // Asumiendo que la librería soporta esta configuración
              className="  p-2 rounded shadow-lg"
            >
              <p>Inicio</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
