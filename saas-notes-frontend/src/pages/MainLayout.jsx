import { Outlet } from "react-router"
import Sidebar from "../components/sidebar"

const MainLayout = ()=>{
    return (

        <>
        <Sidebar/>
        <Outlet/>   
        </>
    )
}


export default MainLayout