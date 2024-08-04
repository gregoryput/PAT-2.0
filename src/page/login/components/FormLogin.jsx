import { getLogin } from "@/api/AuthApi";
import { Button, Input } from "@/components";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
//librerias de icons
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function FormLogin() {
  const [t] = useTranslation("global");
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const requestLogin = useMutation({
    mutationFn: getLogin,
    onSuccess: (data) => {
      toast.success("Project Administration Tool", {
        description: `${t("Welcome")}`,
      });
      localStorage.setItem("token",data.token)
      localStorage.setItem("Rol", "Users");
      navigate("/")
    },
    onError: () => {
      toast.error("Project Administration Tool", {
        description: `${t("errors.InfoLogin")}`,
      });
    },
  });

  const onSubmit = (data) => {
    let dataJson = {
      _username: data.User,
      _password: data.Password,
      _language: localStorage.getItem("_lang").toLowerCase(),
    };

    requestLogin.mutate(dataJson);
    
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
            id="User"
            type="text"
            {...register("User", { required: true })}
            placeholder={`${t("username")}`}
            className="w-96"
          />
          {errors.User && (
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
            {requestLogin.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>{t("login_text")}</>
            )}
          </Button>{" "}
        </div>
      </form>
      <Toaster richColors position="top-right" />
    </section>
  );
}
