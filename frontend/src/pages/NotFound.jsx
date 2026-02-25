import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const homePath = !user
    ? "/"
    : user.role === "admin"
      ? "/admin"
      : user.role === "instructor"
        ? "/instructor"
        : "/student";

  return (
    <div className="min-h-[72dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-(--border-color) bg-(--card-bg) p-8 md:p-10 text-center shadow-sm">
        <div className="mx-auto w-fit rounded-full border border-(--border-color) bg-(--bg-muted) p-4">
          <FiAlertTriangle className="text-(--color-warning)" size={36} />
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-(--text-secondary)">
          404 ERROR
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-(--text-primary)">
          Page Not Found
        </h1>
        <p className="mt-3 text-(--text-secondary)">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-4 py-2 text-sm hover:bg-(--bg-muted)"
          >
            <FiArrowLeft /> Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate(homePath)}
            className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) text-white px-4 py-2 text-sm hover:opacity-90"
          >
            <FiHome /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
