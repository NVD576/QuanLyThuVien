import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { authApis, endpoints } from "../configs/API";
import {
  FiBookOpen,
  FiUsers,
  FiAlertTriangle,
  FiDollarSign,
} from "react-icons/fi";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ icon, title, value, color, isCurrency = false }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">
        {isCurrency
          ? (value || 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : value?.toLocaleString("vi-VN") || 0}
      </p>
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-80">{children}</div>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topBooks, setTopBooks] = useState([]);
  const [loadingTopBooks, setLoadingTopBooks] = useState(true);

  const fetchTopBooks = async () => {
    try {
      setLoadingTopBooks(true);
      const res = await authApis().get(`${endpoints.statistics}/top5-books`);
      setTopBooks(res.data);
    } catch (err) {
      console.error("Error fetching top books:", err);
    } finally {
      setLoadingTopBooks(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Nếu filter không phải "all" mà chưa chọn ngày, không gọi API
      if (filter !== "all" && (!startDate || !endDate)) {
        setStats(null);
        setLoading(false);
        return;
      }

      let sDate = startDate;
      let eDate = endDate;

      if (filter === "monthly") {
        const [startY, startM] = startDate.split("-");
        const [endY, endM] = endDate.split("-");
        sDate = `${startY}-${startM}-01`;
        const endDay = new Date(Number(endY), Number(endM), 0).getDate();
        eDate = `${endY}-${endM}-${endDay}`;
      } else if (filter === "yearly") {
        sDate = `${startDate}-01-01`;
        eDate = `${endDate}-12-31`;
      }

      const url =
        filter === "all"
          ? endpoints.statistics
          : `${endpoints.statistics}/range`;
      const params = {};

      if (filter !== "all") {
        params.startDate = sDate;
        params.endDate = eDate;
      }

      const res = await authApis().get(url, { params });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Không thể tải dữ liệu thống kê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, startDate, endDate]);

  useEffect(() => {
    fetchTopBooks();
  }, []);
  const topBooksChartData = {
    labels: topBooks.map((b) => b.title),
    datasets: [
      {
        label: "Số lần mượn",
        data: topBooks.map((b) => b.borrowCount),
        backgroundColor: "rgba(54,162,235,0.6)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  const bookChartData = {
    labels: ["Tổng sách", "Bản sao có sẵn", "Sách đang mượn", "Sách quá hạn"],
    datasets: [
      {
        label: "Thống kê Sách",
        data: [
          stats?.totalBooks || 0,
          stats?.availableCopies || 0,
          stats?.borrowedBooks || 0,
          stats?.overdueBooks || 0,
        ],
        backgroundColor: [
          "rgba(54,162,235,0.6)",
          "rgba(75,192,192,0.6)",
          "rgba(255,159,64,0.6)",
          "rgba(255,99,132,0.6)",
        ],
        borderColor: [
          "rgba(54,162,235,1)",
          "rgba(75,192,192,1)",
          "rgba(255,159,64,1)",
          "rgba(255,99,132,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const userChartData = {
    labels: ["Bạn đọc", "Thủ thư"],
    datasets: [
      {
        label: "Thống kê Người dùng",
        data: [stats?.totalReaders || 0, stats?.totalLibrarians || 0],
        backgroundColor: ["rgba(153,102,255,0.6)", "rgba(255,206,86,0.6)"],
        borderColor: ["rgba(153,102,255,1)", "rgba(255,206,86,1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full ">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Thống kê Thư viện
      </h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Tất cả</option>
          <option value="daily">Theo ngày</option>
          <option value="monthly">Theo tháng</option>
          <option value="yearly">Theo năm</option>
        </select>

        {filter !== "all" && (
          <>
            <input
              type={
                filter === "daily"
                  ? "date"
                  : filter === "monthly"
                  ? "month"
                  : "number"
              }
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Bắt đầu"
              className="p-2 border rounded w-40"
            />
            <span className="mx-2">đến</span>
            <input
              type={
                filter === "daily"
                  ? "date"
                  : filter === "monthly"
                  ? "month"
                  : "number"
              }
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Kết thúc"
              min={startDate}   
              className="p-2 border rounded w-40"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          icon={<FiBookOpen size={24} className="text-white" />}
          title="Tổng tiền phạt đã thu"
          value={stats?.totalFinesReturned || 0}
          color="bg-blue-500"
          isCurrency
        />
        <StatCard
          icon={<FiDollarSign size={24} className="text-white" />}
          title="Tiền phạt đang chờ"
          value={stats?.totalFines || 0}
          color="bg-yellow-500"
          isCurrency
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={<FiBookOpen size={24} className="text-white" />}
          title="Sách đang mượn"
          value={stats?.borrowedBooks || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={<FiUsers size={24} className="text-white" />}
          title="Tổng số bạn đọc"
          value={stats?.totalReaders || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={<FiAlertTriangle size={24} className="text-white" />}
          title="Sách quá hạn"
          value={stats?.overdueBooks || 0}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Thống kê Sách">
          <Bar
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
            data={bookChartData}
          />
        </ChartContainer>
        <ChartContainer title="Thống kê Người dùng">
          <Bar
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
            data={userChartData}
          />
        </ChartContainer>
        <ChartContainer title="Top 5 sách được mượn nhiều nhất">
          {loadingTopBooks ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <Bar
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
              data={topBooksChartData}
            />
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default Statistics;
