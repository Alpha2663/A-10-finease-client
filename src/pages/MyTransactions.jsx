import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function MyTransactions() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // Default sort by date
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await axiosSecure.get("/transactions", {
            params: { sortBy, order },
          });
          setTransactions(res.data);
        } catch (err) {
          Swal.fire("Error", "Failed to fetch transactions", "error");
          setTransactions([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTransactions();
  }, [user, sortBy, order, axiosSecure]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/transactions/${id}`);
          Swal.fire("Deleted!", "Your transaction has been deleted.", "success");
          setTransactions((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
          Swal.fire("Error", "Failed to delete transaction", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Transactions</h2>
        <div className="flex items-center gap-4 py-2 p-2 text-sm sm:text-base sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 "
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-full  sm:w-auto  "
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              You have no transactions yet.
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'} ৳{tx.amount}
                      </p>
                      <p className="text-sm text-gray-500">{tx.category}</p>
                    </div>
                    <div className="bg-gray-700 text-white badge badge-ghost">{new Date(tx.date).toLocaleDateString()}</div>
                  </div>
                  <p className="mt-2">{tx.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => navigate(`/transaction/${tx._id}`)}
                      className="bg-gray-700 text-white btn btn-sm btn-info p-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/transaction/update/${tx._id}`)}
                      className="bg-gray-700 text-white btn btn-sm btn-warning p-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="bg-gray-700 text-white btn btn-sm btn-error p-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
