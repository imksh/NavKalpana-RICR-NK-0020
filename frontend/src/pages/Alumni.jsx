import { FiExternalLink } from "react-icons/fi";

const alumniData = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Frontend Developer",
    company: "Infosys",
    year: "2024",
    skills: ["React", "Node.js", "MongoDB"],
    image: "https://i.pravatar.cc/150?img=11",
    linkedin: "#"
  },
  {
    id: 2,
    name: "Anjali Verma",
    role: "Data Analyst",
    company: "TCS",
    year: "2023",
    skills: ["Python", "SQL", "Power BI"],
    image: "https://i.pravatar.cc/150?img=5",
    linkedin: "#"
  },
  {
    id: 3,
    name: "Karan Patel",
    role: "Backend Engineer",
    company: "Accenture",
    year: "2022",
    skills: ["Node.js", "Express", "AWS"],
    image: "https://i.pravatar.cc/150?img=8",
    linkedin: "#"
  }
];

const Alumni = () => {
  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold mb-12">
        Alumni Network
      </h1>

      {/* STATS SECTION */}
      <div className="grid md:grid-cols-4 gap-6 mb-14">
        <StatCard title="Total Alumni" value="1,200+" />
        <StatCard title="Placed Students" value="950+" />
        <StatCard title="Top Companies" value="120+" />
        <StatCard title="Avg Package" value="₹6.5 LPA" />
      </div>

      {/* ALUMNI GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {alumniData.map((alum) => (
          <div
            key={alum.id}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src={alum.image}
              alt={alum.name}
              className="w-20 h-20 rounded-full mb-4"
            />

            <h3 className="text-lg font-semibold">
              {alum.name}
            </h3>

            <p className="text-(--text-secondary) text-sm mb-2">
              {alum.role} @ {alum.company}
            </p>

            <p className="text-xs text-(--text-muted) mb-4">
              Batch of {alum.year}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {alum.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <a
              href={alum.linkedin}
              target="_blank"
              className="inline-flex items-center gap-2 text-(--color-primary) hover:underline text-sm"
            >
              Connect <FiExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center shadow-sm">
    <h3 className="text-2xl font-bold text-(--color-primary)">
      {value}
    </h3>
    <p className="text-(--text-secondary) text-sm mt-2">
      {title}
    </p>
  </div>
);

export default Alumni;