"use client";

import {
  CSSProperties,
  MouseEvent,
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FeedbackReview, feedbackReviews } from "./feedbackReviews";
import { PHONE_WIDTH, distribute, listCount } from "./feedbackText";
import ReviewCard from "./ReviewCard";
import ReviewDialog, { ActiveReview } from "./ReviewDialog";
import ExploreModal from "./ExploreModal";
import { captureEvent } from "../analytics/posthog";

// A board of every client review, in lists that drift in a seamless loop.
// Ways to move it yourself:
// - every width: the board pins under the header and page scroll moves it.
//   Smart scroll: a fast downward flick passes the board like normal content.
// - the side rail: drag it, wheel over it, or use the arrow keys
// - Explore: every card full screen, scrolled on its own

const SPEED = 22; // px per second
const PHONE_SPEED = 30; // phones drift a little faster
const FAST = 2; // px per ms; a downward scroll faster than this passes the board
const MIN_MOVING_HEIGHT = 200; // lists shorter than this stay still
const STARTS = [0, 0.42, 0.2, 0.62]; // where each list starts in its loop
const PIN_BOTTOM_SPACE = 24; // slight margin below board to maximize content
const PHONE_PIN_BOTTOM_SPACE = 20; // slight margin on phones
const PHONE_PIN_SCREENS = 2.2; // phones pin for at most this many screen heights

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const wrap = (value: number, length: number) =>
  ((value % length) + length) % length;

type Filter = "all" | FeedbackReview["platform"];

type Layout = {
  moving: boolean;
  pinned: boolean;
  pinTop: number;
  height: number;
  lengths: number[];
  cycle: number;
  pinDistance: number;
  travel: number; // how far the lists move over the pinned stretch
  zoneHeight: number;
  wide: boolean;
};

type Column = {
  track: HTMLElement;
  length: number;
  direction: 1 | -1;
  start: number;
  drift: number;
  speed: number;
  hover: boolean;
  pinned: number | null;
};

type RailMark = { top: number; letter: string };

const averageRating = (
  feedbackReviews.reduce((sum, review) => sum + Number(review.rating), 0) /
  feedbackReviews.length
).toFixed(1);

const reviewsPerAuthor = feedbackReviews.reduce(
  (counts, review) =>
    counts.set(review.author, (counts.get(review.author) ?? 0) + 1),
  new Map<string, number>()
);
const repeatClients = Array.from(reviewsPerAuthor.values()).filter(
  (count) => count > 1
).length;

const filterOptions: { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "All", count: feedbackReviews.length },
  ...Array.from(new Set(feedbackReviews.map((review) => review.platform))).map(
    (platform) => ({
      value: platform,
      label: platform,
      count: feedbackReviews.filter((review) => review.platform === platform)
        .length,
    })
  ),
];

