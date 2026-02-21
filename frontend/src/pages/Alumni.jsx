import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import api from "../config/api";

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniRes, statsRes] = await Promise.all([
          api.get("/public/alumni"),
          api.get("/public/alumni/stats"),
        ]);

        setAlumni(alumniRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.log("Error fetching alumni:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading alumni...</div>;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      <h1 className="text-3xl font-semibold mb-12">Alumni Network</h1>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-14">
          <StatCard title="Total Alumni" value={stats.totalAlumni} />
          <StatCard title="Placed Students" value={stats.placedStudents} />
          <StatCard title="Top Companies" value={stats.topCompanies} />
          <StatCard title="Avg Package" value={stats.avgPackage} />
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {alumni.map((alum) => (
          <div
            key={alum._id}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src={alum.image?.url}
              alt={alum.name}
              className="w-20 h-20 rounded-full mb-4 object-cover"
            />

            <h3 className="text-lg font-semibold">{alum.name}</h3>

            <p className="text-(--text-secondary) text-sm mb-2">
              {alum.role} @ {alum.company}
            </p>

            <p className="text-xs text-(--text-muted) mb-4">
              Batch of {alum.batchYear}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {alum.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {alum.linkedin && (
              <a
                href={alum.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-(--color-primary) hover:underline text-sm"
              >
                Connect <FiExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center shadow-sm">
    <h3 className="text-2xl font-bold text-(--color-primary)">{value}</h3>
    <p className="text-(--text-secondary) text-sm mt-2">{title}</p>
  </div>
);

export default Alumni;
