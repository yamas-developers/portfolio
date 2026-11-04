"use client";

import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FeedbackReview, feedbackReviews } from "./feedbackReviews";
import { PHONE_WIDTH, distribute } from "./feedbackText";
import ReviewCard from "./ReviewCard";
import { captureEvent } from "../analytics/posthog";

type Filter = "all" | FeedbackReview["platform"];

type ExploreModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenReview: (review: FeedbackReview, trigger: HTMLElement, currentList: FeedbackReview[]) => void;
};

type ExploreColumn = {
  el: HTMLElement;
  track: HTMLElement;
  length: number;
  direction: 1 | -1;
  start: number;
  drift: number;
  speed: number;
  hover: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const wrap = (value: number, length: number) =>
  ((value % length) + length) % length;

const filterOptions: { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "All", count: feedbackReviews.length },
  ...Array.from(new Set(feedbackReviews.map((r) => r.platform))).map((platform) => ({
    value: platform,
    label: platform,
    count: feedbackReviews.filter((r) => r.platform === platform).length,
  })),
];

function exploreColsCount(itemCount: number, width: number) {
  if (itemCount <= 1 || width <= PHONE_WIDTH) return 1;
  if (width <= 850) return 2;
  if (width <= 1350) return 3;
  if (width <= 1750) return 4;
  return 5;
}

