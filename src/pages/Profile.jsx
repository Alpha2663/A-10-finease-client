import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Spinner from "../components/Spinner";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update Firebase profile
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });

      // Update backend profile
      await axiosSecure.put("/users/profile", {
        name,
        photoURL,
      });

      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl max-w-lg mx-auto">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-4">My Profile</h2>
          <div className="avatar flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={user?.photoURL || "https://www.gravatar.com/avatar/?d=mp"}
                alt="user"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full "
                placeholder="Your Name"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full"
                placeholder="URL for your profile picture"
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input input-bordered w-full "
              />
            </div>
            <div className="flex justify-center mt-6 form-control">
              <button type="submit" className="bg-gray-700 text-white btn btn-primary p-2" disabled={loading}>
                {loading ? <Spinner /> : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}