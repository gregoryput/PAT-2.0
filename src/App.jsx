import ProtectedRoute from "@/router/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, ProjectView } from "./page/views";
import { Login, PageError } from "./page";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_es from "./translation/ES/global.json";
import global_en from "./translation/EN/global.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["Administrador"]}>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <PageError />,
    children: [
      {
        path: "/projectView",
        element: (
          <ProtectedRoute roles={["Administrador"]}>
            <ProjectView />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: (
      <ProtectedRoute roles={["Administrador"]}>
        <Login />
      </ProtectedRoute>
    ),
    errorElement: <PageError />,
  },
]);

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
      <I18nextProvider i18n={i18next}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </>
  );
}

export default App;
