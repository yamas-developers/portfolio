import { Fragment } from "react";
import { FeedbackReview } from "./feedbackReviews";

// Quotes this short are set large on the board.
export const SHORT_QUOTE = 70;

// At or below this width the board shows one list, with tighter cards.
export const PHONE_WIDTH = 600;

// 1 list up to 600px, 2 up to 850px, 3 up to 1100px, 4 above.
export function listCount(width: number) {
  if (width <= PHONE_WIDTH) return 1;
  if (width <= 850) return 2;
  if (width <= 1100) return 3;
  return 4;
}

export function stars(rating: string) {
  const filled = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export function highlightQuote(quote: string, highlight?: string) {
  if (!highlight || !quote.includes(highlight)) {
    return quote;
  }
  const parts = quote.split(highlight);
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <mark className="quote-highlight">{highlight}</mark>
      )}
    </Fragment>
  ));
}

// Board cards skip a highlight that covers almost the whole quote, and skip
// it on short quotes, which are already set large.
export function cardQuote({ quote, highlight }: FeedbackReview) {
  if (
    !highlight ||
    quote.length <= SHORT_QUOTE ||
    highlight.length / quote.length > 0.8
  ) {
    return quote;
  }
  return highlightQuote(quote, highlight);
}

// Each review goes to the list with the least estimated height so far.
export function distribute(reviews: FeedbackReview[], count: number) {
  const groups = Array.from({ length: count }, () => ({
    reviews: [] as FeedbackReview[],
    weight: 0,
  }));
  reviews.forEach((review) => {
    const lightest = groups.reduce((a, b) => (b.weight < a.weight ? b : a));
    lightest.reviews.push(review);
    lightest.weight += 150 + Math.min(review.quote.length, 330) * 0.85;
  });
  return groups.map((group) => group.reviews);
}
