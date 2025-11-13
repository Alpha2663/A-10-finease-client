import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { BsCashCoin } from "react-icons/bs";


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => {
            Swal.fire("Logged Out!", "You have been logged out.", "success");
          })
          .catch((error) => {
            Swal.fire("Error", error.message || "Logout failed", "error");
          });
      }
    });
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className=" bg-gray-700 text-white menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/add-transaction">Add Transaction</Link>
                  </li>
                  <li>
                    <Link to="/my-transactions">My Transactions</Link>
                  </li>
                  <li>
                    <Link to="/reports">Reports</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-4xl">
            <span><BsCashCoin /></span>FinEase
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/add-transaction">Add Transaction</Link>
                </li>
                <li>
                  <Link to="/my-transactions">My Transactions</Link>
                </li>
                <li>
                  <Link to="/reports">Reports</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="navbar-end">
        

          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Signup
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={user.photoURL || "https://www.gravatar.com/avatar/?d=mp"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="bg-gray-800 text-white menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <p className="justify-between">{user.displayName}</p>
                </li>
                <li>
                  <p>{user.email}</p>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
