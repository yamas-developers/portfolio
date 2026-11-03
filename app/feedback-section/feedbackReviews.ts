export type FeedbackReview = {
  id: number;
  quote: string;
  author: string;
  platform: "Fiverr" | "Upwork";
  subtitle: string;
  rating: string;
  tags: string[];
};

export const feedbackReviews: FeedbackReview[] = [
  {
    id: 0,
    quote:
      "Wow muhamad_khizer!, very smart and professional developer. he completed a complex application that many freelancers could not, and in a very short time with quality and clean code. highly recommended.",
    author: "mohamed_el_alem",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: [],
  },
  {
    id: 1,
    quote:
      "Mohammad is professional mobile developer who has great experience and knowledge. Also, he has outstanding and amazing customer service and support. In the future, if I need any assistance I will contact Mohammed immediately. Thank you so much Mohammed and I wish you all the best.",
    author: "abdu1kareem",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: [],
  },
  {
    id: 2,
    quote:
      "he was very helpful and really friendly. Fixed my problems and helped me with my idea fast and quickly !",
    author: "aforza",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: [],
  },
  {
    id: 3,
    quote:
      "Great Experience..! He is an experienced developer who knows flutter very well..! He patiently solve all my issues without showing any frustration. I highly recommend him for any kind of Flutter development work...!",
    author: "hridoy081",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: [],
  },
  {
    id: 4,
    quote:
      "This was very quick, Muhamad_kihzer delivered the order with no problems. Fixed the issue in a few hours. He is very good at his job. I would recommend it to anyone who is considering this offer! Well done.",
    author: "komilly",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: [],
  },
  {
    id: 5,
    quote:
      "He is very concerned about his work...muhamad has a good and soft communication skills and understands problems quickly...work done in very less timeline and very good quality work...I recommend him for my next work.",
    author: "Groshop store app",
    platform: "Upwork",
    subtitle: "Groshop store app · Upwork",
    rating: "5.0",
    tags: ["Committed to Quality", "Clear Communicator", "Reliable"],
  },
];

export const feedbackRowGroups: { label: string; reviewIds: number[] }[] = [
  {
    label: "From idea to delivery",
    reviewIds: [0, 2, 5],
  },
  {
    label: "Support along the way",
    reviewIds: [1, 3, 4],
  },
];

// Carousel sequence ordered to match the visual neighbor order across Row 1 and Row 2.
export const orderedCarouselReviews: FeedbackReview[] = feedbackRowGroups
  .flatMap((group) => group.reviewIds)
  .map((id) => feedbackReviews.find((review) => review.id === id))
  .filter((review): review is FeedbackReview => Boolean(review));
