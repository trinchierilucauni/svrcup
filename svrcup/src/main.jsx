import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Navigate } from 'react-router-dom'
import Partite from './Partite.jsx'
import Classifica from "./Classifica.jsx";
import InfoSquadra from "./InfoSquadra.jsx"
import NavBar from "./NavBar.jsx"
import InfoPartita from './InfoPartita.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import ClassificaGironi from './ClassificaGironi.jsx'
function AppLayout(){
  return(
    <>
      <main>
        <Outlet>

        </Outlet>

      </main>
      <NavBar></NavBar>
    </>

  );
}

const router= createBrowserRouter([{
  path:"/",
  element: <AppLayout/>,
  children: [
    {
      path: "/",
      element: <App></App>
    },
    {
      path: "partite",
      element: <Partite></Partite>
    },
    {
      path: "infosquadra",
      element: <InfoSquadra></InfoSquadra>
    },
    {
      path: "classifica",
      element: <ClassificaGironi></ClassificaGironi>
    },
    {
      path: "infopartita",
      element: <InfoPartita></InfoPartita>
    },
    {
      path: "*",
      element: <Navigate to={"/"} replace/>
    }


  ]
}]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
