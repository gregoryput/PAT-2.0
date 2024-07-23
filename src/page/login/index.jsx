import imgLogoCemex from "../../assets/res/cemexLogo.webp";
import logo from "../../assets/LogoPat.svg";
import "./login.css";
import { toast, Toaster } from "sonner";
import Sesion from "./components/Sesion";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { Toggle } from "@/components";

export default function Login() {
  const [t] = useTranslation("global");
  const [language, setLanguage] = useState(true);

  const languageChange = () => {
    if (!language) {
      localStorage.setItem("_lang", "EN");
      i18next.changeLanguage("EN");
    } else {
      localStorage.setItem("_lang", "ES");
      i18next.changeLanguage("ES");
    }
  };

  useEffect(() => {
    languageChange();
  }, [language]);

  return (
    <div className="flex w-full h-screen">
      <section className=" p-4 flex flex-col fondo2" style={{ width: 700 }}>
        <div className=" flex justify-between items-center">
          <div className="flex items-center  ">
            <img
              src={logo}
              alt="fondo"
              style={{
                width: "30px",
              }}
            />
            <p
              className="pt-2 px-4"
              style={{ fontWeight: "bold", fontSize: "15px" }}
            >
              Project Administration Tool
            </p>
          </div>

       
          <div>
            <Toggle
              onClick={() => {
                
                  setLanguage(!language);
                  toast(`${t("title-description")}`, {
                    description: `${t("description")}`,
                  })
              }}
            >
              <p className=" text-gray-500">{t("lang")}</p>
            </Toggle>
          </div>
        </div>

        <Sesion />

        <footer className=" w-full  h-24 absolute bottom-0 left-0 flex flex-col  justify-center items-center ">
          <div className="flex items-center gap-2 ">
            <p className=" text-gray-400 text-[13px] ">{t("Developerby")}</p>
            <div
              className="cursor-pointer efecto_Btn "
              onClick={() => {
                window.open(
                  "https://www.linkedin.com/in/gregory-albert-s%C3%A1nchez-05820019b/",
                  "_blank"
                );
              }}
            >
              <ion-icon size="large" name="logo-linkedin"></ion-icon>
            </div>
            <div
              className="cursor-pointer efecto_Btn "
              onClick={() => {
                window.open("https://github.com/gregoryput", "_blank");
              }}
            >
              <ion-icon size="large" name="logo-github"></ion-icon>
            </div>
          </div>
        </footer>
        
      </section>

      <section className="w-full fondo ">
        <div className="absolute bottom-0 mb-8 ml-4">
          <img
            src={imgLogoCemex}
            alt="fondo"
            style={{
              width: "100px",
            }}
          />
        </div>
        <div className=" bg-black/20 w-full h-full  "></div>
        <p
          className="absolute bottom-0 mb-4 ml-5 text-white "
          style={{ fontSize: 11 }}
        >
         {t("credi")}
        </p>
      </section>

      <Toaster />
    </div>
  );
}
