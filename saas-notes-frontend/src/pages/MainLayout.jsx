import { Outlet } from "react-router"
import Sidebar from "../components/sidebar"

const MainLayout = () => {
    return (

        <div className="grid min-h-screen grid-cols-[260px_1fr] bg-gray-50 text-gray-900">
           <span className="h-screen sticky top-0 border-r bg-white">
                        <Sidebar />

           </span>
            <main className="overflow-y-auto">   
                     <Outlet />
            </main>
        </div>
    )
}


export default MainLayout