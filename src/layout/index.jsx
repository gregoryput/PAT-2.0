import { decodeJwt2 } from "@/util/jwt";
import { useEffect } from "react";
import Nav from "./components/nav";
import Menu from "./components/menu";
import Search from "./components/search";

export default function Layout() {
  const token = localStorage.getItem("token");

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
  },);

  return (
    <div className="w-full h-screen flex">
      <Nav />
      <div className=" bg-white w-full">
        <Menu/>
        <Search/>
      </div>
    </div>
  );
}
