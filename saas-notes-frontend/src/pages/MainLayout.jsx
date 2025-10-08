import { Outlet } from "react-router"
import Sidebar from "../components/sidebar"

const MainLayout = () => {
    return (

        <div className="flex min-h-screen bg-gray-50 text-gray-900">

            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">   
                     <Outlet />
            </main>
        </div>
    )
}


export default MainLayout