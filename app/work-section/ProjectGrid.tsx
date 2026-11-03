"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import {
  getProjectLinks,
  orderedProjects,
  ProjectProps,
} from "./projectDetails";
import ProjectVisual, { visuals } from "./ProjectVisual";
import { captureEvent } from "../analytics/posthog";

type FilterType = "all" | "mobile" | "web";

const INITIAL_VISIBLE_COUNT = 7;

function hasWebExperience(project: ProjectProps) {
  const format = visuals[project.id]?.format;
  return (
    format === "websiteApps" ||
    format === "website" ||
    [0, 1, 2].includes(project.id)
  );
}

export default function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectProps | null>(
    null
  );
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const filteredProjects = orderedProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "mobile") return project.id !== 12;
    return hasWebExperience(project);
  });

  const visibleProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(
    0,
    filteredProjects.length - INITIAL_VISIBLE_COUNT
  );

  const handleFilterChange = (nextFilter: FilterType) => {
    setActiveFilter(nextFilter);
    setShowAll(false);
    captureEvent("work_filter_change", { filter: nextFilter });
    const nextList = orderedProjects.filter((project) => {
      if (nextFilter === "all") return true;
      if (nextFilter === "mobile") return project.id !== 12;
      return hasWebExperience(project);
    });
    const shown = Math.min(INITIAL_VISIBLE_COUNT, nextList.length);
    setStatusAnnouncement(`${shown} of ${nextList.length} projects shown.`);
  };

  const handleToggleShowAll = () => {
    const nextShowAll = !showAll;
    setShowAll(nextShowAll);
    captureEvent("work_toggle_projects", {
      show_all: nextShowAll,
      filter: activeFilter,
      total_shown: nextShowAll ? filteredProjects.length : Math.min(INITIAL_VISIBLE_COUNT, filteredProjects.length),
    });
    setStatusAnnouncement(
      `${
        nextShowAll
          ? filteredProjects.length
          : Math.min(INITIAL_VISIBLE_COUNT, filteredProjects.length)
      } of ${filteredProjects.length} projects shown.`
    );

    if (nextShowAll && filteredProjects[INITIAL_VISIBLE_COUNT]) {
      const targetId = filteredProjects[INITIAL_VISIBLE_COUNT].id;
      requestAnimationFrame(() => {
        const extraButton = document.querySelector<HTMLElement>(
          `#project-${targetId} .project-title-button`
        );
        extraButton?.focus();
      });
    }
  };

  const handleOpenOverview = (project: ProjectProps, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setSelectedProject(project);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedProject) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
      dialog.scrollTop = 0;
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  const handleDialogClose = () => {
    document.body.style.overflow = "";
    setSelectedProject(null);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.focus();
      });
    }
  };

  const selectedLinks = selectedProject ? getProjectLinks(selectedProject) : [];
  const selectedCategory = selectedProject
    ? selectedProject.category ??
      (selectedProject.id === 0
        ? "Marketplace"
        : selectedProject.id === 1
        ? "On-demand services"
        : selectedProject.id === 2
        ? "Community & social"
        : selectedProject.id === 3
        ? "Everyday services"
        : "Mobile & web")
    : "";

  return (
    <>
      <div className="work-heading">
        <h2 id="work-title">
          Selected work
          <span className="project-count" id="project-count">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </h2>
        <div className="filters" role="group" aria-label="Filter projects">
          <button
            type="button"
            aria-pressed={activeFilter === "all"}
            onClick={() => handleFilterChange("all")}
          >
            All work
          </button>
          <button
            type="button"
            aria-pressed={activeFilter === "mobile"}
            onClick={() => handleFilterChange("mobile")}
          >
            Mobile apps
          </button>
          <button
            type="button"
            aria-pressed={activeFilter === "web"}
            onClick={() => handleFilterChange("web")}
          >
            Web
          </button>
        </div>
      </div>

      <p className="sr-only" id="filter-status" role="status">
        {statusAnnouncement}
      </p>

      <div className="project-grid" id="project-grid">
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            {...project}
            featured={index === 0}
            priority={index < 2}
            onOpenOverview={handleOpenOverview}
          />
        ))}
      </div>

      {filteredProjects.length > INITIAL_VISIBLE_COUNT && (
        <div className="more-work">
          <button
            type="button"
            className="button secondary"
            id="more-work"
            aria-expanded={showAll}
            onClick={handleToggleShowAll}
          >
            {showAll ? (
              <>
                Show top {INITIAL_VISIBLE_COUNT} projects{" "}
                <span aria-hidden="true">↑</span>
              </>
            ) : (
              <>
                View all {filteredProjects.length} projects ({remainingCount}{" "}
                more) <span aria-hidden="true">↓</span>
              </>
            )}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        id="project-dialog"
        className="project-dialog"
        aria-labelledby="dialog-title"
        onClose={handleDialogClose}
        onClick={(e) => {
          const dialog = dialogRef.current;
          if (!dialog || e.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            dialog.close();
          }
        }}
      >
        {selectedProject && (
          <>
            <div className="dialog-nav">
              <span>Project overview</span>
              <button
                className="close-dialog"
                type="button"
                aria-label="Close project overview"
                onClick={() => dialogRef.current?.close()}
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div id="dialog-content">
              <div className="dialog-media">
                <ProjectVisual
                  id={selectedProject.id}
                  inDialog
                  priority
                  showCaption
                />
              </div>
              <div className="dialog-copy">
                <p className="project-category">{selectedCategory}</p>
                <h2 id="dialog-title">{selectedProject.name}</h2>
                <p>{selectedProject.description}</p>
                <dl className="dialog-facts">
                  <div>
                    <dt>My role</dt>
                    <dd>{selectedProject.role ?? "Full stack developer"}</dd>
                  </div>
                  {selectedProject.technologies.length > 0 && (
                    <div>
                      <dt>Technology</dt>
                      <dd>{selectedProject.technologies.join(" / ")}</dd>
                    </div>
                  )}
                </dl>
                {selectedLinks.length > 0 && (
                  <div className="dialog-links">
                    {selectedLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          captureEvent("project_dialog_link_click", {
                            project_id: selectedProject.id,
                            project_name: selectedProject.name,
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
          </>
        )}
      </dialog>
    </>
  );
}
