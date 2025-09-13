import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import Login from "./pages/login";
import RegisterTenant from "./pages/RegisterTenant";

export default function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      element: <h1>Home Page</h1>,
    },
    {
       path: "/login",
       element: <Login/>,
    },
    {
      path: "/RegisterTenant",
      element: <RegisterTenant/>,
    }

  ])
  return (
   <RouterProvider router={router} />
  )
}
