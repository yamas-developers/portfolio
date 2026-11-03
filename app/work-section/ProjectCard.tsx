import { getProjectLinks, ProjectProps } from "./projectDetails";
import ProjectVisual from "./ProjectVisual";
import { captureEvent } from "../analytics/posthog";

type ProjectCardProps = ProjectProps & {
  featured?: boolean;
  priority?: boolean;
  onOpenOverview: (project: ProjectProps, trigger: HTMLElement) => void;
};

export default function ProjectCard(project: ProjectCardProps) {
  const {
    id,
    name,
    description,
    technologies,
    category,
    role,
    featured = false,
    priority = false,
    onOpenOverview,
  } = project;

  const links = getProjectLinks(project);
  const displayCategory =
    category ??
    (id === 0
      ? "Marketplace"
      : id === 1
      ? "On-demand services"
      : id === 2
      ? "Community & social"
      : id === 3
      ? "Everyday services"
      : "Mobile & web");

  const handleOpenOverview = (trigger: HTMLElement) => {
    captureEvent("project_view_details", {
      project_id: id,
      project_name: name,
      category: displayCategory,
    });
    onOpenOverview(project, trigger);
  };

  return (
    <article
      className={`project-card${featured ? " featured" : ""}`}
      id={`project-${id}`}
      aria-labelledby={`project-title-${id}`}
    >
      <button
        type="button"
        className="project-media"
        onClick={(e) => handleOpenOverview(e.currentTarget)}
        aria-label={`Explore ${name} overview`}
        aria-haspopup="dialog"
      >
        <ProjectVisual id={id} featured={featured} priority={priority} />
      </button>

      <div className="project-caption">
        <div className="project-main">
          <div className="project-meta">
            <span className="project-category">{displayCategory}</span>
            <span className="project-role">
              Role: {role ?? "Full stack developer"}
            </span>
          </div>

          <div className="project-title-row">
            <h3 id={`project-title-${id}`}>
              <button
                type="button"
                className="project-title-button"
                onClick={(e) => handleOpenOverview(e.currentTarget)}
                aria-haspopup="dialog"
              >
                {name}
              </button>
            </h3>
            <button
              type="button"
              className="project-arrow"
              onClick={(e) => handleOpenOverview(e.currentTarget)}
              aria-label={`Open ${name} overview`}
              aria-haspopup="dialog"
            >
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <p className="project-description">{description}</p>

          {technologies.length > 0 && (
            <p className="project-tech" aria-label={`${name} technology stack`}>
              {technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </p>
          )}

          {links.length > 0 && (
            <div className="project-links">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name}: ${link.label} (opens in a new tab)`}
                  onClick={() =>
                    captureEvent("project_external_link_click", {
                      project_id: id,
                      project_name: name,
                      link_label: link.label,
                      url: link.href,
                    })
                  }
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
