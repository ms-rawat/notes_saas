import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/layout/MainLayout";

import BoardPage from "./features/issues/pages/BoardPage";
import ProjectsPage from "./features/projects/pages/ProjectsPage";
import Login from "./features/auth/pages/Login";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import RegisterTenant from "./features/auth/pages/RegisterTenant";
import ResetPassword from "./features/auth/pages/ResetPassword";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/authSlice";
import TeamPage from "./features/teams/pages/TeamPage";
import RegisterInvitedUser from "./features/auth/pages/RegisterInvitedUser";

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

        { path: 'issues', element: <BoardPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'team', element: <TeamPage /> }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}