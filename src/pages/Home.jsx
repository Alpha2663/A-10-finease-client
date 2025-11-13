import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Home() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [summary, setSummary] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await axiosSecure.get("/transactions/summary");
          setSummary(res.data);
        } catch (err) {
          console.error("Failed to fetch summary:", err);
          setSummary({ balance: 0, totalIncome: 0, totalExpenses: 0 });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setSummary({ balance: 0, totalIncome: 0, totalExpenses: 0 });
      }
    };
    fetchSummary();
  }, [user, axiosSecure]);

  return (
    <div className="container mx-auto p-6">
      <div
        className="hero min-h-96 rounded-lg"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Take Control of Your Finances
            </h1>
            <p className="mb-5">
              FinEase helps you track your spending, manage your budget, and
              achieve your financial goals with ease.
            </p>
            <Link to="/add-transaction" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {user && (
        <div className="mt-6">
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Total Balance</div>
              <div className="stat-value">
                {loading ? <Spinner /> : `৳${summary.balance}`}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 0 100 4m0-4a2 0 110 4m-6 8a2 0 100-4m0 4a2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 0 100-4m0 4a2 0 110-4m0 4v2m0-6V4"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Total Income</div>
              <div className="stat-value">
                {loading ? <Spinner /> : `৳${summary.totalIncome}`}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 0 110-4h14a2 0 110 4M5 8v10a2 0 002 2h10a2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Total Expense</div>
              <div className="stat-value">
                {loading ? <Spinner /> : `৳${summary.totalExpenses}`}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-gray-700 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Budgeting Tips</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>Track every expense for a month to understand where money goes.</li>
              <li>Create a separate category for savings and pay yourself first.</li>
              <li>Set a monthly limit for discretionary spending.</li>
            </ul>
          </div>
        </div>
        <div className="bg-gray-700 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Why Financial Planning Matters</h2>
            <p className="text-sm">
              Financial planning helps you prepare for emergencies, achieve goals, and reduce stress about money.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