export default function ExploreModal({
  open,
  onClose,
  onOpenReview,
}: ExploreModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const wallRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const columnsRef = useRef<ExploreColumn[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const justDraggedRef = useRef<boolean>(false);
  const isDraggingCardRef = useRef<boolean>(false);

  // Resize listener
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Filtered reviews
  const currentReviews =
    filter === "all"
      ? feedbackReviews
      : feedbackReviews.filter((r) => r.platform === filter);

  const cols = exploreColsCount(currentReviews.length, windowWidth);
  const groups = distribute(currentReviews, cols);

  // Dialog open/close sync
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
        dialog.scrollTop = 0;
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Motion engine & clones for seamless infinite loop
  useEffect(() => {
    if (!open) return;
    const wall = wallRef.current;
    if (!wall) return;

    // When few reviews exist (e.g. Upwork with 2 reviews): no clone sets, each card appears once
    if (currentReviews.length <= 4) {
      columnsRef.current = [];
      wall.classList.remove("is-moving");
      wall.querySelectorAll<HTMLElement>(".explore-track").forEach((tr) => {
        tr.style.transform = "";
      });
      wall.querySelectorAll(".is-copy").forEach((cp) => cp.remove());
      return;
    }

    wall.classList.toggle("is-moving", autoScroll);

    if (!autoScroll) {
      columnsRef.current = [];
      wall.querySelectorAll<HTMLElement>(".explore-track").forEach((tr) => {
        tr.style.transform = "";
      });
      wall.querySelectorAll(".is-copy").forEach((cp) => cp.remove());
      return;
    }

    // Clean previous clone copies
    wall.querySelectorAll(".is-copy").forEach((cp) => cp.remove());

    const sets = Array.from(wall.querySelectorAll<HTMLElement>(".explore-set"));
    if (!sets.length) {
      columnsRef.current = [];
      return;
    }

    const lengths = sets.map((s) => s.offsetHeight);
    const STARTS = [0, 0.42, 0.2, 0.62];

    columnsRef.current = sets.map((set, i) => {
      const track = set.parentElement as HTMLElement;
      const colEl = track.parentElement as HTMLElement;

      const copyTop = set.cloneNode(true) as HTMLElement;
      copyTop.classList.add("is-copy");
      copyTop.setAttribute("aria-hidden", "true");
      copyTop.querySelectorAll(".review-card").forEach((c) => {
        (c as HTMLElement).tabIndex = -1;
      });

      const copyBottom = set.cloneNode(true) as HTMLElement;
      copyBottom.classList.add("is-copy");
      copyBottom.setAttribute("aria-hidden", "true");
      copyBottom.querySelectorAll(".review-card").forEach((c) => {
        (c as HTMLElement).tabIndex = -1;
      });

      track.prepend(copyTop);
      track.append(copyBottom);

      const length = lengths[i] || 600;
      const colObj: ExploreColumn = {
        el: colEl,
        track,
        length,
        direction: i % 2 ? -1 : 1, // alternating direction
        start: length * STARTS[i % STARTS.length],
        drift: 0,
        speed: 0,
        hover: false,
      };

      const initialY = colObj.length + wrap(colObj.start, colObj.length);
      track.style.transform = `translate3d(0, ${(-initialY).toFixed(2)}px, 0)`;

      return colObj;
    });

    // Delegated column hover pause isolation
    const onPointerOver = (e: PointerEvent) => {
      if (isDraggingCardRef.current || e.pointerType !== "mouse") return;
      const target = e.target as HTMLElement | null;
      const colEl = target?.closest(".explore-col");
      if (!colEl) return;
      const col = columnsRef.current.find((c) => c.el === colEl);
      if (col) col.hover = true;
    };

    const onPointerOut = (e: PointerEvent) => {
      if (isDraggingCardRef.current || e.pointerType !== "mouse") return;
      const target = e.target as HTMLElement | null;
      const colEl = target?.closest(".explore-col") as HTMLElement | null;
      if (!colEl) return;
      if (e.relatedTarget && colEl.contains(e.relatedTarget as Node)) return;
      const col = columnsRef.current.find((c) => c.el === colEl);
      if (col) col.hover = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!autoScroll || !columnsRef.current.length) return;
      const target = e.target as HTMLElement | null;
      const colEl = target?.closest(".explore-col");
      if (!colEl) return;
      const col = columnsRef.current.find((c) => c.el === colEl);
      if (!col) return;
      col.drift += e.deltaY * 0.7;
      const y = col.length + wrap(col.start + col.drift, col.length);
      col.track.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`;
    };

    wall.addEventListener("pointerover", onPointerOver);
    wall.addEventListener("pointerout", onPointerOut);
    wall.addEventListener("wheel", onWheel, { passive: true });

    // RAF Loop
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (autoScroll && columnsRef.current.length && !isDraggingCardRef.current) {
        const baseSpeed = window.innerWidth <= PHONE_WIDTH ? 30 : 22; // px/s
        columnsRef.current.forEach((column) => {
          const target = column.hover ? 0 : baseSpeed;
          column.speed += (target - column.speed) * (1 - Math.exp(-dt * 5));
          if (target === 0 && column.speed < 0.05) column.speed = 0;
          if (column.speed === 0) return;
          column.drift += column.direction * column.speed * dt;
          const y =
            column.length + wrap(column.start + column.drift, column.length);
          column.track.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      wall.removeEventListener("pointerover", onPointerOver);
      wall.removeEventListener("pointerout", onPointerOut);
      wall.removeEventListener("wheel", onWheel);
    };
  }, [open, autoScroll, currentReviews.length, filter, windowWidth]);

  // Free 2D drag and drop with inertia momentum on desktop/tablets (> 600px)
  useEffect(() => {
    if (!open) return;
    const wall = wallRef.current;
    if (!wall) return;

    let activeDrag: {
      card: HTMLElement;
      col: HTMLElement | null;
      pointerId: number;
      startX: number;
      startY: number;
      origX: number;
      origY: number;
      lastX: number;
      lastY: number;
      currentX: number;
      currentY: number;
      currentTilt: number;
      samples: { x: number; y: number; time: number }[];
      isDragging: boolean;
    } | null = null;

    let highestZ = 50;

    const onPointerDown = (e: PointerEvent) => {
      if (window.innerWidth <= PHONE_WIDTH) return; // Desktop and tablets only
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".explore-wall .review-card");
      if (!card) return;
      if (target?.closest("button") && target.closest("button") !== card) return;

      const anyCard = card as any;
      if (anyCard._coastRaf) {
        cancelAnimationFrame(anyCard._coastRaf);
        anyCard._coastRaf = null;
      }

      const currentX = parseFloat(card.dataset.freeX || "0");
      const currentY = parseFloat(card.dataset.freeY || "0");

      activeDrag = {
        card,
        col: card.closest<HTMLElement>(".explore-col"),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: currentX,
        origY: currentY,
        lastX: e.clientX,
        lastY: e.clientY,
        currentX,
        currentY,
        currentTilt: 0,
        samples: [{ x: e.clientX, y: e.clientY, time: performance.now() }],
        isDragging: false,
      };

      try {
        card.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!activeDrag || activeDrag.pointerId !== e.pointerId) return;

      const dx = e.clientX - activeDrag.startX;
      const dy = e.clientY - activeDrag.startY;

      if (!activeDrag.isDragging) {
        if (Math.hypot(dx, dy) > 4) {
          activeDrag.isDragging = true;
          isDraggingCardRef.current = true;
          highestZ += 2;
          activeDrag.card.style.zIndex = String(highestZ);
          if (activeDrag.col) activeDrag.col.style.zIndex = String(highestZ);
          activeDrag.card.classList.add("is-free-dragging");
        }
      }

      if (activeDrag.isDragging) {
        const newX = activeDrag.origX + dx;
        const newY = activeDrag.origY + dy;

        const now = performance.now();
        activeDrag.samples.push({ x: e.clientX, y: e.clientY, time: now });
        if (activeDrag.samples.length > 8) activeDrag.samples.shift();

        const vx = e.clientX - activeDrag.lastX;
        const tilt = clamp(vx * 0.7, -12, 12);
        activeDrag.currentTilt = tilt;

        activeDrag.card.style.translate = `${newX}px ${newY}px`;
        activeDrag.card.style.rotate = `${tilt}deg`;

        activeDrag.lastX = e.clientX;
        activeDrag.lastY = e.clientY;
        activeDrag.currentX = newX;
        activeDrag.currentY = newY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!activeDrag || activeDrag.pointerId !== e.pointerId) return;
      const { card, col, isDragging } = activeDrag;

      if (isDragging) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 250);

        const now = performance.now();
        const recent = activeDrag.samples.filter((s) => now - s.time < 120);
        let vx = 0;
        let vy = 0;
        if (recent.length >= 2) {
          const first = recent[0];
          const last = recent[recent.length - 1];
          const dt = last.time - first.time || 16;
          vx = ((last.x - first.x) / dt) * 16;
          vy = ((last.y - first.y) / dt) * 16;
        }

        vx = clamp(vx, -24, 24);
        vy = clamp(vy, -24, 24);

        let curX = activeDrag.currentX;
        let curY = activeDrag.currentY;
        let curTilt = activeDrag.currentTilt || 0;

        if (Math.hypot(vx, vy) > 0.4) {
          const coast = () => {
            vx *= 0.92;
            vy *= 0.92;
            curTilt *= 0.88;

            curX += vx;
            curY += vy;

            card.style.translate = `${curX.toFixed(1)}px ${curY.toFixed(1)}px`;
            card.style.rotate = `${curTilt.toFixed(2)}deg`;

            if (Math.hypot(vx, vy) > 0.08 || Math.abs(curTilt) > 0.1) {
              (card as any)._coastRaf = requestAnimationFrame(coast);
            } else {
              card.style.rotate = "0deg";
              card.dataset.freeX = curX.toFixed(1);
              card.dataset.freeY = curY.toFixed(1);
              card.classList.remove("is-free-dragging");
              if (col) col.style.zIndex = "";
              (card as any)._coastRaf = null;
            }
          };
          (card as any)._coastRaf = requestAnimationFrame(coast);
        } else {
          card.style.rotate = "0deg";
          card.dataset.freeX = curX.toFixed(1);
          card.dataset.freeY = curY.toFixed(1);
          card.classList.remove("is-free-dragging");
          if (col) col.style.zIndex = "";
        }
      }

      try {
        card.releasePointerCapture(e.pointerId);
      } catch (_) {}

      activeDrag = null;
      isDraggingCardRef.current = false;
    };

    wall.addEventListener("pointerdown", onPointerDown);
    wall.addEventListener("pointermove", onPointerMove);
    wall.addEventListener("pointerup", onPointerUp);
    wall.addEventListener("pointercancel", onPointerUp);

    return () => {
      wall.removeEventListener("pointerdown", onPointerDown);
      wall.removeEventListener("pointermove", onPointerMove);
      wall.removeEventListener("pointerup", onPointerUp);
      wall.removeEventListener("pointercancel", onPointerUp);
    };
  }, [open]);

  const handleReset = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 380);

    setFilter("all");
    setAutoScroll(true);

    const wall = wallRef.current;
    if (wall) {
      wall.querySelectorAll<HTMLElement>(".review-card").forEach((card) => {
        const anyCard = card as any;
        if (anyCard._coastRaf) {
          cancelAnimationFrame(anyCard._coastRaf);
          anyCard._coastRaf = null;
        }
        delete card.dataset.freeX;
        delete card.dataset.freeY;
        card.style.translate = "";
        card.style.rotate = "";
        card.style.zIndex = "";
        card.classList.remove("is-free-dragging");
      });
    }

    captureEvent("feedback_explore_reset");
  };

  const handleCardClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (justDraggedRef.current) return;
    const target = (e.target as HTMLElement).closest<HTMLElement>(".review-card");
    if (!target) return;
    const id = target.dataset.review;
    if (!id) return;
    const found = currentReviews.find((r) => r.id === Number(id));
    if (found) {
      onOpenReview(found, target, currentReviews);
    }
  };

  const showingText =
    filter === "all"
      ? `Showing all ${currentReviews.length} reviews`
      : `Showing ${currentReviews.length} ${filter} review${
          currentReviews.length === 1 ? "" : "s"
        }`;

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="explore"
      aria-labelledby="explore-title"
      onClose={onClose}
    >
      <div className="explore-top">
        <div className="explore-brand">
          <h2 id="explore-title">All client feedback</h2>
          <p id="explore-count">{showingText}</p>
        </div>

        <div
          className="filters explore-filters"
          role="group"
          aria-label="Filter explore reviews by platform"
        >
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="filter"
              aria-pressed={filter === opt.value}
              onClick={() => {
                setFilter(opt.value);
                captureEvent("feedback_explore_filter", { filter: opt.value });
              }}
            >
              {opt.label} <span className="count">{opt.count}</span>
            </button>
          ))}
        </div>

        <div className="explore-actions">
          <button
            type="button"
            className="board-button explore-action-btn"
            id="explore-autoscroll"
            aria-pressed={autoScroll}
            aria-label={autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"}
            title={autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"}
            onClick={() => setAutoScroll((prev) => !prev)}
          >
            <span className="explore-btn-icon" aria-hidden="true">
              {autoScroll ? "⏸" : "▶"}
            </span>
            <span>{autoScroll ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            className={`board-button explore-action-btn explore-reset-btn${
              isSpinning ? " is-spinning" : ""
            }`}
            id="explore-reset"
            aria-label="Reset board to default state"
            title="Reset board to default state"
            onClick={handleReset}
          >
            <span className="explore-btn-icon" aria-hidden="true">
              ↻
            </span>
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="board-button explore-action-btn explore-close-btn"
            id="explore-close"
            aria-label="Close explore view"
            onClick={onClose}
          >
            <span>Close</span>
            <span className="explore-btn-icon" aria-hidden="true">
              ✕
            </span>
          </button>
        </div>
      </div>

      <div
        ref={wallRef}
        className="explore-wall"
        style={{ "--cols": cols } as CSSProperties}
        onClick={handleCardClick}
      >
        {groups.map((group, i) => (
          <div key={i} className="explore-col" style={{ "--i": i } as CSSProperties}>
            <div className="explore-track">
              <div className="explore-set">
                {group.map((review) => (
                  <ReviewCard key={review.id} review={review} isExplore />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </dialog>
  );
}
