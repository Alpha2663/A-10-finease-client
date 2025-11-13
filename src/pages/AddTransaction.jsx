import { useState, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const categories = [
  "salary",
  "food",
  "transport",
  "bills",
  "entertainment",
  "home",
  "other",
];

export default function AddTransaction() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "expense",
    category: "other",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0)
      return Swal.fire("Error", "Enter a valid amount", "error");
    setLoading(true);
    try {
      await axiosSecure.post("/transactions", form);
      Swal.fire("Success", "Transaction added", "success");
      navigate("/my-transactions");
    } catch (err) {
      Swal.fire("Error", "Failed to add transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4 font-bold">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">User</div>
            <div className="font-medium">{user?.displayName || user?.email}</div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-700 text-white btn btn-primary p-2"
          >
            {loading ? <Spinner /> : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
