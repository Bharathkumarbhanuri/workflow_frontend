import { NavLink, useNavigate } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";

const linkClass = "text-lg text-gray-700";
const activeClass = "text-green-700";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setOpen(false);
        navigate("/login", { replace: true });
    }

    return (
        <header className="bg-white shadow-md px-6 py-5">
            <div className="flex items-center justify-between">
                <div className="font-bold text-3xl">Workflow Service</div>
                <nav className="flex gap-5">
                    <NavLink to="/workflows"
                        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                    >Workflows
                    </NavLink>

                    <NavLink to="/runs"
                        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                    >Runs
                    </NavLink>

                    <NavLink to="/emails"
                        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                    >
                        Emails
                    </NavLink>

                    <NavLink to="/notifications"
                        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                    >
                        Notifications
                    </NavLink>

                    <div className="relative">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="flex items-center"
                        >
                            <FaUserCircle size={30} color="#555" />
                        </button>
                    </div>

                    {open && (
                        <div className="absolute right-0 rounded top-12 shadow-lg w-32 mt-2 border bg-white">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar
