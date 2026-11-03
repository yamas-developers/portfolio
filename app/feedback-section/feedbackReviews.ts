export type FeedbackReview = {
  id: number;
  quote: string;
  highlight?: string;
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
    highlight: "completed a complex application that many freelancers could not",
    author: "mohamed_el_alem",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Complex Apps", "Clean Code"],
  },
  {
    id: 1,
    quote:
      "Mohammad is professional mobile developer who has great experience and knowledge. Also, he has outstanding and amazing customer service and support. In the future, if I need any assistance I will contact Mohammed immediately. Thank you so much Mohammed and I wish you all the best.",
    highlight: "outstanding and amazing customer service and support",
    author: "abdu1kareem",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Mobile Developer", "Great Support"],
  },
  {
    id: 2,
    quote:
      "he was very helpful and really friendly. Fixed my problems and helped me with my idea fast and quickly !",
    highlight: "Fixed my problems and helped me with my idea fast and quickly",
    author: "aforza",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Fast Problem Solving"],
  },
  {
    id: 3,
    quote:
      "Great Experience..! He is an experienced developer who knows flutter very well..! He patiently solve all my issues without showing any frustration. I highly recommend him for any kind of Flutter development work...!",
    highlight: "patiently solve all my issues without showing any frustration",
    author: "hridoy081",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Flutter Expert", "Patient & Dedicated"],
  },
  {
    id: 4,
    quote:
      "This was very quick, Muhamad_kihzer delivered the order with no problems. Fixed the issue in a few hours. He is very good at his job. I would recommend it to anyone who is considering this offer! Well done.",
    highlight: "Fixed the issue in a few hours.",
    author: "komilly",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Quick Turnaround", "Problem Solver"],
  },
  {
    id: 5,
    quote:
      "He is very concerned about his work...muhamad has a good and soft communication skills and understands problems quickly...work done in very less timeline and very good quality work...I recommend him for my next work.",
    highlight: "understands problems quickly...work done in very less timeline",
    author: "atulalive",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Committed to Quality", "Clear Communicator", "Reliable"],
  },
  {
    id: 6,
    quote:
      "Another Great experience with Khizer. So smart, kind, flexible and very quick. The best Flutter developer you can hire. Thank you.",
    highlight: "The best Flutter developer you can hire.",
    author: "mohamed_el_alem",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Best Flutter Developer", "Repeat Client", "Fast & Flexible"],
  },
  {
    id: 7,
    quote:
      "Excellent service..!! Muhamad Khizer was very knowledgeable and patient with me... I will definitely using his services again in future...! Muhamad Khizer helped me to solve critical flutter issue, He is very trusted person.. 100% recommended.",
    highlight: "helped me to solve critical flutter issue",
    author: "hridoy081",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Critical Bug Fixes", "100% Recommended", "Trusted Partner"],
  },
  {
    id: 8,
    quote:
      "he's great, I've closed thousands of projects with him",
    highlight: "I've closed thousands of projects with him",
    author: "luisfelipe590",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Long-term Partner", "High Trust"],
  },
  {
    id: 9,
    quote:
      "excellent! seller was able to fix my issue in a jiffy",
    highlight: "able to fix my issue in a jiffy",
    author: "jfiver1",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Quick Fix", "Efficient Delivery"],
  },
  {
    id: 10,
    quote:
      "Excellent work more than which I expected. Thank you Mr. Mohammed.",
    highlight: "Excellent work more than which I expected.",
    author: "abdu1kareem",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Exceeded Expectations"],
  },
  {
    id: 11,
    quote:
      "Fast, diligent and efficient!",
    highlight: "Fast, diligent and efficient!",
    author: "attuneone",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Diligent & Efficient"],
  },
  {
    id: 12,
    quote:
      "quickly and qualitatively",
    highlight: "quickly and qualitatively",
    author: "alexsm90",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["High Quality", "Quick Delivery"],
  },
  {
    id: 13,
    quote:
      "He was very helpful and really friendly. Fixed my problems and helped me with my idea fast and quickly!",
    highlight: "Fixed my problems and helped me with my idea fast and quickly!",
    author: "aforza",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Friendly & Fast"],
  },
  {
    id: 14,
    quote:
      "very professional I loved his work!",
    highlight: "very professional I loved his work!",
    author: "komilly",
    platform: "Fiverr",
    subtitle: "Repeat Fiverr client",
    rating: "5.0",
    tags: ["Professional Quality"],
  },
  {
    id: 15,
    quote:
      "he's really good at it!",
    highlight: "he's really good at it!",
    author: "luisfelipe590",
    platform: "Fiverr",
    subtitle: "Fiverr client",
    rating: "5.0",
    tags: ["Skilled & Capable"],
  },
  {
    id: 16,
    quote:
      "He is very concerned about his work...muhamad has a good and soft communication skills and understands problems quickly...work done in very less timeline and very good quality work...I recommend him for my next work.",
    highlight: "good and soft communication skills and understands problems quickly",
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
    reviewIds: [0, 2, 5, 6, 8, 10, 12, 14, 16],
  },
  {
    label: "Support along the way",
    reviewIds: [1, 3, 4, 7, 9, 11, 13, 15],
  },
];

// Carousel sequence ordered to match the visual neighbor order across Row 1 and Row 2.
export const orderedCarouselReviews: FeedbackReview[] = feedbackRowGroups
  .flatMap((group) => group.reviewIds)
  .map((id) => feedbackReviews.find((review) => review.id === id))
  .filter((review): review is FeedbackReview => Boolean(review));
