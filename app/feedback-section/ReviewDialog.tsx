"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { FeedbackReview } from "./feedbackReviews";
import { highlightQuote, stars } from "./feedbackText";
import { captureEvent } from "../analytics/posthog";

export type SlideDirection = "next" | "prev" | "down" | "up" | "none";

export type ActiveReview = {
  index: number;
  direction: SlideDirection;
};

type ReviewDialogProps = {
  reviews: FeedbackReview[];
  active: ActiveReview | null;
  setActive: Dispatch<SetStateAction<ActiveReview | null>>;
  onClosed: () => void;
};

function ReviewBody({
  review,
  titleId,
}: {
  review: FeedbackReview;
  titleId?: string;
}) {
  return (
    <>
      <div className="full-meta">
        <span>{review.platform} review</span>
        <span>
          {stars(review.rating)} · {review.rating} / 5
        </span>
      </div>
      <blockquote>“{highlightQuote(review.quote, review.highlight)}”</blockquote>
      <div className="full-author-row">
        <span className="avatar" aria-hidden="true">
          {review.author[0].toUpperCase()}
        </span>
        <div>
          <h2 id={titleId}>{review.author}</h2>
          <p className="full-subtitle">{review.subtitle}</p>
        </div>
      </div>
      {review.tags.length > 0 && (
        <div className="endorsements">
          {review.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </>
  );
}

function Neighbor({
  review,
  direction,
  onClick,
}: {
  review: FeedbackReview;
  direction: -1 | 1;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`carousel-neighbor ${direction < 0 ? "is-prev" : "is-next"}`}
      onClick={onClick}
      aria-label={`${direction < 0 ? "Previous" : "Next"} review: ${
        review.author
      } (${review.platform})`}
    >
      <span className="neighbor-direction">
        {direction < 0 ? "← Previous" : "Next →"}
      </span>
      <span className="neighbor-rating">
        <span className="card-stars" aria-hidden="true">
          {stars(review.rating)}
        </span>
        <span>{review.platform}</span>
      </span>
      <span className="neighbor-quote">
        “{highlightQuote(review.quote, review.highlight)}”
      </span>
      <span className="neighbor-author">
        <span className="avatar" aria-hidden="true">
          {review.author[0].toUpperCase()}
        </span>
        <span>
          {review.author}
          <small>{review.subtitle}</small>
        </span>
      </span>
    </button>
  );
}

export default function ReviewDialog({
  reviews,
  active,
  setActive,
  onClosed,
}: ReviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const wheelRef = useRef({ total: 0, cooling: false });
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const total = reviews.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    } else if (!active && dialog.open) {
      dialog.close();
    }
  }, [active]);

  // Centre the chosen name pill without scrolling the dialog itself.
  useEffect(() => {
    const dots = dotsRef.current;
    if (!active || !dots) return;
    const dot = dots.children[active.index] as HTMLElement | undefined;
    if (!dot) return;
    dots.scrollTo({
      left: dot.offsetLeft - (dots.clientWidth - dot.offsetWidth) / 2,
      behavior: active.direction === "none" ? "auto" : "smooth",
    });
  }, [active]);

  const step = (
    delta: -1 | 1,
    orientation: "horizontal" | "vertical" = "horizontal"
  ) => {
    if (total < 2) return;
    const direction: SlideDirection =
      orientation === "vertical"
        ? delta > 0
          ? "down"
          : "up"
        : delta > 0
        ? "next"
        : "prev";
    setActive((current) =>
      current
        ? { index: (current.index + delta + total) % total, direction }
        : current
    );
    captureEvent("feedback_carousel_step", {
      direction: delta > 0 ? "next" : "prev",
      orientation,
    });
  };

  const select = (index: number) => {
    if (!active || index === active.index) return;
    setActive({ index, direction: index > active.index ? "next" : "prev" });
    captureEvent("feedback_carousel_select_pill", { target_index: index });
  };

  // On short screens the middle of the popup scrolls; let it reach the end
  // of the card before vertical input steps to another review.
  const stageCanScroll = (delta: number) => {
    const stage = dialogRef.current?.querySelector<HTMLElement>(
      ".review-carousel-stage"
    );
    if (!stage || stage.scrollHeight <= stage.clientHeight + 1) return false;
    return delta > 0
      ? stage.scrollTop + stage.clientHeight < stage.scrollHeight - 1
      : stage.scrollTop > 0;
  };

  const onWheel = (e: React.WheelEvent<HTMLDialogElement>) => {
    if ((e.target as HTMLElement).closest(".carousel-dots")) return;
    const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    const delta = vertical ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 6) return;
    if (vertical && stageCanScroll(delta)) return;
    const wheel = wheelRef.current;
    wheel.total += delta;
    if (Math.abs(wheel.total) < 30 || wheel.cooling) return;
    step(wheel.total > 0 ? 1 : -1, vertical ? "vertical" : "horizontal");
    wheel.total = 0;
    wheel.cooling = true;
    setTimeout(() => {
      wheel.cooling = false;
    }, 260);
  };

  const current = active ? reviews[active.index] : null;
  const previous = active ? reviews[(active.index - 1 + total) % total] : null;
  const next = active ? reviews[(active.index + 1) % total] : null;

  return (
    <dialog
      ref={dialogRef}
      className="review-dialog"
      aria-labelledby="review-title"
      onClose={() => {
        setActive(null);
        onClosed();
      }}
      onWheel={onWheel}
      onKeyDown={(e) => {
        const keys: Record<string, [-1 | 1, "horizontal" | "vertical"]> = {
          ArrowLeft: [-1, "horizontal"],
          ArrowRight: [1, "horizontal"],
          ArrowUp: [-1, "vertical"],
          ArrowDown: [1, "vertical"],
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        step(...keys[e.key]);
      }}
      onTouchStart={(e) => {
        touchRef.current = {
          x: e.touches[0]?.clientX ?? 0,
          y: e.touches[0]?.clientY ?? 0,
        };
      }}
      onTouchEnd={(e) => {
        const start = touchRef.current;
        touchRef.current = null;
        const end = e.changedTouches[0];
        if (!start || !end) return;
        const dx = start.x - end.clientX;
        const dy = start.y - end.clientY;
        const stage = dialogRef.current?.querySelector<HTMLElement>(
          ".review-carousel-stage"
        );
        const scrollable = Boolean(
          stage && stage.scrollHeight > stage.clientHeight + 1
        );
        if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > 36) step(dx > 0 ? 1 : -1, "horizontal");
        } else if (Math.abs(dy) > 36 && !scrollable) {
          // A scrolling middle takes vertical swipes as normal scrolling.
          step(dy > 0 ? 1 : -1, "vertical");
        }
      }}
      onClick={(e) => {
        const dialog = dialogRef.current;
        if (!dialog || e.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (
          e.clientX < box.left ||
          e.clientX > box.right ||
          e.clientY < box.top ||
          e.clientY > box.bottom
        ) {
          dialog.close();
        }
      }}
    >
      {active && current && previous && next && (
        <>
          <div className="dialog-header">
            <p>
              CLIENT FEEDBACK · {active.index + 1} OF {total}
            </p>
            <button
              type="button"
              aria-label="Close full review"
              onClick={() => dialogRef.current?.close()}
            >
              Close ×
            </button>
          </div>

          <div
            className={`review-carousel-stage${total < 2 ? " is-single" : ""}`}
            role="region"
            aria-label="Client review carousel"
          >
            <Neighbor review={previous} direction={-1} onClick={() => step(-1)} />

            {/* Every review sits in the same cell, hidden but for the active
                one, so the cell is as tall as the longest review. The card
                fits its own text, the popup keeps one size, and Prev / Next
                stay where they are. */}
            <div className="carousel-slot">
              {reviews.map((review, index) =>
                index === active.index ? (
                  <article
                    key={review.id}
                    className={`carousel-active-card slide-${active.direction}`}
                    aria-live="polite"
                  >
                    <ReviewBody review={review} titleId="review-title" />
                  </article>
                ) : (
                  <article
                    key={review.id}
                    className="carousel-active-card is-spacer"
                    aria-hidden="true"
                  >
                    <ReviewBody review={review} />
                  </article>
                )
              )}
            </div>

            <Neighbor review={next} direction={1} onClick={() => step(1)} />
          </div>

          {total > 1 && (
            <div className="carousel-controls">
              <button
                type="button"
                className="carousel-step-btn"
                onClick={() => step(-1)}
                aria-label={`View previous review (${previous.author})`}
              >
                ← Prev
              </button>
              <div
                ref={dotsRef}
                className="carousel-dots"
                role="tablist"
                aria-label="Choose a review"
              >
                {reviews.map((review, index) => (
                  <button
                    key={review.id}
                    type="button"
                    role="tab"
                    aria-selected={index === active.index}
                    aria-label={`Review ${index + 1}: ${review.author}`}
                    className={`carousel-dot${
                      index === active.index ? " is-active" : ""
                    }`}
                    onClick={() => select(index)}
                  >
                    <span>{review.author}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="carousel-step-btn"
                onClick={() => step(1)}
                aria-label={`View next review (${next.author})`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
