import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import RegisterTenant from "./pages/RegisterTenant";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./pages/MainLayout";
import UserDashboard from "./pages/UserDashboard";
import NotesPage from "./pages/NotesPage";
import Login from "./pages/Login";

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
        {path:'dashboard', element :<UserDashboard/>},
        {path : 'notes',element: <NotesPage/>}
      ]
    }
  ])
  return (
   <RouterProvider router={router} />
  )
}