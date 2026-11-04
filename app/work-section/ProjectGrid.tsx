"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import {
  getProjectLinks,
  orderedProjects,
  ProjectProps,
} from "./projectDetails";
import ProjectVisual, { visuals } from "./ProjectVisual";
import { captureEvent } from "../analytics/posthog";

type FilterType = "all" | "mobile" | "web";

const DESKTOP_INITIAL_COUNT = 7;
const MOBILE_INITIAL_COUNT = 4;

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
  const [isFiltering, setIsFiltering] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectProps | null>(
    null
  );
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, []);

  const initialCount = isMobile ? MOBILE_INITIAL_COUNT : DESKTOP_INITIAL_COUNT;

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return orderedProjects;
    if (activeFilter === "mobile") {
      // Lead with She & HER for Mobile apps filter so top featured project visibly changes
      const mobiles = orderedProjects.filter((p) => p.id !== 12);
      const lead = mobiles.find((p) => p.id === 13);
      if (lead) {
        return [lead, ...mobiles.filter((p) => p.id !== 13)];
      }
      return mobiles;
    }
    // Web: lead with World on Plate so top featured project visibly changes
    const webs = orderedProjects.filter((p) => hasWebExperience(p));
    const lead = webs.find((p) => p.id === 12);
    if (lead) {
      return [lead, ...webs.filter((p) => p.id !== 12)];
    }
    return webs;
  }, [activeFilter]);

  const visibleProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, initialCount);
  const remainingCount = Math.max(
    0,
    filteredProjects.length - initialCount
  );

  const handleFilterChange = (nextFilter: FilterType) => {
    if (nextFilter === activeFilter) return;
    setIsFiltering(true);
    setActiveFilter(nextFilter);
    setShowAll(false);
    captureEvent("work_filter_change", { filter: nextFilter });

    setTimeout(() => {
      setIsFiltering(false);
    }, 220);

    const shown = Math.min(initialCount, filteredProjects.length);
    setStatusAnnouncement(`${shown} of ${filteredProjects.length} projects shown.`);
  };

  const handleToggleShowAll = () => {
    const nextShowAll = !showAll;
    setShowAll(nextShowAll);
    captureEvent("work_toggle_projects", {
      show_all: nextShowAll,
      filter: activeFilter,
      total_shown: nextShowAll
        ? filteredProjects.length
        : Math.min(initialCount, filteredProjects.length),
    });
    setStatusAnnouncement(
      `${
        nextShowAll
          ? filteredProjects.length
          : Math.min(initialCount, filteredProjects.length)
      } of ${filteredProjects.length} projects shown.`
    );

    if (nextShowAll && filteredProjects[initialCount]) {
      const targetId = filteredProjects[initialCount].id;
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
        <h2 id="work-title">Selected work</h2>
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

      <div
        className={`project-grid${showAll ? " is-expanded" : ""}${
          isFiltering ? " is-filtering" : ""
        }`}
        id="project-grid"
      >
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

      {filteredProjects.length > initialCount && (
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
                Show top {initialCount} projects{" "}
                <span aria-hidden="true">↑</span>
              </>
            ) : (
              <>
                View all 15+ projects <span aria-hidden="true">↓</span>
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
