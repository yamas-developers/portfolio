"use client";

import { useEffect, useRef, useState } from "react";
import {
  FeedbackReview,
  feedbackReviews,
  feedbackRowGroups,
  orderedCarouselReviews,
} from "./feedbackReviews";

type RowRuntimeState = {
  hover: boolean;
  focus: boolean;
  manual: boolean;
  direction: 1 | -1;
  offset: number;
  lastAutoScrollLeft: number;
  sync: () => void;
};

export default function Feedback() {
  const [moving, setMoving] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number | null>(
    null
  );
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | "none">(
    "none"
  );

  const zoneRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const rowSectionRefs = useRef<(HTMLElement | null)[]>([null, null]);
  const viewportRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const prevButtonRefs = useRef<(HTMLButtonElement | null)[]>([null, null]);
  const nextButtonRefs = useRef<(HTMLButtonElement | null)[]>([null, null]);

  const movingRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const rowStatesRef = useRef<RowRuntimeState[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;
    if (mediaQuery.matches) {
      movingRef.current = false;
      setMoving(false);
    }

    const updateReveal = () => {
      const zone = zoneRef.current;
      const board = boardRef.current;
      if (!zone || !board) return;
      if (reducedMotionRef.current) {
        board.style.transform = "none";
        return;
      }
      const rect = zone.getBoundingClientRect();
      const distance = window.innerHeight * 0.5;
      const progress = Math.max(
        0,
        Math.min(1, (distance - rect.top) / Math.max(1, distance - 100))
      );
      board.style.transform = `rotateX(${(1 - progress) * 24}deg) scale(${
        0.91 + progress * 0.09
      })`;
    };

    const states: RowRuntimeState[] = [0, 1].map((rowIndex) => {
      const viewport = viewportRefs.current[rowIndex];
      const prevBtn = prevButtonRefs.current[rowIndex];
      const nextBtn = nextButtonRefs.current[rowIndex];

      const sync = () => {
        if (!viewport) return;
        const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 1;
        if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= max - 1;
      };

      if (viewport && rowIndex === 1) {
        const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        viewport.scrollLeft = max;
      }

      const initialOffset = viewport ? viewport.scrollLeft : 0;
      const state: RowRuntimeState = {
        hover: false,
        focus: false,
        manual: false,
        direction: rowIndex === 0 ? 1 : -1,
        offset: initialOffset,
        lastAutoScrollLeft: Math.round(initialOffset),
        sync,
      };
      sync();
      return state;
    });

    rowStatesRef.current = states;

    const cleanups: (() => void)[] = [];

    [0, 1].forEach((rowIndex) => {
      const rowEl = rowSectionRefs.current[rowIndex];
      const viewport = viewportRefs.current[rowIndex];
      const state = states[rowIndex];
      if (!rowEl || !viewport || !state) return;

      const onMouseEnter = () => {
        state.hover = true;
      };
      const onMouseLeave = () => {
        state.hover = false;
      };
      const onFocusIn = () => {
        state.focus = true;
      };
      const onFocusOut = (e: FocusEvent) => {
        state.focus = rowEl.contains(e.relatedTarget as Node | null);
      };
      const onWheel = (e: WheelEvent) => {
        if (e.ctrlKey) return;
        const delta =
          Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        const max = viewport.scrollWidth - viewport.clientWidth;
        const canScrollRow =
          (delta > 0 && viewport.scrollLeft < max - 1) ||
          (delta < 0 && viewport.scrollLeft > 1);
        if (!canScrollRow) return;
        e.preventDefault();
        state.manual = true;
        const unit =
          e.deltaMode === 1
            ? 18
            : e.deltaMode === 2
            ? viewport.clientWidth
            : 1;
        viewport.scrollLeft += delta * unit;
        state.offset = viewport.scrollLeft;
        state.lastAutoScrollLeft = Math.round(viewport.scrollLeft);
        state.sync();
      };
      const onPointerDown = (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest(".review-card")) {
          // Clicking a card opens the carousel dialog; do not permanently disable row auto-scroll
          return;
        }
        state.manual = true;
      };
      const onTouchMove = () => {
        state.manual = true;
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          state.manual = true;
          viewport.scrollBy({
            left: (e.key === "ArrowRight" ? 1 : -1) * 200,
            behavior: reducedMotionRef.current ? "auto" : "smooth",
          });
        }
      };
      const onScroll = () => {
        const currentScroll = Math.round(viewport.scrollLeft);
        if (Math.abs(currentScroll - state.lastAutoScrollLeft) > 2) {
          state.offset = viewport.scrollLeft;
          state.lastAutoScrollLeft = currentScroll;
        }
        state.sync();
      };

      rowEl.addEventListener("mouseenter", onMouseEnter);
      rowEl.addEventListener("mouseleave", onMouseLeave);
      rowEl.addEventListener("focusin", onFocusIn);
      rowEl.addEventListener("focusout", onFocusOut);
      viewport.addEventListener("wheel", onWheel, { passive: false });
      viewport.addEventListener("pointerdown", onPointerDown, {
        passive: true,
      });
      viewport.addEventListener("touchmove", onTouchMove, { passive: true });
      viewport.addEventListener("keydown", onKeyDown);
      viewport.addEventListener("scroll", onScroll, { passive: true });

      cleanups.push(() => {
        rowEl.removeEventListener("mouseenter", onMouseEnter);
        rowEl.removeEventListener("mouseleave", onMouseLeave);
        rowEl.removeEventListener("focusin", onFocusIn);
        rowEl.removeEventListener("focusout", onFocusOut);
        viewport.removeEventListener("wheel", onWheel);
        viewport.removeEventListener("pointerdown", onPointerDown);
        viewport.removeEventListener("touchmove", onTouchMove);
        viewport.removeEventListener("keydown", onKeyDown);
        viewport.removeEventListener("scroll", onScroll);
      });
    });

    const onResize = () => {
      updateReveal();
      rowStatesRef.current.forEach((row, index) => {
        const viewport = viewportRefs.current[index];
        if (viewport) {
          const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
          row.offset = Math.min(row.offset, max);
          row.lastAutoScrollLeft = Math.round(row.offset);
        }
        row.sync();
      });
    };

    const onReducedMotionChange = () => {
      reducedMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches) {
        movingRef.current = false;
        setMoving(false);
      }
      updateReveal();
    };

    window.addEventListener("scroll", updateReveal, { passive: true });
    window.addEventListener("resize", onResize);
    mediaQuery.addEventListener("change", onReducedMotionChange);
    updateReveal();

    let rafId = 0;
    let lastTime = performance.now();

    const frame = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.06);
      lastTime = time;
      const board = boardRef.current;
      const dialog = dialogRef.current;

      if (board) {
        const rect = board.getBoundingClientRect();
        const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;
        const isDialogOpen = Boolean(dialog?.open);

        if (
          movingRef.current &&
          !reducedMotionRef.current &&
          !document.hidden &&
          !isDialogOpen &&
          isOnScreen
        ) {
          rowStatesRef.current.forEach((row, index) => {
            if (row.hover || row.focus || row.manual) return;
            const viewport = viewportRefs.current[index];
            if (!viewport) return;
            const max = viewport.scrollWidth - viewport.clientWidth;
            if (max <= 0) return;

            row.offset += row.direction * dt * 26;
            if (row.offset >= max) {
              row.offset = max;
              row.direction = -1;
            }
            if (row.offset <= 0) {
              row.offset = 0;
              row.direction = 1;
            }
            row.lastAutoScrollLeft = Math.round(row.offset);
            viewport.scrollLeft = row.offset;
            row.sync();
          });
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("scroll", updateReveal);
      window.removeEventListener("resize", onResize);
      mediaQuery.removeEventListener("change", onReducedMotionChange);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeCarouselIndex !== null) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
      dialog.scrollTop = 0;
    } else if (dialog.open) {
      dialog.close();
    }
  }, [activeCarouselIndex]);

  const handleToggleMotion = () => {
    const next = !movingRef.current;
    movingRef.current = next;
    if (next) {
      rowStatesRef.current.forEach((row) => {
        row.manual = false;
      });
    }
    setMoving(next);
  };

  const handleRowArrowClick = (rowIndex: number, direction: -1 | 1) => {
    const viewport = viewportRefs.current[rowIndex];
    const rowEl = rowSectionRefs.current[rowIndex];
    const state = rowStatesRef.current[rowIndex];
    if (!viewport || !rowEl || !state) return;

    state.manual = true;
    const firstCard = rowEl.querySelector<HTMLElement>(".review-card");
    const step = (firstCard ? firstCard.offsetWidth : 360) + 24;
    viewport.scrollBy({
      left: direction * step,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
  };

  const handleOpenReview = (
    review: FeedbackReview,
    trigger: HTMLButtonElement
  ) => {
    lastTriggerRef.current = trigger;
    const index = orderedCarouselReviews.findIndex(
      (item) => item.id === review.id
    );
    setSlideDirection("none");
    setActiveCarouselIndex(index !== -1 ? index : 0);
  };

  const handleStepCarousel = (delta: -1 | 1) => {
    setSlideDirection(delta > 0 ? "next" : "prev");
    setActiveCarouselIndex((current) => {
      if (current === null) return 0;
      const total = orderedCarouselReviews.length;
      return (current + delta + total) % total;
    });
  };

  const handleSelectCarouselIndex = (targetIndex: number) => {
    if (activeCarouselIndex === null || targetIndex === activeCarouselIndex) {
      return;
    }
    setSlideDirection(targetIndex > activeCarouselIndex ? "next" : "prev");
    setActiveCarouselIndex(targetIndex);
  };

  const handleCloseReview = () => {
    document.body.style.overflow = "";
    setActiveCarouselIndex(null);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.focus();
      });
    }
  };

  const totalReviews = orderedCarouselReviews.length;
  const selectedReview =
    activeCarouselIndex !== null
      ? orderedCarouselReviews[activeCarouselIndex]
      : null;
  const prevReview =
    activeCarouselIndex !== null
      ? orderedCarouselReviews[
          (activeCarouselIndex - 1 + totalReviews) % totalReviews
        ]
      : null;
  const nextReview =
    activeCarouselIndex !== null
      ? orderedCarouselReviews[(activeCarouselIndex + 1) % totalReviews]
      : null;

  return (
    <section
      id="feedback"
      className="shell feedback-section"
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading">
        <div>
          <p className="eyebrow">Client feedback</p>
          <h2 id="feedback-title">
            Good work.
            <br />
            <span>In their words.</span>
          </h2>
        </div>
        <p>Feedback from clients I’ve worked with on Fiverr and Upwork.</p>
      </div>

      <div
        className="reveal-zone"
        id="reveal-zone"
        ref={zoneRef}
        aria-label="Scroll-reveal client feedback"
      >
        <div className="perspective">
          <div className="board" id="board" ref={boardRef}>
            <div className="board-header">
              <div>
                <span className="status-dot" aria-hidden="true" />
                <h3>Client feedback</h3>
                <span className="source">Fiverr &amp; Upwork</span>
              </div>
              <button
                id="motion"
                type="button"
                onClick={handleToggleMotion}
                aria-label={moving ? "Pause card motion" : "Start card motion"}
                aria-pressed={!moving}
              >
                <span aria-hidden="true">{moving ? "Ⅱ" : "▷"}</span>{" "}
                <span>{moving ? "Pause" : "Play"} motion</span>
              </button>
            </div>

            <div className="board-content">
              <div className="board-copy">
                <h3>
                  Real collaborations.
                  <br />
                  Words that stayed.
                </h3>
                <p>
                  Hover to pause. Scroll over a row to explore.
                  <br />
                  <span>Swipe on touch, or use the arrow buttons.</span>
                </p>
              </div>

              <div id="review-rows">
                {feedbackRowGroups.map((group, rowIndex) => {
                  const rowReviews = group.reviewIds
                    .map((id) =>
                      feedbackReviews.find((review) => review.id === id)
                    )
                    .filter((review): review is FeedbackReview =>
                      Boolean(review)
                    );

                  return (
                    <section
                      key={group.label}
                      ref={(el) => {
                        rowSectionRefs.current[rowIndex] = el;
                      }}
                      className="review-row"
                      aria-label={`Client review row ${rowIndex + 1}`}
                    >
                      <div className="row-toolbar">
                        <span className="row-label">{group.label}</span>
                        <div className="row-buttons">
                          <button
                            ref={(el) => {
                              prevButtonRefs.current[rowIndex] = el;
                            }}
                            type="button"
                            data-direction="-1"
                            aria-label={`Previous cards in row ${rowIndex + 1}`}
                            onClick={() => handleRowArrowClick(rowIndex, -1)}
                          >
                            ←
                          </button>
                          <button
                            ref={(el) => {
                              nextButtonRefs.current[rowIndex] = el;
                            }}
                            type="button"
                            data-direction="1"
                            aria-label={`Next cards in row ${rowIndex + 1}`}
                            onClick={() => handleRowArrowClick(rowIndex, 1)}
                          >
                            →
                          </button>
                        </div>
                      </div>

                      <div
                        ref={(el) => {
                          viewportRefs.current[rowIndex] = el;
                        }}
                        className="row-window"
                        tabIndex={0}
                        role="region"
                        aria-label={`Scrollable reviews, row ${rowIndex + 1}`}
                      >
                        <div
                          className={`row-track${
                            moving ? " is-animating" : ""
                          }`}
                        >
                          {rowReviews.map((review) => (
                            <button
                              key={review.id}
                              type="button"
                              className="review-card"
                              data-review={review.id}
                              aria-haspopup="dialog"
                              aria-label={`Read ${review.author} ${review.platform} review`}
                              onClick={(e) =>
                                handleOpenReview(review, e.currentTarget)
                              }
                            >
                              <span className="card-rating">
                                <span
                                  className="card-stars"
                                  aria-label="5 out of 5"
                                >
                                  ★★★★★
                                </span>
                                <span>{review.platform}</span>
                              </span>
                              <span
                                className={`card-quote${
                                  review.tags.length > 0
                                    ? " card-quote-tagged"
                                    : ""
                                }`}
                              >
                                “{review.quote}”
                              </span>
                              {review.tags.length > 0 && (
                                <span className="card-endorsements">
                                  {review.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                  ))}
                                </span>
                              )}
                              <span className="card-author">
                                <span className="avatar" aria-hidden="true">
                                  {review.author[0].toUpperCase()}
                                </span>
                                <span>
                                  {review.author}
                                  <small>{review.subtitle}</small>
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>

              <div className="board-note">
                <span>Six supplied reviews. Each shown once.</span>
                <span>Click any card to open the review carousel ↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="review-dialog"
        className="review-dialog"
        aria-labelledby="review-title"
        onClose={handleCloseReview}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            handleStepCarousel(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            handleStepCarousel(1);
          }
        }}
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const startX = touchStartXRef.current;
          const endX = e.changedTouches[0]?.clientX ?? null;
          touchStartXRef.current = null;
          if (startX === null || endX === null) return;
          const diff = startX - endX;
          if (Math.abs(diff) > 44) {
            handleStepCarousel(diff > 0 ? 1 : -1);
          }
        }}
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
        {selectedReview && prevReview && nextReview && (
          <>
            <div className="dialog-header">
              <p>
                CLIENT FEEDBACK · {(activeCarouselIndex ?? 0) + 1} OF{" "}
                {totalReviews}
              </p>
              <button
                type="button"
                id="close-review"
                aria-label="Close full review"
                onClick={() => dialogRef.current?.close()}
              >
                Close ×
              </button>
            </div>

            <div
              className="review-carousel-stage"
              role="region"
              aria-label="Client review carousel"
            >
              <button
                type="button"
                className="carousel-neighbor is-prev"
                onClick={() => handleStepCarousel(-1)}
                aria-label={`Previous review: ${prevReview.author} (${prevReview.platform})`}
              >
                <span className="neighbor-direction">← Previous</span>
                <span className="neighbor-rating">
                  <span className="card-stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span>{prevReview.platform}</span>
                </span>
                <span className="neighbor-quote">“{prevReview.quote}”</span>
                <span className="neighbor-author">
                  <span className="avatar" aria-hidden="true">
                    {prevReview.author[0].toUpperCase()}
                  </span>
                  <span>
                    {prevReview.author}
                    <small>{prevReview.subtitle}</small>
                  </span>
                </span>
              </button>

              <article
                key={selectedReview.id}
                id="full-review"
                className={`carousel-active-card slide-${slideDirection}`}
                aria-live="polite"
              >
                <div className="full-meta">
                  <span>{selectedReview.platform} review</span>
                  <span>★★★★★ · {selectedReview.rating} / 5</span>
                </div>
                <blockquote>“{selectedReview.quote}”</blockquote>
                <div className="full-author-row">
                  <span className="avatar" aria-hidden="true">
                    {selectedReview.author[0].toUpperCase()}
                  </span>
                  <div>
                    <h2 id="review-title">{selectedReview.author}</h2>
                    <p className="full-subtitle">{selectedReview.subtitle}</p>
                  </div>
                </div>
                {selectedReview.tags.length > 0 && (
                  <div className="endorsements">
                    {selectedReview.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </article>

              <button
                type="button"
                className="carousel-neighbor is-next"
                onClick={() => handleStepCarousel(1)}
                aria-label={`Next review: ${nextReview.author} (${nextReview.platform})`}
              >
                <span className="neighbor-direction">Next →</span>
                <span className="neighbor-rating">
                  <span className="card-stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span>{nextReview.platform}</span>
                </span>
                <span className="neighbor-quote">“{nextReview.quote}”</span>
                <span className="neighbor-author">
                  <span className="avatar" aria-hidden="true">
                    {nextReview.author[0].toUpperCase()}
                  </span>
                  <span>
                    {nextReview.author}
                    <small>{nextReview.subtitle}</small>
                  </span>
                </span>
              </button>
            </div>

            <div className="carousel-controls">
              <button
                type="button"
                className="carousel-step-btn"
                id="prev-review"
                onClick={() => handleStepCarousel(-1)}
                aria-label={`View previous review (${prevReview.author})`}
              >
                ← Prev
              </button>

              <div
                className="carousel-dots"
                role="tablist"
                aria-label="Choose a review"
              >
                {orderedCarouselReviews.map((item, idx) => {
                  const isCurrent = idx === activeCarouselIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Review ${idx + 1}: ${item.author}`}
                      className={`carousel-dot${isCurrent ? " is-active" : ""}`}
                      onClick={() => handleSelectCarouselIndex(idx)}
                    >
                      <span>{item.author}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="carousel-step-btn"
                id="next-review"
                onClick={() => handleStepCarousel(1)}
                aria-label={`View next review (${nextReview.author})`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
