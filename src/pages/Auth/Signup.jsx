import { useState } from "react";
import { AuthAPI } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import ErrorToast from '../../components/Common/ErrorToast';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await AuthAPI.register(email, password);
            localStorage.setItem("token", res.data.token);
            navigate("/workflows");
        } catch (error) {
            console.log(error);
            setErr(error?.response?.data || error?.response?.data?.message || error.message || "failed to register")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-16 max-w-lg w-full bg-white rounded shadow">
                <h1 className="text-xl font-bold mb-1">Sign up</h1>
                <p className="text-sm opacity-70 mb-4">
                    Create an account to manage workflows
                </p>
                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        className="border p-2 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        className="border p-2 w-full"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button
                        className="bg-black text-white px-4 py-2 w-full"
                        type="submit"
                    >
                        Sign up
                    </button>
                </form>

                <div className="mt-4 text-sm">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="underline"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>

                <ErrorToast show={!!err} message={String(err)} onClose={() => setErr("")} />
            </div>
        </div>
    );
}
