"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function DashboardCharts() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/charts")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue */}
      <Card className="p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">
          Revenue Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders */}
      <Card className="p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">
          Orders Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}