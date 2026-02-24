import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiDollarSign,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiUserPlus,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
  FiFlag,
  FiAward,
  FiEye,
  FiEdit,
  FiTrash2,
  FiStar,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../config/api";


const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalCourses: 0,
      totalRevenue: 0,
      activeUsers: 0,
    },
    recentUsers: [],
    recentCourses: [],
    systemHealth: {
      status: "healthy",
      uptime: "99.9%",
      responseTime: "120ms",
    },
    recentActivity: [],
    alerts: [],
    revenue: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      growth: 0,
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use mock data for demo
      setDashboardData({
        stats: {
          totalUsers: 12847,
          totalCourses: 456,
          totalRevenue: 284590,
          activeUsers: 8934,
        },
        recentUsers: [
          {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            role: "student",
            joinedAt: "2026-02-23T10:30:00",
            status: "active",
          },
          {
            id: 2,
            name: "Michael Chen",
            email: "m.chen@example.com",
            role: "instructor",
            joinedAt: "2026-02-23T09:15:00",
            status: "active",
          },
          {
            id: 3,
            name: "Emma Williams",
            email: "emma.w@example.com",
            role: "student",
            joinedAt: "2026-02-23T08:45:00",
            status: "active",
          },
          {
            id: 4,
            name: "David Martinez",
            email: "d.martinez@example.com",
            role: "instructor",
            joinedAt: "2026-02-22T16:20:00",
            status: "active",
          },
        ],
        recentCourses: [
          {
            id: 1,
            title: "Advanced React Development",
            instructor: "John Doe",
            students: 456,
            status: "published",
            rating: 4.8,
          },
          {
            id: 2,
            title: "Python for Data Science",
            instructor: "Jane Smith",
            students: 632,
            status: "published",
            rating: 4.9,
          },
          {
            id: 3,
            title: "Full Stack Web Development",
            instructor: "Mike Johnson",
            students: 389,
            status: "pending",
            rating: 4.7,
          },
        ],
        systemHealth: {
          status: "healthy",
          uptime: "99.9%",
          responseTime: "120ms",
          activeConnections: 1247,
        },
        recentActivity: [
          {
            id: 1,
            type: "user",
            message: "New user registration: Sarah Johnson",
            time: "5 minutes ago",
          },
          {
            id: 2,
            type: "course",
            message: "Course published: Advanced React Development",
            time: "1 hour ago",
          },
          {
            id: 3,
            type: "payment",
            message: "Payment received: $299.99",
            time: "2 hours ago",
          },
          {
            id: 4,
            type: "report",
            message: "Content reported: Review on NodeJS course",
            time: "3 hours ago",
          },
        ],
        alerts: [
          {
            id: 1,
            type: "warning",
            message: "Server load at 85%",
            time: "10 minutes ago",
          },
          {
            id: 2,
            type: "info",
            message: "Database backup completed successfully",
            time: "2 hours ago",
          },
          {
            id: 3,
            type: "success",
            message: "System update installed",
            time: "5 hours ago",
          },
        ],
        revenue: {
          today: 2840,
          thisWeek: 18450,
          thisMonth: 68920,
          growth: 23.5,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: FiUserPlus,
      title: "Manage Users",
      desc: "View and manage users",
      color: "primary",
      action: () => navigate("/admin/users"),
    },
    {
      icon: FiBook,
      title: "Manage Courses",
      desc: "Review and approve courses",
      color: "accent",
      action: () => navigate("/admin/courses"),
    },
    {
      icon: FiBarChart2,
      title: "Analytics",
      desc: "View platform analytics",
      color: "success",
      action: () => navigate("/admin/analytics"),
    },
    {
      icon: FiSettings,
      title: "Settings",
      desc: "Platform configuration",
      color: "warning",
      action: () => navigate("/admin/settings"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--text-secondary)">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-primary)  pt-20">
      {/* Header */}
      <section className="bg-(--bg-surface) border-b border-(--border-color) px-6 md:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-(--text-secondary)">
                Welcome back, {user?.name || "Admin"}! Monitor and manage your
                platform
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/settings")}
                className="px-5 py-3 bg-(--card-bg) border-2 border-(--border-color) font-semibold rounded-xl hover:border-(--color-primary) transition-all flex items-center gap-2"
              >
                <FiSettings size={20} />
                Settings
              </button>
              <button
                onClick={() => navigate("/admin/reports")}
                className="px-5 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-hover) transition-all flex items-center gap-2"
              >
                <FiBarChart2 size={20} />
                View Reports
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            title="Total Users"
            value={dashboardData.stats.totalUsers.toLocaleString()}
            trend="+12.5%"
            trendUp={true}
            color="primary"
            subtitle={`${dashboardData.stats.activeUsers.toLocaleString()} active`}
          />
          <StatCard
            icon={FiBook}
            title="Total Courses"
            value={dashboardData.stats.totalCourses}
            trend="+8 new"
            trendUp={true}
            color="accent"
            subtitle="This month"
          />
          <StatCard
            icon={FiDollarSign}
            title="Total Revenue"
            value={`$${(dashboardData.stats.totalRevenue / 1000).toFixed(1)}k`}
            trend={`+${dashboardData.revenue.growth}%`}
            trendUp={true}
            color="success"
            subtitle="This month"
          />
          <StatCard
            icon={FiActivity}
            title="System Health"
            value={dashboardData.systemHealth.uptime}
            trend="Healthy"
            trendUp={true}
            color="warning"
            subtitle={dashboardData.systemHealth.responseTime}
          />
        </div>

        {/* Alerts Banner */}
        {dashboardData.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-(--color-warning)" />
                System Alerts
              </h3>
              <div className="space-y-3">
                {dashboardData.alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -4 }}
                onClick={action.action}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 text-left hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 bg-(--color-${action.color})/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon
                    className={`text-(--color-${action.color})`}
                    size={24}
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm text-(--text-secondary)">{action.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiDollarSign className="text-(--color-success)" />
                  Revenue Overview
                </h2>
                <button
                  onClick={() => navigate("/admin/revenue")}
                  className="text-(--color-primary) hover:underline text-sm font-medium"
                >
                  View Details →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-(--bg-surface) rounded-xl">
                  <p className="text-sm text-(--text-secondary) mb-2">Today</p>
                  <p className="text-2xl font-bold text-(--color-success)">
                    ${dashboardData.revenue.today.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-(--bg-surface) rounded-xl">
                  <p className="text-sm text-(--text-secondary) mb-2">
                    This Week
                  </p>
                  <p className="text-2xl font-bold text-(--color-success)">
                    ${dashboardData.revenue.thisWeek.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-(--bg-surface) rounded-xl">
                  <p className="text-sm text-(--text-secondary) mb-2">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-(--color-success)">
                    ${dashboardData.revenue.thisMonth.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <FiTrendingUp className="text-(--color-success)" />
                <span className="text-(--color-success) font-semibold">
                  +{dashboardData.revenue.growth}%
                </span>
                <span className="text-(--text-secondary)">vs last month</span>
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Users</h2>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="text-(--color-primary) hover:underline text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.recentUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </motion.div>

            {/* Recent Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Courses</h2>
                <button
                  onClick={() => navigate("/admin/courses")}
                  className="text-(--color-primary) hover:underline text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.recentCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiActivity className="text-(--color-success)" />
                System Health
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-(--text-secondary)">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-(--color-success) rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-(--color-success)">
                      {dashboardData.systemHealth.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-(--text-secondary)">
                    Uptime
                  </span>
                  <span className="text-sm font-semibold">
                    {dashboardData.systemHealth.uptime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-(--text-secondary)">
                    Response Time
                  </span>
                  <span className="text-sm font-semibold">
                    {dashboardData.systemHealth.responseTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-(--text-secondary)">
                    Active Connections
                  </span>
                  <span className="text-sm font-semibold">
                    {dashboardData.systemHealth.activeConnections?.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/admin/system")}
                className="w-full mt-6 px-4 py-2 bg-(--color-success) text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                View System Logs
              </button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiClock className="text-(--color-primary)" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button
                onClick={() => navigate("/admin/activity")}
                className="w-full mt-6 px-4 py-2 border-2 border-(--border-color) font-semibold rounded-xl hover:border-(--color-primary) transition-all"
              >
                View All Activity
              </button>
            </motion.div>

            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-linear-to-br from-(--color-primary)/10 to-(--color-accent)/10 border border-(--color-primary)/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-(--color-primary) rounded-xl flex items-center justify-center">
                  <FiAward className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold">Platform Stats</h3>
              </div>
              <div className="space-y-3">
                <StatItem label="Average Course Rating" value="4.8/5.0" />
                <StatItem label="Course Completion Rate" value="78%" />
                <StatItem label="Student Satisfaction" value="94%" />
                <StatItem label="Instructor Response Time" value="2.5 hrs" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendUp,
  color,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4 }}
    className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-(--color-${color})/10 rounded-xl flex items-center justify-center`}
      >
        <Icon className={`text-(--color-${color})`} size={24} />
      </div>
      <div className="flex items-center gap-1 text-xs font-medium">
        {trendUp ? (
          <FiTrendingUp className="text-(--color-success)" size={14} />
        ) : (
          <FiTrendingDown className="text-(--color-danger)" size={14} />
        )}
        <span
          className={
            trendUp ? "text-(--color-success)" : "text-(--color-danger)"
          }
        >
          {trend}
        </span>
      </div>
    </div>
    <h3 className="text-sm text-(--text-secondary) mb-2">{title}</h3>
    <p className="text-3xl font-bold mb-1">{value}</p>
    {subtitle && <p className="text-xs text-(--text-secondary)">{subtitle}</p>}
  </motion.div>
);

// Alert Item Component
const AlertItem = ({ alert }) => {
  const getAlertColor = () => {
    switch (alert.type) {
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "info":
        return "primary";
      default:
        return "danger";
    }
  };

  const getIcon = () => {
    switch (alert.type) {
      case "success":
        return <FiCheckCircle />;
      case "info":
        return <FiAlertCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 bg-(--color-${getAlertColor()})/10 rounded-lg border border-(--color-${getAlertColor()})/30`}
    >
      <div className={`text-(--color-${getAlertColor()}) mt-0.5`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{alert.message}</p>
        <span className="text-xs text-(--text-secondary)">{alert.time}</span>
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ user }) => {
  const getRoleBadge = (role) => {
    const colors = {
      student: "primary",
      instructor: "success",
      admin: "danger",
    };
    return colors[role] || "primary";
  };

  return (
    <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-(--color-primary)/10 rounded-full flex items-center justify-center shrink-0">
            <FiUsers className="text-(--color-primary)" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{user.name}</h4>
            <p className="text-xs text-(--text-secondary) truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span
            className={`px-2 py-1 bg-(--color-${getRoleBadge(user.role)})/10 text-(--color-${getRoleBadge(user.role)}) text-xs font-medium rounded-lg`}
          >
            {user.role}
          </span>
          <button className="p-1.5 hover:bg-(--bg-surface) rounded-lg transition-colors">
            <FiEye size={16} className="text-(--text-secondary)" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "pending":
        return "warning";
      case "draft":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1 truncate">{course.title}</h4>
          <p className="text-xs text-(--text-secondary)">
            by {course.instructor}
          </p>
        </div>
        <span
          className={`px-2 py-1 bg-(--color-${getStatusColor(course.status)})/10 text-(--color-${getStatusColor(course.status)}) text-xs font-medium rounded-lg shrink-0 ml-2`}
        >
          {course.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-(--text-secondary) mb-3">
        <span className="flex items-center gap-1">
          <FiUsers size={14} />
          {course.students}
        </span>
        <span className="flex items-center gap-1">
          <FiStar className="text-(--color-warning)" size={14} />
          {course.rating}
        </span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-3 py-1.5 bg-(--bg-surface) border border-(--border-color) rounded-lg hover:border-(--color-primary) transition-all text-xs font-medium">
          <FiEdit className="inline mr-1" size={12} />
          Edit
        </button>
        <button className="flex-1 px-3 py-1.5 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-hover) transition-all text-xs font-medium">
          <FiEye className="inline mr-1" size={12} />
          View
        </button>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "user":
        return <FiUserPlus className="text-(--color-primary)" />;
      case "course":
        return <FiBook className="text-(--color-accent)" />;
      case "payment":
        return <FiDollarSign className="text-(--color-success)" />;
      case "report":
        return <FiFlag className="text-(--color-warning)" />;
      default:
        return <FiActivity className="text-(--text-secondary)" />;
    }
  };

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-(--border-color) last:border-0 last:pb-0">
      <div className="w-8 h-8 bg-(--bg-surface) rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm mb-1">{activity.message}</p>
        <span className="text-xs text-(--text-secondary)">{activity.time}</span>
      </div>
    </div>
  );
};

// Stat Item Component
const StatItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-(--border-color) last:border-0">
    <span className="text-sm text-(--text-secondary)">{label}</span>
    <span className="text-sm font-bold">{value}</span>
  </div>
);

export default AdminHome;
