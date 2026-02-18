import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    // TITLE
    if (title) {
      document.title = title;
    }

    // DESCRIPTION
    if (description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // KEYWORDS (optional)
    if (keywords) {
      let meta = document.querySelector("meta[name='keywords']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "keywords";
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }

    // CANONICAL
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    link.href =
      canonical ||
      `https://shreebaglamukhi.com${location.pathname}`;

    // ROBOTS
    let robots = document.querySelector("meta[name='robots']");
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    robots.content = noIndex ? "noindex,nofollow" : "index,follow";
  }, [title, description, keywords, canonical, noIndex, location.pathname]);

  return null;
};

export default SEO;