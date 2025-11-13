import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

export default function UpdateTransaction() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await axiosSecure.get(`/transactions/${id}`);
        const data = res.data;
        setForm({
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description || "",
          date: new Date(data.date).toISOString().slice(0, 10),
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load transaction", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchTx();
  }, [id, axiosSecure]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosSecure.put(`/transactions/${id}`, form);
      Swal.fire("Success", "Transaction updated", "success");
      navigate(`/my-transactions`);
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!form) {
    return <p className="text-center text-red-500">Transaction not found.</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4 font-bold">Edit Transaction</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-700 text-white btn btn-primary w-full"
        >
          {loading ? <Spinner /> : "Update Transaction"}
        </button>
      </form>
    </div>
  );
}
