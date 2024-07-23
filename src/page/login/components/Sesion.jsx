import { Button, Input } from "@/components";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function Sesion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [t] = useTranslation("global");
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col items-center justify-center mt-44  bg-white">
      <h1 className="font-bold text-4xl mb-1"> {t("Welcome")}</h1>
      <h5 className="font-light text-=sm mb-10 text-gray-400">
        {t("sub-title")}
      </h5>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="my-10">
          <Input
            id="Usuario"
            type="text"
            {...register("Usuario", { required: true })}
            placeholder={`${t("username")}`}
            className="w-96"
          />
          {errors.Usuario && (
            <p className="text-red-500 text-sm mt-1">{t("errors.Usuario")}</p>
          )}
        </div>

        <div className="my-10">
          <Input
            id="Password"
            type="Password"
            {...register("Password", { required: true })}
            className="w-96 "
            placeholder={`${t("password")}`}
          />
          {errors.Password && (
            <p className="text-red-500 text-sm mt-1">{t("errors.Password")}</p>
          )}
        </div>

        <div>
          <Button type="Submit" disabled={false} className="mt-10 w-96">
            {t("login_text")}
          </Button>{" "}
        </div>
      </form>
    </section>
  );
}
