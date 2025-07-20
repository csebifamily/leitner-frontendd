import { Outlet } from "react-router-dom";

export default function Layout() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center p-4">
            <Outlet />
        </div>
    );

}