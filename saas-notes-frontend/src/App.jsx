import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ThemeToggle";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./pages/MainLayout";
import UserDashboard from "./pages/UserDashboard";
import NotesPage from "./pages/NotesPage";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import RegisterTenant from "./pages/Auth/RegisterTenant";
import ResetPassword from "./pages/Auth/ResetPassword";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/authSlice";
import TeamPage from "./pages/TeamPage";
import RegisterInvitedUser from "./pages/Auth/RegisterInvitedUser";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <RegisterTenant />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    },
    {
      path: "/register-user",
      element: <RegisterInvitedUser />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'dashboard', element: <UserDashboard /> },
        { path: 'notes', element: <NotesPage /> },
        {path : 'team', element:<TeamPage/>}
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}