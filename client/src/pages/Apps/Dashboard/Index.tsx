import { useEffect, useState } from "react";
import { useApi } from "@/api";
import moment from "moment";
import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Dashboard = () => {
  const api = useApi();

  const [data, setData] = useState<any>({
    userCount: 0,
    recentUsers: [],
    usersByStatus: [],
  });

  const [chartSeries, setChartSeries] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartColors, setChartColors] = useState<string[]>([]);
  const [centerLabel, setCenterLabel] = useState<{ title: string; value: string }>(
    {
      title: "Total Users",
      value: "0",
    }
  );

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: "donut",
      toolbar: { show: false },
      animations: { enabled: true },
      id: "users-by-status",
      redrawOnParentResize: true,
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const index = config.dataPointIndex;
          if (index !== -1) {
            const selectedLabel = chartLabels[index];
            const selectedValue = chartSeries[index];

            setCenterLabel({
              title: selectedLabel,
              value: selectedValue.toString(),
            });
          }
        },
      },
    },
    stroke: { width: 3, colors: ["#fff"] },
    labels: [],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: { colors: "#6B7280" },
      markers: { size: 12 },
      itemMargin: { horizontal: 18, vertical: 0 },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
    colors: [],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/getdata");
      if (response.data?.success) {
        const d = response.data.data || {};

        d.recentUsers = (d.recentUsers || []).slice(0, 8);

        setData({
          ...data,
          userCount: d.userCount || 0,
          recentUsers: d.recentUsers,
          usersByStatus: d.usersByStatus || [],
        });

        const labels = (d.usersByStatus || []).map((x: any) => x.status);
        const series = (d.usersByStatus || []).map((x: any) => x.count);

        const colorMap: Record<string, string> = {
          Active: "#34D399",
          Inactive: "#EF4444",
        };

        const colors = labels.map((s: string) => colorMap[s] || "#9CA3AF");

        setChartLabels(labels);
        setChartSeries(series);
        setChartColors(colors);

        setChartOptions((prev) => ({
          ...prev,
          labels,
          colors,
          chart: {
            ...(prev.chart || {}),
            id: "users-by-status",
            redrawOnParentResize: true,
            events: {
              dataPointSelection: (_event, _chartContext, config) => {
                const index = config.dataPointIndex;
                if (index !== -1) {
                  const selectedLabel = labels[index];
                  const selectedValue = series[index];

                  setCenterLabel({
                    title: selectedLabel,
                    value: selectedValue.toString(),
                  });
                }
              },
            },
          },
        }));

        setCenterLabel({
          title: "Total Users",
          value: (d.userCount || 0).toString(),
        });

        setTimeout(() => {
          try {
            window.dispatchEvent(new Event("resize"));
          } catch {}
        }, 200);
      }
    } catch (err) {
      console.error("Dashboard data error", err);
    }
  };

  const getBadgeDetails = (isActive: boolean) => {
    return isActive
      ? { color: "success", label: "Active" }
      : { color: "error", label: "Inactive" };
  };

  const chartKey = JSON.stringify([chartSeries, chartLabels, chartColors]);

  return (
    <>
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          <div className="
            rounded-2xl border border-gray-200
            bg-white 
            dark:bg-[#0f172a]/50
            px-4 pb-5 pt-4 
            dark:border-gray-800 
            sm:px-6 
            flex flex-col 
            justify-start 
            h-[550px]
          ">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Recent Users
            </h3>

            <div className="flex-grow overflow-auto">
              {data.recentUsers && data.recentUsers.length > 0 ? (
                <Table>
                  <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50 dark:bg-white/5 rounded-t-xl">
                    <TableRow>
                      <TableCell isHeader className="py-3 px-4 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                        Full Name
                      </TableCell>
                      <TableCell isHeader className="py-3 px-4 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                        Phone
                      </TableCell>
                      <TableCell isHeader className="py-3 px-4 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                        Status
                      </TableCell>
                      <TableCell isHeader className="py-3 px-4 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                        Created At
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.recentUsers.map((u: any, i: number) => {
                      const { color, label } = getBadgeDetails(!!u.isActive);
                      return (
                        <TableRow key={i}>
                          <TableCell className="py-3 px-4 text-gray-800 text-theme-sm dark:text-white/90">
                            {u.fullname || "—"}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-800 text-theme-sm dark:text-white/90">
                            {u.phone || "—"}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <Badge size="sm" color={color as any}>{label}</Badge>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                            {moment(u.createdAt).format("DD MMM YYYY")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No recent users found.
                </p>
              )}
            </div>
          </div>
          
          <div className="
            rounded-2xl border border-gray-200 
            bg-white 
            dark:bg-[#0f172a]/50
            px-4 pb-2 pt-4 
            dark:border-gray-800
            sm:px-6 
            flex flex-col 
            justify-between 
            h-[550px]
          ">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Users by Status
            </h3>

            <div className="flex-grow relative flex flex-col justify-center items-center overflow-visible">
              {chartSeries && chartSeries.length > 0 ? (
                <div className="w-full flex flex-col items-center">
                  <Chart key={chartKey} options={chartOptions} series={chartSeries} type="donut" height={380} />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{centerLabel.title}</p>
                    <p className="text-gray-900 dark:text-white text-2xl font-semibold">
                      {centerLabel.value}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center h-80">
                  <p className="text-gray-500">No status data available.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
