import { useEffect, useState } from "react";
import api from "../../config/api";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/jobs/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      <h1 className="text-3xl font-semibold mb-10">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-(--text-secondary)">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-2">
                {app.title}
              </h3>

              <p className="text-(--text-secondary) text-sm mb-2">
                {app.company} • {app.location}
              </p>

              <p className="text-sm mb-2">
                Type: {app.type}
              </p>

              <p className="text-sm mb-2">
                Applied On:{" "}
                {new Date(app.appliedAt).toLocaleDateString()}
              </p>

              <p
                className={`font-medium mb-4 ${
                  app.status === "Pending"
                    ? "text-yellow-500"
                    : app.status === "Shortlisted"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {app.status}
              </p>

              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) underline text-sm"
              >
                View Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;