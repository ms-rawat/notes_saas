import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import Login from "./pages/login";
import RegisterTenant from "./pages/RegisterTenant";
import HomePage from "./pages/HomePage";

export default function App() {


  const router = createBrowserRouter([
    {
       path: "/login",
       element: <Login/>,
    },
    {
      path: "/",
      element: <HomePage/>,
    }

  ])
  return (
   <RouterProvider router={router} />
  )
}
