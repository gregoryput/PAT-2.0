import { Button, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Sheet, Input } from "@/components";
import { SheetClose } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Bolt, } from "lucide-react";
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { useState } from "react";


export default function ProjectForm({ status }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const [select, setSelect] = useState(0)

    const onSubmit = (data) => {
        console.log(data)
    };


     
    // let newActivity2 = {
    //     idProjectSap: currentProject,
    //     title: actividad.title == undefined ? activity.title : actividad.title  ,
    //     description: actividad.description == undefined ? activity.description : actividad.description,
    //     author: userId,
    //     category: actividad.category == undefined ? activity.categoryId : actividad.category[0],
    //     endString: actividad.end == undefined ? activity.fechaFinal :  actividad.end.format('YYYY-MM-DD'),
    //     startString: actividad.start == undefined ? activity.fechaInicio : actividad.start.format('YYYY-MM-DD'),
    //     file : image.file,
    //     comentary : actividad.comentary,
    //     responsable : actividad.Responsable == undefined ? activity.responsableAuthorId : actividad.Responsable[0]
    //   }     


    return (

        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="gap-5  rounded-sm bg-gray-100 hover:bg-blue-600 hover:text-white">
                    <Bolt width={20} />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Editar proyecto</SheetTitle>
                    <SheetDescription>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-10" >


                            <div>
                                <p className="mb-3">Estado del proyecto</p>

                                {status?.map((data) => (
                                    <Button
                                        key={data.value}
                                        variant="ghost"
                                        type="button"
                                        className={`border mx-1 gap-1 ${select?.value == data.value ? "bg-blue-700 text-white" : ""}`}
                                        onClick={()=>{setSelect(data)}}
                                    >
                                        <p>{data.label}</p>
                                    </Button>
                                ))}
                            </div>


                            <div>
                                <p className="mb-3">Presupuesto</p>
                                <Input
                                    id="Presupuesto"
                                    type="text"
                                    {...register("Presupuesto", { required: true })}
                                />
                                {errors.Presupuesto && (
                                    <p className="text-red-500 text-sm mt-1">error</p>
                                )}
                            </div>

                            <div >
                                <p className="mb-3">Alcance del proyecto</p>

                                <Textarea
                                    id="Alcance"
                                    type="text"
                                    {...register("Alcance", { required: true })}


                                />
                                {errors.Alcance && (
                                    <p className="text-red-500 text-sm mt-1">error</p>
                                )}
                            </div>

                            <SheetClose asChild className=" absolute bottom-10 w-[300px] right-10" >
                                <Button type="submit">Actualizar</Button>
                            </SheetClose>
                        </form>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}


ProjectForm.propTypes = {

    status: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    filter: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })),

};