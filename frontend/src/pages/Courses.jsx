import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiStar,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

const Courses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    price: "all",
    rating: 0,
    sort: "popular",
  });

  const categories = [
    { id: "all", label: t("coursesPage.filters.categories.all") },
    { id: "web", label: t("coursesPage.filters.categories.web") },
    { id: "mobile", label: t("coursesPage.filters.categories.mobile") },
    { id: "data", label: t("coursesPage.filters.categories.data") },
    { id: "design", label: t("coursesPage.filters.categories.design") },
    { id: "business", label: t("coursesPage.filters.categories.business") },
  ];

  const levels = [
    { id: "all", label: t("coursesPage.filters.levels.all") },
    { id: "beginner", label: t("coursesPage.filters.levels.beginner") },
    {
      id: "intermediate",
      label: t("coursesPage.filters.levels.intermediate"),
    },
    { id: "advanced", label: t("coursesPage.filters.levels.advanced") },
  ];

  const prices = [
    { id: "all", label: t("coursesPage.filters.prices.all") },
    { id: "free", label: t("coursesPage.filters.prices.free") },
    { id: "paid", label: t("coursesPage.filters.prices.paid") },
  ];

  const levelLabelMap = {
    beginner: t("coursesPage.filters.levels.beginner"),
    intermediate: t("coursesPage.filters.levels.intermediate"),
    advanced: t("coursesPage.filters.levels.advanced"),
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (course) => course.category === filters.category,
      );
    }

    // Level filter
    if (filters.level !== "all") {
      filtered = filtered.filter((course) => course.level === filters.level);
    }

    // Price filter
    if (filters.price === "free") {
      filtered = filtered.filter((course) => course.price === 0);
    } else if (filters.price === "paid") {
      filtered = filtered.filter((course) => course.price > 0);
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((course) => course.rating >= filters.rating);
    }

    // Sorting
    switch (filters.sort) {
      case "popular":
        filtered.sort((a, b) => b.students - a.students);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, filters, searchQuery]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Mock data - replace with API call
      const mockCourses = [
        {
          id: 1,
          title: "Advanced React Development",
          category: "web",
          level: "advanced",
          price: 99.99,
          rating: 4.8,
          reviews: 128,
          students: 2450,
          duration: "24 weeks",
          image:
            "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop",
          instructor: "John Doe",
          description:
            "Master React with hooks, context, and performance optimization",
          popular: true,
        },
        {
          id: 2,
          title: "Python for Data Science",
          category: "data",
          level: "intermediate",
          price: 79.99,
          rating: 4.9,
          reviews: 256,
          students: 3890,
          duration: "16 weeks",
          image:
            "https://images.unsplash.com/photo-1526374965328-7f5ae4e8e90f?w=400&h=250&fit=crop",
          instructor: "Jane Smith",
          description:
            "Learn data analysis, machine learning, and visualization",
          popular: true,
        },
        {
          id: 3,
          title: "UI/UX Design Fundamentals",
          category: "design",
          level: "beginner",
          price: 59.99,
          rating: 4.7,
          reviews: 98,
          students: 1205,
          duration: "12 weeks",
          image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
          instructor: "Sarah Wilson",
          description: "Create beautiful and user-friendly digital experiences",
          popular: false,
        },
        {
          id: 4,
          title: "Full Stack Web Development",
          category: "web",
          level: "intermediate",
          price: 89.99,
          rating: 4.6,
          reviews: 187,
          students: 2856,
          duration: "20 weeks",
          image:
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
          instructor: "Mike Johnson",
          description: "Master frontend, backend, and database technologies",
          popular: true,
        },
        {
          id: 5,
          title: "Mobile App Development with Flutter",
          category: "mobile",
          level: "intermediate",
          price: 69.99,
          rating: 4.5,
          reviews: 76,
          students: 945,
          duration: "18 weeks",
          image:
            "https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=400&h=250&fit=crop",
          instructor: "Emma Davis",
          description: "Build cross-platform mobile apps efficiently",
          popular: false,
        },
        {
          id: 6,
          title: "Digital Marketing Mastery",
          category: "business",
          level: "beginner",
          price: 49.99,
          rating: 4.4,
          reviews: 142,
          students: 1687,
          duration: "10 weeks",
          image:
            "https://images.unsplash.com/photo-1460925895917-adf4ee868993?w=400&h=250&fit=crop",
          instructor: "Alex Brown",
          description: "Master SEO, social media, and content marketing",
          popular: false,
        },
        {
          id: 7,
          title: "JavaScript Mastery",
          category: "web",
          level: "beginner",
          price: 0,
          rating: 4.8,
          reviews: 543,
          students: 8934,
          duration: "14 weeks",
          image:
            "https://images.unsplash.com/photo-1517694712555-31fde8dc9c0f?w=400&h=250&fit=crop",
          instructor: "Chris Lee",
          description:
            "Learn JavaScript from fundamentals to advanced concepts",
          popular: true,
        },
        {
          id: 8,
          title: "AWS Cloud Architecture",
          category: "web",
          level: "advanced",
          price: 129.99,
          rating: 4.7,
          reviews: 109,
          students: 1456,
          duration: "22 weeks",
          image:
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=250&fit=crop",
          instructor: "David Martinez",
          description: "Design and deploy scalable cloud solutions",
          popular: false,
        },
      ];

      setCourses(mockCourses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--text-secondary)">{t("coursesPage.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-primary) pt-24">
      {/* Hero Section */}
      <section className="bg-(--bg-surface) border-b border-(--border-color) px-6 md:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("coursesPage.hero.title")}
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8 max-w-2xl">
            {t("coursesPage.hero.subtitle")}
          </p>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-secondary)"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("coursesPage.hero.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-4 bg-(--card-bg) border border-(--border-color) rounded-2xl focus:outline-none focus:border-(--color-primary) text-(--text-primary)"
            />
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 sticky top-24 space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiFilter size={20} />
                {t("coursesPage.filters.title")}
              </h2>

              {/* Category Filter */}
              <FilterSection title={t("coursesPage.filters.category")}>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-(--bg-surface) rounded-lg"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={filters.category === cat.id}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Level Filter */}
              <FilterSection title={t("coursesPage.filters.level")}>
                {levels.map((lvl) => (
                  <label
                    key={lvl.id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-(--bg-surface) rounded-lg"
                  >
                    <input
                      type="radio"
                      name="level"
                      value={lvl.id}
                      checked={filters.level === lvl.id}
                      onChange={(e) =>
                        handleFilterChange("level", e.target.value)
                      }
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <span className="text-sm">{lvl.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Price Filter */}
              <FilterSection title={t("coursesPage.filters.price")}>
                {prices.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-(--bg-surface) rounded-lg"
                  >
                    <input
                      type="radio"
                      name="price"
                      value={p.id}
                      checked={filters.price === p.id}
                      onChange={(e) =>
                        handleFilterChange("price", e.target.value)
                      }
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection title={t("coursesPage.filters.rating")}>
                {[5, 4, 3, 0].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-(--bg-surface) rounded-lg"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) =>
                        handleFilterChange("rating", parseInt(e.target.value))
                      }
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <div className="flex items-center gap-1">
                      {rating > 0 ? (
                        <>
                          <span className="text-sm font-medium">
                            {t("coursesPage.filters.ratingPlus", { rating })}
                          </span>
                          <div className="flex gap-0.5">
                            {[...Array(rating)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={12}
                                className="fill-current text-(--color-warning)"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm">
                          {t("coursesPage.filters.allRatings")}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </FilterSection>
            </motion.div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Top Bar - Sort and View Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
            >
              <p className="text-(--text-secondary)">
                {t("coursesPage.showing", {
                  count: filteredCourses.length,
                })}
              </p>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-xl focus:outline-none focus:border-(--color-primary) text-(--text-primary)"
                >
                  <option value="popular">
                    {t("coursesPage.sort.popular")}
                  </option>
                  <option value="rating">{t("coursesPage.sort.rating")}</option>
                  <option value="newest">{t("coursesPage.sort.newest")}</option>
                  <option value="price-low">
                    {t("coursesPage.sort.priceLow")}
                  </option>
                  <option value="price-high">
                    {t("coursesPage.sort.priceHigh")}
                  </option>
                </select>

                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-2 bg-(--card-bg) border border-(--border-color) rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-(--color-primary) text-white"
                        : "text-(--text-secondary) hover:bg-(--bg-surface)"
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-(--color-primary) text-white"
                        : "text-(--text-secondary) hover:bg-(--bg-surface)"
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden p-2 bg-(--card-bg) border border-(--border-color) rounded-xl"
                >
                  {showMobileFilters ? (
                    <FiX size={18} />
                  ) : (
                    <FiFilter size={18} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-(--card-bg) border border-(--border-color) rounded-2xl space-y-6 lg:hidden"
              >
                <FilterSection title={t("coursesPage.filters.category")}>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 p-2">
                      <input
                        type="radio"
                        name="category-mobile"
                        value={cat.id}
                        checked={filters.category === cat.id}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{cat.label}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection title={t("coursesPage.filters.level")}>
                  {levels.map((lvl) => (
                    <label key={lvl.id} className="flex items-center gap-3 p-2">
                      <input
                        type="radio"
                        name="level-mobile"
                        value={lvl.id}
                        checked={filters.level === lvl.id}
                        onChange={(e) =>
                          handleFilterChange("level", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{lvl.label}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection title={t("coursesPage.filters.price")}>
                  {prices.map((p) => (
                    <label key={p.id} className="flex items-center gap-3 p-2">
                      <input
                        type="radio"
                        name="price-mobile"
                        value={p.id}
                        checked={filters.price === p.id}
                        onChange={(e) =>
                          handleFilterChange("price", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{p.label}</span>
                    </label>
                  ))}
                </FilterSection>
              </motion.div>
            )}

            {/* Courses Grid/List */}
            {filteredCourses.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className={`
                      cursor-pointer group
                      ${
                        viewMode === "grid"
                          ? "bg-(--card-bg) border border-(--border-color) rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                          : "flex gap-4 bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 hover:shadow-lg transition-all"
                      }
                    `}
                  >
                    {/* Course Image */}
                    <div
                      className={`relative overflow-hidden ${viewMode === "grid" ? "h-40" : "w-32 h-32 shrink-0"}`}
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {course.popular && (
                        <div className="absolute top-3 left-3 bg-(--color-primary) text-white px-3 py-1 rounded-full text-xs font-bold">
                          {t("coursesPage.badges.popular")}
                        </div>
                      )}
                      {course.price === 0 && (
                        <div className="absolute top-3 right-3 bg-(--color-success) text-white px-3 py-1 rounded-full text-xs font-bold">
                          {t("coursesPage.badges.free")}
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-(--color-primary) uppercase">
                          {
                            categories.find((c) => c.id === course.category)
                              ?.label
                          }
                        </span>
                        <span className="text-xs font-medium text-(--color-primary) px-2 py-1 bg-(--color-primary)/10 rounded-lg">
                          {levelLabelMap[course.level] || course.level}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-(--color-primary) transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-sm text-(--text-secondary) line-clamp-2 mb-4">
                        {course.description}
                      </p>

                      <p className="text-sm font-medium text-(--text-secondary) mb-3">
                        {t("coursesPage.byInstructor", {
                          name: course.instructor,
                        })}
                      </p>

                      <div className="flex items-center flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <FiStar
                            size={16}
                            className="fill-current text-(--color-warning)"
                          />
                          <span className="font-semibold">{course.rating}</span>
                          <span className="text-xs text-(--text-secondary)">
                            ({course.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-(--text-secondary) text-sm">
                          <FiUsers size={16} />
                          {(course.students / 1000).toFixed(1)}k
                        </div>
                        <div className="flex items-center gap-1 text-(--text-secondary) text-sm">
                          <FiClock size={16} />
                          {course.duration}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">
                          {course.price === 0 ? (
                            <span className="text-(--color-success)">
                              {t("coursesPage.badges.free")}
                            </span>
                          ) : (
                            `$${course.price}`
                          )}
                        </p>
                        <button className="px-4 py-2 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 transition-all">
                          {t("coursesPage.viewCourse")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-(--text-secondary) mb-4">
                  {t("coursesPage.empty.title")}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      category: "all",
                      level: "all",
                      price: "all",
                      rating: 0,
                      sort: "popular",
                    });
                  }}
                  className="px-6 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:opacity-90"
                >
                  {t("coursesPage.empty.reset")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ title, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between font-bold mb-3 p-2 hover:bg-(--bg-surface) rounded-lg"
      >
        <span>{title}</span>
        {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </button>
      {expanded && <div className="space-y-1">{children}</div>}
    </div>
  );
};

export default Courses;
