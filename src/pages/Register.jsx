import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const { register, googleLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", photoURL: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, photoURL } = form;

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6)
      return Swal.fire("Error", "Password must include uppercase, lowercase, and 6+ chars", "error");

    try {
      await register(email, password, name, photoURL);
      Swal.fire("Success", "Account created successfully", "success");
      navigate("/");
    } catch {
      Swal.fire("Error", "Registration failed", "error");
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      Swal.fire("Success", "Registered with Google", "success");
      navigate("/");
    } catch {
      Swal.fire("Error", "Google registration failed", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Full Name" className="border p-2 w-full mb-3" />
        <input name="photoURL" onChange={handleChange} placeholder="Photo URL" className="border p-2 w-full mb-3" />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-3" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-3" />
        <button className="bg-blue-500 text-white w-full py-2 rounded">Register</button>
      </form>
      <button onClick={handleGoogle} className="justify-center items-center flex gap-2 w-full border py-2 mt-3 rounded hover:bg-gray-50 "><span><FcGoogle /></span>Sign Up with Google</button>
      <p className="mt-3 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
}
