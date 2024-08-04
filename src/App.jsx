import ProtectedRoute from "@/router/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectView } from "./page/views";
import { Login, PageError } from "./page";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_es from "./translation/ES/global.json";
import global_en from "./translation/EN/global.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./layout";
const queryClient = new QueryClient();

///rutas de la app con proteccion por roles
const router = createBrowserRouter([
  {
    path: "/",
    element: (<ProtectedRoute roles={["Users"]}>
      <Layout />
    </ProtectedRoute>),
    errorElement: <PageError />,
    children: [
      {
        path: "/project",
        element: (
          <ProtectedRoute roles={["Users"]}>
            <ProjectView />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/Login",
    element: <Login />,
    errorElement: <PageError />,
  },
]);

//configuracion de multiples idiomas
let language = !localStorage.getItem("_lang")
  ? "ES"
  : localStorage.getItem("_lang");

i18next.init({
  interpolation: { escapeValue: true },
  lng: language,
  resources: {
    ES: {
      global: global_es,
    },
    EN: {
      global: global_en,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18next}>
          <RouterProvider router={router}></RouterProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
