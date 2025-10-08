import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import Login from "./pages/login";
import RegisterTenant from "./pages/RegisterTenant";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./pages/MainLayout";
import UserDashboard from "./pages/UserDashboard";

export default function App() {


  const router = createBrowserRouter([
    {
       path: "/login",
       element: <Login/>,
    },
    {
      path: "/register",
      element: <RegisterTenant/>
    },
    {
      path : "/",
      element: <MainLayout/>,
      children :[
        {index : true , element:<HomePage/>},
        {path:'dashboard', element :<Dashboard/>},
        {path:'userdashboard', element: <UserDashboard/>}
      ]
    }
  ])
  return (
   <RouterProvider router={router} />
  )
}