// Everything that moves runs outside React, on these refs and this state.
function createEngine() {
  const els = {
    zone: createRef<HTMLDivElement>(),
    board: createRef<HTMLDivElement>(),
    wall: createRef<HTMLDivElement>(),
    rail: createRef<HTMLDivElement>(),
    thumb: createRef<HTMLDivElement>(),
  };
  const state = {
    columns: [] as Column[],
    layout: null as Layout | null,
    shared: 0, // offset from the rail
    scrolled: 0, // offset from page scroll while the board is pinned
    playing: true,
    reduced: false,
    reading: false, // a popup or Explore is open
    onScreen: true,
    drag: null as { grab: number } | null,
    railHover: false,
    railKeys: false,
    lastScroll: 0,
    // Smart scroll
    passing: false, // a fast scroll released the board
    rebase: false, // carry on from where the lists are after a pass
    speed: 0, // smoothed scroll speed, px per ms
    lastY: 0,
    lastT: 0,
    anchorScroll: 0, // when an in-page link started a smooth scroll, or 0
  };

  const position = (column: Column) =>
    column.start +
    column.direction * (state.shared + state.scrolled) +
    column.drift;

  const draw = (column: Column) => {
    const y =
      column.pinned ?? column.length + wrap(position(column), column.length);
    column.track.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`;
  };

  // The rail follows the first list: its thumb is that list's place in the loop.
  const drawRail = () => {
    const first = state.columns[0];
    const rail = els.rail.current;
    const thumb = els.thumb.current;
    if (!first || !rail || !thumb) return;
    const fraction = wrap(position(first), first.length) / first.length;
    const travel = rail.clientHeight - thumb.offsetHeight;
    thumb.style.transform = `translateY(${(fraction * travel).toFixed(1)}px)`;
    rail.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
  };

  const drawAll = () => {
    state.columns.forEach(draw);
    drawRail();
  };

  const scrollShift = () => {
    const zone = els.zone.current;
    const layout = state.layout;
    if (!zone || !layout?.pinned) return 0;
    const progress = clamp(
      (layout.pinTop - zone.getBoundingClientRect().top) /
        Math.max(1, layout.pinDistance),
      0,
      1
    );
    return progress * layout.travel;
  };

  // The board tilts flat as it scrolls into view.
  const reveal = () => {
    const zone = els.zone.current;
    const board = els.board.current;
    if (!zone || !board) return;
    const distance = window.innerHeight * 0.5;
    const progress = state.reduced
      ? 1
      : clamp(
          (distance - zone.getBoundingClientRect().top) /
            Math.max(1, distance - 100),
          0,
          1
        );
    board.style.transform =
      progress >= 1
        ? "none"
        : `perspective(1400px) rotateX(${(1 - progress) * 24}deg) scale(${
            0.91 + progress * 0.09
          })`;
  };

  // The zone's height sets how long the board stays pinned. While a fast
  // scroll passes, the pinned stretch collapses to just the board.
  const sizeZone = () => {
    const zone = els.zone.current;
    const board = els.board.current;
    const layout = state.layout;
    if (!zone) return;
    if (!layout?.pinned) {
      zone.style.removeProperty("height");
      if (board) board.classList.remove("is-pinned");
      return;
    }
    zone.style.height = `${
      layout.zoneHeight - (state.passing ? layout.pinDistance : 0)
    }px`;
    if (board) {
      board.classList.toggle("is-pinned", !state.passing);
    }
  };

  const setPassing = (next: boolean) => {
    if (state.passing === next) return;
    state.passing = next;
    state.rebase = true;
    sizeZone();
  };

  // Smart scroll: a fast downward flick near or on the pinned board means
  // "let me pass", so the board stops pinning and scrolls away like normal
  // content. Slow scrolling keeps the pinned, scroll-driven board.
  const smartPass = (dy: number) => {
    const zone = els.zone.current;
    const board = els.board.current;
    const layout = state.layout;
    if (!zone || !board || !layout?.pinned) return;
    const box = zone.getBoundingClientRect();
    const { pinTop } = layout;
    if (!state.passing && dy > 0 && state.speed > FAST) {
      const approaching =
        box.top > pinTop && box.top - pinTop < window.innerHeight * 1.5;
      const pinnedNow =
        box.top <= pinTop && box.bottom > pinTop + board.offsetHeight;
      if (approaching || pinnedNow) setPassing(true);
    } else if (
      state.passing &&
      box.top > pinTop &&
      box.bottom >= window.innerHeight
    ) {
      // Back above the board, with what follows it still off screen: pin it
      // again. Only content below the screen moves, so nothing jumps.
      setPassing(false);
    }
  };

  const onScroll = () => {
    const now = performance.now();
    const dy = window.scrollY - state.lastY;
    state.speed =
      state.speed * 0.5 + (Math.abs(dy) / Math.max(8, now - state.lastT)) * 0.5;
    state.lastY = window.scrollY;
    state.lastT = now;
    state.lastScroll = now;
    reveal();
    if (!state.layout?.pinned) return;
    // A nav link's smooth scroll is fast too, but should land where it aimed.
    if (!state.anchorScroll) smartPass(dy);
    if (state.passing) return;
    const next = scrollShift();
    // Picking the scroll back up after a pass: carry on from where the
    // lists are, rather than jumping to where the scroll would put them.
    if (state.rebase) {
      state.shared += state.scrolled - next;
      state.rebase = false;
    }
    state.scrolled = next;
    drawAll();
  };

  // An in-page link was followed: hold the smart pass until its scroll ends.
  const onAnchorClick = (e: Event) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
    if (link) state.anchorScroll = performance.now();
  };

  const smartTick = (now: number) => {
    if (now - state.lastScroll > 150) state.speed = 0;
    if (
      state.anchorScroll &&
      now - state.anchorScroll > 300 &&
      now - state.lastScroll > 300
    )
      state.anchorScroll = 0;
    // Passed and now below the board: once scrolling stops, restore the
    // pinned stretch and move the page by the same amount, so nothing
    // visibly shifts.
    const zone = els.zone.current;
    const layout = state.layout;
    if (
      layout?.pinned &&
      state.passing &&
      !state.reading &&
      now - state.lastScroll > 1200 &&
      zone &&
      zone.getBoundingClientRect().bottom < 0
    ) {
      setPassing(false);
      window.scrollTo({
        top: window.scrollY + layout.pinDistance,
        behavior: "instant" as ScrollBehavior,
      });
    }
  };

  const tick = (dt: number, now: number) => {
    smartTick(now);
    if (!state.columns.length || !state.onScreen || document.hidden) return;
    // Drift eases out while someone scrolls, uses the rail, or reads.
    const busy =
      !state.playing ||
      Boolean(state.drag) ||
      state.railHover ||
      state.railKeys ||
      state.reading ||
      now - state.lastScroll < 450;
    let moved = false;
    state.columns.forEach((column) => {
      if (column.pinned !== null) return;
      const target =
        busy || column.hover ? 0 : state.layout?.wide ? SPEED : PHONE_SPEED;
      column.speed += (target - column.speed) * (1 - Math.exp(-dt * 4));
      if (target === 0 && column.speed < 0.05) column.speed = 0;
      if (column.speed === 0) return;
      column.drift += column.direction * column.speed * dt;
      draw(column);
      moved = true;
    });
    if (moved) drawRail();
  };

  // Client initials along the rail, skipping any that would crowd.
  const railMarks = (): RailMark[] => {
    const first = state.columns[0];
    const rail = els.rail.current;
    const thumb = els.thumb.current;
    const set = first?.track.querySelector<HTMLElement>(
      ".wall-set:not([aria-hidden])"
    );
    if (!first || !rail || !thumb || !set) return [];
    const travel = rail.clientHeight - thumb.offsetHeight;
    const marks: RailMark[] = [];
    let lastAt = -Infinity;
    Array.from(set.children).forEach((card) => {
      const at = ((card as HTMLElement).offsetTop - set.offsetTop) / first.length;
      if ((at - lastAt) * travel < 16) return;
      lastAt = at;
      marks.push({
        top: at * 100,
        letter: card.querySelector(".avatar")?.textContent ?? "",
      });
    });
    return marks;
  };

  const setLayout = (layout: Layout | null) => {
    state.layout = layout;
    state.columns = [];
    state.passing = false;
    state.rebase = false;
    sizeZone();
    const wall = els.wall.current;
    if (!layout?.moving || !wall) return [];
    state.columns = Array.from(
      wall.querySelectorAll<HTMLElement>(".wall-track")
    ).map((track, i) => ({
      track,
      length: layout.lengths[i],
      direction: i % 2 ? -1 : 1,
      start: layout.lengths[i] * STARTS[i % STARTS.length],
      drift: 0,
      speed: 0,
      hover: false,
      pinned: null,
    }));
    state.scrolled = scrollShift();
    drawAll();
    return railMarks();
  };

  // Puts the first list at `fraction` of its loop, the short way round.
  const moveRailTo = (fraction: number) => {
    const first = state.columns[0];
    if (!first) return;
    const current = wrap(position(first), first.length);
    state.shared +=
      wrap(fraction * first.length - current + first.length / 2, first.length) -
      first.length / 2;
    drawAll();
  };

  const seekRail = (clientY: number) => {
    const rail = els.rail.current;
    const thumb = els.thumb.current;
    if (!state.drag || !rail || !thumb) return;
    const box = rail.getBoundingClientRect();
    moveRailTo(
      clamp(
        (clientY - box.top - state.drag.grab) /
          (box.height - thumb.offsetHeight),
        0,
        1
      )
    );
  };

  // Keyboard focus stops a list with the focused card in view.
  const holdCard = (index: number, card: HTMLElement) => {
    const column = state.columns[index];
    const wall = els.wall.current;
    if (!column || !wall) return;
    const view = wall.clientHeight;
    column.pinned = clamp(
      card.offsetTop - (view - card.offsetHeight) / 2,
      0,
      column.length * 3 - view
    );
    column.speed = 0;
    draw(column);
  };

  const releaseCard = (index: number) => {
    const column = state.columns[index];
    if (!column || column.pinned === null) return;
    column.drift =
      column.pinned -
      column.length -
      column.start -
      column.direction * (state.shared + state.scrolled);
    column.pinned = null;
  };

  return {
    els,
    state,
    drawAll,
    reveal,
    onScroll,
    onAnchorClick,
    tick,
    setLayout,
    moveRailTo,
    seekRail,
    holdCard,
    releaseCard,
  };
}

type Engine = ReturnType<typeof createEngine>;

function WallSet({
  reviews,
  copy = false,
}: {
  reviews: FeedbackReview[];
  copy?: boolean;
}) {
  // Copies above and below make the loop seamless. They are hidden from
  // assistive tech and the tab order, but stay clickable.
  return (
    <div className="wall-set" aria-hidden={copy || undefined}>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} copy={copy} />
      ))}
    </div>
  );
}

export default function Feedback() {
  const engineRef = useRef<Engine | null>(null);
  if (!engineRef.current) engineRef.current = createEngine();
  const engine = engineRef.current;

  const triggerRef = useRef<HTMLElement | null>(null);

  const [filter, setFilter] = useState<Filter>("all");
  const [leaving, setLeaving] = useState(false);
  const [entering, setEntering] = useState(false);
  const [viewport, setViewport] = useState({ lists: 3, wide: true });
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [measureKey, setMeasureKey] = useState(0);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [railMarks, setRailMarks] = useState<RailMark[]>([]);
  const [active, setActive] = useState<ActiveReview | null>(null);
  const [dialogReviews, setDialogReviews] = useState<FeedbackReview[] | null>(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const list = useMemo(
    () =>
      filter === "all"
        ? feedbackReviews
        : feedbackReviews.filter((review) => review.platform === filter),
    [filter]
  );
  const lists = clamp(viewport.lists, 1, Math.max(1, list.length));
  const groups = useMemo(() => distribute(list, lists), [list, lists]);
  const showing =
    filter === "all"
      ? `Showing all ${list.length} reviews`
      : `Showing ${list.length} ${filter} review${list.length === 1 ? "" : "s"}`;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      engine.state.reduced = media.matches;
      engine.state.playing = !media.matches;
      setReduced(media.matches);
      setPlaying(!media.matches);
      engine.reveal();
    };
    syncMotion();
    media.addEventListener("change", syncMotion);

    let width = window.innerWidth;
    setViewport({ lists: listCount(width), wide: width > PHONE_WIDTH });
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        engine.reveal();
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        setViewport({ lists: listCount(width), wide: width > PHONE_WIDTH });
        setMeasureKey((key) => key + 1);
      }, 160);
    };
    window.addEventListener("resize", onResize);
    engine.state.lastY = window.scrollY;
    engine.state.lastT = performance.now();
    window.addEventListener("scroll", engine.onScroll, { passive: true });
    document.addEventListener("click", engine.onAnchorClick, true);

    // Card heights are measured, so measure again once the fonts are in.
    document.fonts?.ready.then(() => setMeasureKey((key) => key + 1));

    const observer = new IntersectionObserver(([entry]) => {
      engine.state.onScreen = entry.isIntersecting;
    });
    if (engine.els.wall.current) observer.observe(engine.els.wall.current);

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      engine.tick(Math.min((now - last) / 1000, 0.05), now);
      last = now;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // The rail takes the wheel, so the page does not scroll under it.
    const rail = engine.els.rail.current;
    const onRailWheel = (e: WheelEvent) => {
      if (!engine.state.columns.length || e.ctrlKey) return;
      e.preventDefault();
      engine.state.shared += e.deltaY * (e.deltaMode === 1 ? 18 : 1);
      engine.drawAll();
    };
    rail?.addEventListener("wheel", onRailWheel, { passive: false });

    return () => {
      media.removeEventListener("change", syncMotion);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", engine.onScroll);
      document.removeEventListener("click", engine.onAnchorClick, true);
      observer.disconnect();
      cancelAnimationFrame(frame);
      rail?.removeEventListener("wheel", onRailWheel);
    };
  }, [engine]);

  // Measure in two passes: render the lists at their natural height, then
  // size the board from them and add the loop copies.
  useIsomorphicLayoutEffect(() => {
    setLayout(null);
  }, [groups, viewport.wide, reduced, measureKey]);

  useIsomorphicLayoutEffect(() => {
    if (layout) return;
    const zone = engine.els.zone.current;
    const board = engine.els.board.current;
    const wall = engine.els.wall.current;
    if (!zone || !board || !wall) return;
    const sets = Array.from(wall.querySelectorAll<HTMLElement>(".wall-set"));
    if (!sets.length) return;
    const lengths = sets.map((set) => set.offsetHeight);
    const pinTop =
      parseFloat(getComputedStyle(zone).getPropertyValue("--pin-top")) || 0;
    // Pinned, the whole board has to fit below the header and above the
    // floating button.
    const chrome = board.offsetHeight - wall.offsetHeight;
    const bottomSpace = viewport.wide ? PIN_BOTTOM_SPACE : PHONE_PIN_BOTTOM_SPACE;
    const target = clamp(
      window.innerHeight - pinTop - chrome - bottomSpace,
      MIN_MOVING_HEIGHT,
      820
    );
    const height = Math.round(Math.min(target, ...lengths));
    const moving = !reduced && height >= MIN_MOVING_HEIGHT;
    // Every width pins now, phones included.
    const pinned = moving;
    const cycle = Math.max(...lengths);
    // Wider screens map one full loop of the longest list onto the pinned
    // stretch (capped on very long boards). Phones move the lists 1:1 with
    // the finger over a shorter stretch.
    const pinDistance = pinned
      ? Math.min(
          cycle,
          window.innerHeight * (viewport.wide ? 4 : PHONE_PIN_SCREENS)
        )
      : 0;
    setLayout({
      moving,
      pinned,
      pinTop,
      height,
      lengths,
      cycle,
      pinDistance,
      travel: viewport.wide ? cycle : pinDistance,
      zoneHeight: chrome + height + pinDistance,
      wide: viewport.wide,
    });
  }, [engine, layout, reduced, viewport.wide]);

  useIsomorphicLayoutEffect(() => {
    setRailMarks(engine.setLayout(layout));
  }, [engine, layout]);

  useEffect(() => {
    engine.state.playing = playing;
  }, [engine, playing]);

  useEffect(() => {
    const reading = active !== null || exploreOpen;
    engine.state.reading = reading;
    document.body.style.overflow = reading ? "hidden" : "";
  }, [engine, active, exploreOpen]);

  const changeFilter = (next: Filter) => {
    if (next === filter) return;
    captureEvent("feedback_filter", { filter: next });
    setLeaving(true);
    setTimeout(
      () => {
        setFilter(next);
        setEntering(true);
        setLeaving(false);
        const count = filterOptions.find((o) => o.value === next)?.count ?? 0;
        setAnnouncement(
          next === "all"
            ? `Showing all ${count} reviews.`
            : `Showing ${count} ${next} review${count === 1 ? "" : "s"}.`
        );
      },
      reduced ? 0 : 200
    );
  };

  const toggleMotion = () => {
    const next = !playing;
    setPlaying(next);
    captureEvent("feedback_motion_toggle", { moving: next });
  };

  const openReview = (e: MouseEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".review-card");
    if (!card) return;
    const index = list.findIndex(
      (review) => review.id === Number(card.dataset.review)
    );
    if (index === -1) return;
    setDialogReviews(null);
    triggerRef.current = card;
    setActive({ index, direction: "none" });
    const review = list[index];
    captureEvent("feedback_review_open", {
      review_id: review.id,
      author: review.author,
      platform: review.platform,
    });
  };

  // Copies are hidden from assistive tech, so focus returns to the original.
  const restoreFocus = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const target =
      trigger.isConnected && !trigger.closest("[aria-hidden]")
        ? trigger
        : engine.els.wall.current?.querySelector<HTMLElement>(
            `.wall-set:not([aria-hidden]) [data-review="${trigger.dataset.review}"]`
          );
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  };

  const measuring = layout === null;
  const moving = Boolean(layout?.moving);
  const wallClass = [
    "wall",
    moving && "is-moving",
    layout && !moving && "is-static",
    entering && "is-entering",
    leaving && "is-leaving",
    list.length === 1 && "is-single",
  ]
    .filter(Boolean)
    .join(" ");
  const wallStyle = {
    "--cols": lists,
    ...(layout?.moving ? { "--wall-h": `${layout.height}px` } : {}),
  } as CSSProperties;

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
          <p className="feedback-lede">
            Feedback from clients I’ve worked with on Fiverr and Upwork.
          </p>
        </div>
        <dl className="feedback-stats" aria-label="Review summary">
          <div>
            <dt>Client reviews</dt>
            <dd>{feedbackReviews.length}</dd>
          </div>
          <div>
            <dt>Average rating</dt>
            <dd>
              {averageRating}
              <span className="stat-star" aria-hidden="true">
                ★
              </span>
            </dd>
          </div>
          <div>
            <dt>Repeat clients</dt>
            <dd>{repeatClients}</dd>
          </div>
        </dl>
      </div>

      <div
        ref={engine.els.zone}
        // The engine sets the zone's height, which a smart pass collapses.
        className={`pin-zone${layout?.pinned ? " is-pinned" : ""}`}
      >
        <div
          ref={engine.els.board}
          className={`board${
            // Measure with the pinned note text, which is longer.
            (layout ? layout.pinned : !reduced)
              ? " is-pinned"
              : ""
          }${layout && !moving ? " is-still" : ""}`}
        >
          <div className="board-header">
            <div
              className="filters"
              role="group"
              aria-label="Filter reviews by platform"
            >
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => changeFilter(option.value)}
                >
                  {option.label}{" "}
                  <span className="filter-count">{option.count}</span>
                </button>
              ))}
            </div>
            <div className="board-actions" hidden={Boolean(layout) && !moving}>
              <button
                type="button"
                className="board-button"
                onClick={toggleMotion}
                aria-label={
                  playing ? "Pause moving reviews" : "Play moving reviews"
                }
                title={playing ? "Pause" : "Play"}
              >
                <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
                <span>{playing ? "Pause" : "Play"}</span>
              </button>
              <button
                type="button"
                className="board-button"
                aria-haspopup="dialog"
                aria-label="Explore all reviews"
                title="Explore"
                onClick={() => {
                  setExploreOpen(true);
                  captureEvent("feedback_explore_open");
                }}
              >
                <span aria-hidden="true">⤢</span>
                <span>Explore</span>
              </button>
            </div>
          </div>

          <div className="board-content">
            <div
              className={`wall-frame${
                !reduced && (measuring || moving) ? " has-rail" : ""
              }`}
            >
              <div
                ref={engine.els.wall}
                className={wallClass}
                style={wallStyle}
                onClick={openReview}
                // Browsers without overflow: clip would scroll to a focused card.
                onScroll={(e) => {
                  e.currentTarget.scrollTop = 0;
                }}
              >
                {groups.map((group, i) => (
                  <div
                    key={`${filter}-${lists}-${i}`}
                    className="wall-col"
                    style={{ "--i": i } as CSSProperties}
                    onPointerEnter={(e) => {
                      const column = engine.state.columns[i];
                      if (column && e.pointerType === "mouse") column.hover = true;
                    }}
                    onPointerLeave={(e) => {
                      const column = engine.state.columns[i];
                      if (column && e.pointerType === "mouse") column.hover = false;
                    }}
                    onFocus={(e) => {
                      const card = (e.target as HTMLElement).closest<HTMLElement>(
                        ".review-card"
                      );
                      if (card?.matches(":focus-visible")) engine.holdCard(i, card);
                    }}
                    onBlur={(e) => {
                      if (e.currentTarget.contains(e.relatedTarget as Node | null))
                        return;
                      engine.releaseCard(i);
                    }}
                  >
                    <div className="wall-track">
                      {moving && <WallSet key="before" reviews={group} copy />}
                      <WallSet key="original" reviews={group} />
                      {moving && <WallSet key="after" reviews={group} copy />}
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={engine.els.rail}
                className="rail"
                role="slider"
                tabIndex={0}
                aria-label="Move through the reviews"
                aria-orientation="vertical"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                hidden={!moving}
                onPointerDown={(e) => {
                  const thumb = engine.els.thumb.current;
                  if (!engine.state.columns.length || !thumb) return;
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  const box = thumb.getBoundingClientRect();
                  const onThumb = e.clientY >= box.top && e.clientY <= box.bottom;
                  engine.state.drag = {
                    grab: onThumb ? e.clientY - box.top : box.height / 2,
                  };
                  if (!onThumb) engine.seekRail(e.clientY);
                  captureEvent("feedback_rail_use", { method: "drag" });
                }}
                onPointerMove={(e) => engine.seekRail(e.clientY)}
                onPointerUp={() => (engine.state.drag = null)}
                onPointerCancel={() => (engine.state.drag = null)}
                onLostPointerCapture={() => (engine.state.drag = null)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") engine.state.railHover = true;
                }}
                onPointerLeave={() => (engine.state.railHover = false)}
                onFocus={(e) => {
                  engine.state.railKeys = e.currentTarget.matches(":focus-visible");
                }}
                onBlur={() => (engine.state.railKeys = false)}
                onKeyDown={(e) => {
                  if (!engine.state.columns.length) return;
                  const page = (engine.els.wall.current?.clientHeight ?? 400) * 0.8;
                  const steps: Record<string, number> = {
                    ArrowDown: 80,
                    ArrowRight: 80,
                    ArrowUp: -80,
                    ArrowLeft: -80,
                    PageDown: page,
                    PageUp: -page,
                  };
                  if (e.key in steps) {
                    engine.state.shared += steps[e.key];
                    engine.drawAll();
                  } else if (e.key === "Home") engine.moveRailTo(0);
                  else if (e.key === "End") engine.moveRailTo(1);
                  else return;
                  e.preventDefault();
                  engine.state.railKeys = true;
                }}
              >
                <div className="rail-marks" aria-hidden="true">
                  {railMarks.map((mark, i) => (
                    <span key={i} style={{ top: `${mark.top}%` }}>
                      {mark.letter}
                    </span>
                  ))}
                </div>
                <div ref={engine.els.thumb} className="rail-thumb" />
              </div>
            </div>

            <div className="board-note">
              <span className="note-hover">
                <span className="pause-hint">
                  <span className="scroll-hint">Scroll the page or drag</span>
                  <span className="drag-hint">Drag</span> the rail to move the
                  board. Hover a list to pause.{" "}
                </span>
                Click any card to read it in full.
              </span>
              <span className="note-touch">
                <span className="pause-hint">
                  <span className="scroll-hint">Scroll the page or drag</span>
                  <span className="drag-hint">Drag</span> the rail to move the
                  board.{" "}
                </span>
                Tap any card to read it in full.
              </span>
              <span>{showing}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">
        {announcement}
      </p>

      {exploreOpen && (
        <ExploreModal
          open={exploreOpen}
          onClose={() => setExploreOpen(false)}
          onOpenReview={(review, trigger, currentList) => {
            const index = currentList.findIndex((r) => r.id === review.id);
            if (index === -1) return;
            setDialogReviews(currentList);
            triggerRef.current = trigger;
            setActive({ index, direction: "none" });
            captureEvent("feedback_review_open", {
              review_id: review.id,
              author: review.author,
              platform: review.platform,
            });
          }}
        />
      )}

      <ReviewDialog
        reviews={dialogReviews ?? list}
        active={active}
        setActive={setActive}
        onClosed={restoreFocus}
      />
    </section>
  );
}
