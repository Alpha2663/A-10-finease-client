import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";


export default function Login() {
  const { login, googleLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      Swal.fire("Success", "Logged in successfully", "success");
      navigate(from, { replace: true });
    } catch {
      Swal.fire("Error", "Invalid credentials", "error");
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      Swal.fire("Success", "Logged in with Google", "success");
      navigate(from, { replace: true });
    } catch {
      Swal.fire("Error", "Google login failed", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-3" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-3" />
        <button className="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
      <button onClick={handleGoogle} className="justify-center items-center flex gap-2 w-full border py-2 mt-3 rounded hover:bg-gray-50 "><span><FcGoogle /></span> Login with Google</button>
      <p className="mt-3 text-center text-sm">Don’t have an account? <Link to="/register" className="text-blue-500">Sign Up</Link></p>
    </div>
  );
}
