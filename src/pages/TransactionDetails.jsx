import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

export default function TransactionDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [tx, setTx] = useState(null);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosSecure.get(`/transactions/${id}`);
        setTx(res.data);

        // Fetch all transactions to compute category total
        const allTxRes = await axiosSecure.get("/transactions");
        const categoryTransactions = allTxRes.data.filter(
          (t) => t.category === res.data.category && t.type === res.data.type
        );
        const total = categoryTransactions.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        setCategoryTotal(total);
      } catch (err) {
        Swal.fire("Error", "Failed to load transaction details", "error");
        setTx(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!tx) {
    return (
      <p className="text-center text-red-500 mt-10">
        Transaction not found.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-base-100 rounded-lg shadow-lg">
      <button className="bg-gray-700 text-white btn btn-ghost btn-sm mb-4 p-2" onClick={() => navigate(-1)}>
        ← Back to Transactions
      </button>
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-3xl capitalize">{tx.category}</h2>
          <div
            className={`badge ${
              tx.type === "income" ? "badge-success" : "badge-error"
            }`}
          >
            {tx.type}
          </div>
        </div>
        <p className="text-lg text-gray-500">
          {new Date(tx.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-xl my-4">{tx.description}</p>
        <div className="divider"></div>
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm text-gray-500">Transaction Amount</p>
            <p
              className={`text-2xl font-bold ${
                tx.type === "income" ? "text-green-500" : "text-red-500"
              }`}
            >
              {tx.type === "income" ? "+" : "-"} ৳{tx.amount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Total for this Category ({tx.type})
            </p>
            <p className="text-2xl font-bold">৳{categoryTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
