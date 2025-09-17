import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import Login from "./pages/login";
import RegisterTenant from "./pages/RegisterTenant";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

export default function App() {


  const router = createBrowserRouter([
    {
       path: "/login",
       element: <Login/>,
    },
    {
      path: "/",
      element: <HomePage/>,
    },
    {
      path : "/Dashboard",
      element: <Dashboard/>
    }
  ])
  return (
   <RouterProvider router={router} />
  )
}
