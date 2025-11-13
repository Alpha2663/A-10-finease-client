import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a78bfa", "#f472b6"];

export default function Reports() {
  const axiosSecure = useAxiosSecure();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        const categoryRes = await axiosSecure.get("/transactions/category-summary");
        setCategoryData(categoryRes.data);

        const monthlyRes = await axiosSecure.get("/transactions/monthly-summary", {
          params: { month: monthFilter },
        });
        setMonthlyData(monthlyRes.data);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch report data", "error");
        setCategoryData([]);
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, [axiosSecure, monthFilter]);

  // Transform data for recharts
  const pieChartData = categoryData.map((item) => ({
    name: `${item.category} (${item.type})`,
    value: item.totalAmount,
  }));

  const barChartData = monthlyData.reduce((acc, item) => {
    let entry = acc.find((e) => e.month === item.month);
    if (!entry) {
      entry = { month: item.month };
      acc.push(entry);
    }
    entry[item.type] = item.totalAmount;
    return acc;
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Financial Reports</h2>
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="input input-bordered"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-xl mb-4">Spending by Category</h3>
            {pieChartData.length === 0 ? (
              <p className="text-center text-gray-500">No data available for categories.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card bg-base-100 shadow-xl p-6">
            <h3 className="card-title text-xl mb-4">Monthly Overview</h3>
            {barChartData.length === 0 ? (
              <p className="text-center text-gray-500">No data available for monthly overview.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" name="Income" />
                  <Bar dataKey="expense" fill="#FA8072" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
