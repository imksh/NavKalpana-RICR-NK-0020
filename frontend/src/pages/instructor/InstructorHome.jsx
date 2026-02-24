import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiUsers,
  FiDollarSign,
  FiStar,
  FiPlus,
  FiTrendingUp,
  FiClock,
  FiMessageCircle,
  FiEye,
  FiEdit,
  FiBarChart2,
  FiAward,
  FiCalendar,
  FiActivity,
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../config/api";
import { useAuthStore } from "../../store/useAuthStore";

const InstructorHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      averageRating: 0,
    },
    recentCourses: [],
    upcomingSessions: [],
    recentActivity: [],
    earnings: {
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/instructor/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use mock data for demo
      setDashboardData({
        stats: {
          totalCourses: 12,
          totalStudents: 1847,
          totalRevenue: 28450,
          averageRating: 4.7,
        },
        recentCourses: [
          {
            id: 1,
            title: "Advanced Web Development",
            students: 456,
            revenue: 8920,
            rating: 4.8,
            progress: 85,
          },
          {
            id: 2,
            title: "React Masterclass 2026",
            students: 632,
            revenue: 12340,
            rating: 4.9,
            progress: 92,
          },
          {
            id: 3,
            title: "NodeJS Complete Guide",
            students: 389,
            revenue: 7590,
            rating: 4.6,
            progress: 78,
          },
        ],
        upcomingSessions: [
          {
            id: 1,
            title: "Live Q&A Session",
            course: "Advanced Web Development",
            date: "2026-02-24",
            time: "10:00 AM",
            participants: 45,
          },
          {
            id: 2,
            title: "Project Review",
            course: "React Masterclass 2026",
            date: "2026-02-25",
            time: "2:00 PM",
            participants: 32,
          },
        ],
        recentActivity: [
          {
            id: 1,
            type: "review",
            user: "Sarah Johnson",
            message: "Left a 5-star review on Advanced Web Development",
            time: "2 hours ago",
          },
          {
            id: 2,
            type: "question",
            user: "Michael Chen",
            message: "Asked a question in React Masterclass",
            time: "5 hours ago",
          },
          {
            id: 3,
            type: "enrollment",
            user: "Emma Williams",
            message: "Enrolled in NodeJS Complete Guide",
            time: "1 day ago",
          },
        ],
        earnings: {
          thisMonth: 12340,
          lastMonth: 10250,
          growth: 20.4,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: FiPlus,
      title: "Create Course",
      desc: "Start a new course",
      color: "primary",
      action: () => navigate("/instructor/courses/create"),
    },
    {
      icon: FiEdit,
      title: "Manage Content",
      desc: "Edit your courses",
      color: "accent",
      action: () => navigate("/instructor/courses"),
    },
    {
      icon: FiBarChart2,
      title: "View Analytics",
      desc: "Check performance",
      color: "success",
      action: () => navigate("/instructor/analytics"),
    },
    {
      icon: FiMessageCircle,
      title: "Q&A Center",
      desc: "Answer questions",
      color: "warning",
      action: () => navigate("/instructor/questions"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center pt-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--text-secondary)">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-primary) pt-20">
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
                Welcome back, {user?.name || "Instructor"}! 👋
              </h1>
              <p className="text-(--text-secondary)">
                Here's what's happening with your courses today
              </p>
            </div>
            <button
              onClick={() => navigate("/instructor/courses/create")}
              className="px-6 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-hover) transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <FiPlus size={20} />
              Create New Course
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiBook}
            title="Total Courses"
            value={dashboardData.stats.totalCourses}
            color="primary"
            trend="+2 this month"
          />
          <StatCard
            icon={FiUsers}
            title="Total Students"
            value={dashboardData.stats.totalStudents.toLocaleString()}
            color="accent"
            trend="+156 this week"
          />
          <StatCard
            icon={FiDollarSign}
            title="Total Revenue"
            value={`$${dashboardData.stats.totalRevenue.toLocaleString()}`}
            color="success"
            trend={`+${dashboardData.earnings.growth}%`}
          />
          <StatCard
            icon={FiStar}
            title="Average Rating"
            value={dashboardData.stats.averageRating.toFixed(1)}
            color="warning"
            trend="Excellent"
          />
        </div>

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
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Courses</h2>
                <button
                  onClick={() => navigate("/instructor/courses")}
                  className="text-(--color-primary) hover:underline text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiCalendar className="text-(--color-primary)" />
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {dashboardData.upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Earnings Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Earnings</h3>
                <FiTrendingUp className="text-(--color-success)" size={24} />
              </div>

              <div className="mb-6">
                <p className="text-sm text-(--text-secondary) mb-2">
                  This Month
                </p>
                <p className="text-3xl font-bold text-(--color-success)">
                  ${dashboardData.earnings.thisMonth.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm text-(--color-success)">
                    <FiTrendingUp size={16} />
                    <span>+{dashboardData.earnings.growth.toFixed(1)}%</span>
                  </div>
                  <span className="text-sm text-(--text-secondary)">
                    vs last month
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-(--border-color)">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-(--text-secondary)">
                    Last Month
                  </span>
                  <span className="font-semibold">
                    ${dashboardData.earnings.lastMonth.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/instructor/earnings")}
                className="w-full mt-6 px-4 py-2 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-hover) transition-all"
              >
                View Earnings Report
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
                <FiActivity className="text-(--color-primary)" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button
                onClick={() => navigate("/instructor/activity")}
                className="w-full mt-6 px-4 py-2 border-2 border-(--border-color) font-semibold rounded-xl hover:border-(--color-primary) transition-all"
              >
                View All Activity
              </button>
            </motion.div>

            {/* Performance Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-linear-to-br from-(--color-primary)/10 to-(--color-accent)/10 border border-(--color-primary)/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-(--color-primary) rounded-xl flex items-center justify-center">
                  <FiTarget className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold">Pro Tips</h3>
              </div>
              <ul className="space-y-3">
                <TipItem text="Respond to student questions within 24 hours" />
                <TipItem text="Update course content regularly" />
                <TipItem text="Host live sessions to boost engagement" />
                <TipItem text="Encourage students to leave reviews" />
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color, trend }) => (
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
      <span className="text-xs text-(--color-success) font-medium">
        {trend}
      </span>
    </div>
    <h3 className="text-sm text-(--text-secondary) mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

// Course Card Component
const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-(--color-primary) transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <FiUsers size={16} />
              {course.students} students
            </span>
            <span className="flex items-center gap-1">
              <FiStar size={16} className="text-(--color-warning)" />
              {course.rating}
            </span>
            <span className="flex items-center gap-1">
              <FiDollarSign size={16} />${course.revenue.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
          className="p-2 hover:bg-(--bg-surface) rounded-lg transition-colors"
        >
          <FiEdit size={20} className="text-(--text-secondary)" />
        </button>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-(--text-secondary)">Course Progress</span>
          <span className="font-semibold">{course.progress}%</span>
        </div>
        <div className="w-full bg-(--bg-surface) rounded-full h-2">
          <div
            className="bg-(--color-primary) h-2 rounded-full transition-all"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => navigate(`/instructor/courses/${course.id}/analytics`)}
          className="flex-1 px-4 py-2 bg-(--bg-surface) border border-(--border-color) rounded-lg hover:border-(--color-primary) transition-all text-sm font-medium"
        >
          <FiBarChart2 className="inline mr-2" size={16} />
          Analytics
        </button>
        <button
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
          className="flex-1 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-hover) transition-all text-sm font-medium"
        >
          <FiEye className="inline mr-2" size={16} />
          View Course
        </button>
      </div>
    </motion.div>
  );
};

// Session Card Component
const SessionCard = ({ session }) => (
  <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-bold text-lg mb-1">{session.title}</h4>
        <p className="text-sm text-(--text-secondary)">{session.course}</p>
      </div>
      <div className="w-10 h-10 bg-(--color-primary)/10 rounded-lg flex items-center justify-center">
        <FiClock className="text-(--color-primary)" size={20} />
      </div>
    </div>

    <div className="flex items-center gap-4 mb-4 text-sm">
      <span className="flex items-center gap-1 text-(--text-secondary)">
        <FiCalendar size={16} />
        {new Date(session.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      <span className="flex items-center gap-1 text-(--text-secondary)">
        <FiClock size={16} />
        {session.time}
      </span>
      <span className="flex items-center gap-1 text-(--text-secondary)">
        <FiUsers size={16} />
        {session.participants} registered
      </span>
    </div>

    <button className="w-full px-4 py-2 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-(--color-primary-hover) transition-all">
      Start Session
    </button>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "review":
        return <FiStar className="text-(--color-warning)" />;
      case "question":
        return <FiMessageCircle className="text-(--color-primary)" />;
      case "enrollment":
        return <FiCheckCircle className="text-(--color-success)" />;
      default:
        return <FiAlertCircle className="text-(--text-secondary)" />;
    }
  };

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-(--border-color) last:border-0 last:pb-0">
      <div className="w-8 h-8 bg-(--bg-surface) rounded-lg flex items-center justify-center shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1">{activity.user}</p>
        <p className="text-xs text-(--text-secondary) mb-1">
          {activity.message}
        </p>
        <span className="text-xs text-(--text-secondary)">{activity.time}</span>
      </div>
    </div>
  );
};

// Tip Item Component
const TipItem = ({ text }) => (
  <li className="flex items-start gap-2 text-sm">
    <FiCheckCircle
      className="text-(--color-success) shrink-0 mt-0.5"
      size={16}
    />
    <span className="text-(--text-secondary)">{text}</span>
  </li>
);

export default InstructorHome;
