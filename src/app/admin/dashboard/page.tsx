"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  ShoppingCart,
  Users,
  Activity,
  CheckCircle,
  Calculator,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/charts";
import { motion } from "framer-motion";

/* ================= VARIANTS ================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* ================= KPI CARD ================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  accent: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <Card
        className="
          relative overflow-hidden border bg-card
          transition-all duration-300
          shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)]
          hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
          dark:shadow-none dark:border-border
        "
      >
        {/* Accent strip */}
        <div
          className={`absolute left-0 top-0 h-full w-1 ${accent}`}
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent className="space-y-1">
          {/* 🔽 UPDATED TYPOGRAPHY */}
          <p className="text-xl font-medium">
            {value}
          </p>

          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================= DASHBOARD PAGE ================= */

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Business performance overview
        </p>
      </motion.div>

      {/* KPI CARDS */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue}`}
          subtitle={`Today Revenue: ₹${data.todayRevenue}`}
          icon={Wallet}
          accent="bg-gradient-to-b from-emerald-500 to-emerald-300"
        />

        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          subtitle={`Today's Orders: ${data.todayOrders}`}
          icon={ShoppingCart}
          accent="bg-gradient-to-b from-blue-500 to-blue-300"
        />

        <StatCard
          title="Avg Order Value"
          value={`₹${data.averageOrderValue}`}
          subtitle={`Total Clients: ${data.totalClients}`}
          icon={Calculator}
          accent="bg-gradient-to-b from-violet-500 to-violet-300"
        />

        <StatCard
          title="Total Products"
          value={data.totalProducts}
          subtitle={`Total Categories: ${data.totalCategories}`}
          icon={Users}
          accent="bg-gradient-to-b from-cyan-500 to-cyan-300"
        />

        <StatCard
          title="Ongoing Orders"
          value={data.ongoingOrders}
          subtitle={`Upcoming Orders: ${data.upcomingOrders}`}
          icon={Activity}
          accent="bg-gradient-to-b from-amber-500 to-amber-300"
        />

        <StatCard
          title="Completed Orders"
          value={data.completedOrders}
          subtitle={`Cancelled Orders: ${data.cancelledOrders}`}
          icon={CheckCircle}
          accent="bg-gradient-to-b from-rose-500 to-rose-300"
        />
      </motion.div>

      {/* CHARTS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <DashboardCharts />
      </motion.div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import {
//   Wallet,
//   ShoppingCart,
//   Users,
//   Activity,
//   CheckCircle,
//   Calculator,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { DashboardCharts } from "@/components/dashboard/charts";

// /* ================= GRADIENT KPI CARD ================= */
// function StatCard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   gradient,
// }: {
//   title: string;
//   value: string | number;
//   subtitle: string;
//   icon: any;
//   gradient: string;
// }) {
//   return (
//     <div
//       className={`
//         relative
//         rounded-lg
//         px-4 py-4
//         text-white
//         shadow-sm
//         ${gradient}
//         min-h-[120px]
//       `}
//     >
//       {/* Decorative circles */}
//       <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
//       <div className="absolute bottom-0 right-10 h-16 w-16 rounded-full bg-white/10" />

//       <div className="relative z-10 flex justify-between items-start">
//         <div className="space-y-1">
//           <p className="text-sm opacity-90">{title}</p>
//           <p className="text-2xl font-semibold">{value}</p>
//           <p className="text-xs opacity-80">{subtitle}</p>
//         </div>

//         <div className="h-9 w-9 rounded-md bg-white/20 flex items-center justify-center">
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= DASHBOARD PAGE ================= */
// export default function AdminDashboardPage() {
//   const [range, setRange] = useState("today");
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetch(`/api/dashboard/stats?range=${range}`)
//       .then((res) => res.json())
//       .then(setData);
//   }, [range]);

//   if (!data) {
//     return <p className="text-muted-foreground">Loading dashboard...</p>;
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold">Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Business performance overview
//           </p>
//         </div>

//         {/* <div className="flex gap-2">
//           <Button
//             size="sm"
//             variant={range === "today" ? "default" : "outline"}
//             onClick={() => setRange("today")}
//           >
//             Today
//           </Button>
//           <Button
//             size="sm"
//             variant={range === "month" ? "default" : "outline"}
//             onClick={() => setRange("month")}
//           >
//             This Month
//           </Button>
//         </div> */}
//       </div>

//       {/* KPI CARDS */}
//    {/* KPI CARDS */}
// <div className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(220px,260px))] gap-8">
//   {/* ROW 1 */}
//   <StatCard
//     title="Total Revenue"
//     value={`₹${data.totalRevenue}`}
//     subtitle={`Today Revenue: ₹${data.todayRevenue}`}
//     icon={Wallet}
//     gradient="bg-gradient-to-r from-pink-400 to-orange-400"
//   />

//   <StatCard
//     title="Total Orders"
//     value={data.totalOrders}
//     subtitle={`Today's Orders: ${data.todayOrders}`}
//     icon={ShoppingCart}
//     gradient="bg-gradient-to-r from-blue-400 to-blue-600"
//   />

//   <StatCard
//     title="Avg Order Value"
//     value={`₹${data.averageOrderValue}`}
//     subtitle={`Total Clients: ${data.totalClients}`}
//     icon={Calculator}
//     gradient="bg-gradient-to-r from-indigo-400 to-purple-500"
//   />

//   {/* ROW 2 */}
//   <StatCard
//     title="Total Products"
//     value={data.totalProducts}
//     subtitle={`Total Categories: ${data.totalCategories}`}
//     icon={Users}
//     gradient="bg-gradient-to-r from-cyan-400 to-teal-500"
//   />

//   <StatCard
//     title="Ongoing Orders"
//     value={data.ongoingOrders}
//     subtitle={`Upcoming Orders: ${data.upcomingOrders}`}
//     icon={Activity}
//     gradient="bg-gradient-to-r from-emerald-400 to-green-500"
//   />

//   <StatCard
//     title="Completed Orders"
//     value={data.completedOrders}
//     subtitle={`Cancelled Orders: ${data.cancelledOrders}`}
//     icon={CheckCircle}
//     gradient="bg-gradient-to-r from-rose-400 to-pink-500"
//   />
// </div>


//       {/* CHARTS */}
//       <DashboardCharts />
//     </div>
//   );
// }