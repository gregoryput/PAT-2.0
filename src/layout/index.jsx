import { decodeJwt2 } from "@/util/jwt";
import { useEffect } from "react";
import Nav from "./components/nav";
import Menu from "./components/menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Search from "./components/search";
import useActiveSearch from "@/hook/useActiveSearch";
import "./layout.css";

export default function Layout() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let location = useLocation();
  const { activo } = useActiveSearch();

  useEffect(() => {
    if (token !== null) {
      let decode = decodeJwt2(token);
      if (decode.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("Rol");
        localStorage.removeItem("Username");
      }
      //localStorage.setItem("Rol", "Users");
      localStorage.setItem("Username", decode.unique_name);
    }
  });

  useEffect(() => {
    if (location.pathname == "/") {
      navigate("/Home");
    }
  }, []);

  return (
    <>
      <div className="flex  w-full min-h-screen bg-white">
        <div className="w-[70px] flex-shrink-0 z-10">
          <Nav />
        </div>
        <div
          className={`w-[380px]  flex-shrink-0  ${
            activo ? "desplegar-izquierda" : "desplegar-derecha"
          }`}
        >
          <Search />
        </div>
        <div className="flex flex-col flex-grow   lg:pl-2">
          <div className="h-16 lg:h-[8%] mb-4 lg:mb-0">
            <Menu />
          </div>
          <div className="flex-grow pl-5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
