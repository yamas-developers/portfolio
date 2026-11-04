import { FeedbackReview } from "./feedbackReviews";
import { SHORT_QUOTE, cardQuote, stars } from "./feedbackText";

type ReviewCardProps = {
  review: FeedbackReview;
  // Loop copies stay clickable but are skipped by the keyboard.
  copy?: boolean;
  isExplore?: boolean;
};

export default function ReviewCard({
  review,
  copy = false,
  isExplore = false,
}: ReviewCardProps) {
  return (
    <button
      type="button"
      className={`review-card${
        review.quote.length <= SHORT_QUOTE ? " is-short" : ""
      }`}
      data-review={review.id}
      aria-haspopup="dialog"
      tabIndex={copy ? -1 : undefined}
    >
      {isExplore && (
        <span className="card-drag-pill" aria-hidden="true">
          DRAG ME
        </span>
      )}
      <span className="card-rating">
        <span className="card-stars" aria-hidden="true">
          {stars(review.rating)}
        </span>
        <span className="sr-only">Rated {review.rating} out of 5.</span>
        <span>{review.platform}</span>
      </span>
      <span className="card-quote">“{cardQuote(review)}”</span>
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
  );
}
