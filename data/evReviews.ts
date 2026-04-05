export type EVReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  ownershipMonths: number;
  useCase: string;
};

const reviewMap: Record<string, EVReview[]> = {
  "byd-atto-3": [
    {
      id: "atto-3-r1",
      author: "A. Khan",
      rating: 5,
      title: "Great family daily driver",
      comment: "Cabin space is excellent and it feels very easy to drive in city traffic. Running cost dropped a lot compared to my previous petrol SUV.",
      ownershipMonths: 11,
      useCase: "Family + school commute",
    },
    {
      id: "atto-3-r2",
      author: "M. Ross",
      rating: 4,
      title: "Comfortable but charger planning matters",
      comment: "Super comfortable for long trips. Public charging coverage is improving but route planning still helps on motorway drives.",
      ownershipMonths: 7,
      useCase: "Mixed city/highway",
    },
  ],
  "byd-dolphin": [
    {
      id: "dolphin-r1",
      author: "S. Patel",
      rating: 4,
      title: "Ideal for urban use",
      comment: "Very practical hatchback and easy to park. Range is more than enough for my weekly routine.",
      ownershipMonths: 8,
      useCase: "City commute",
    },
  ],
  "tesla-model-3": [
    {
      id: "model3-r1",
      author: "R. Hayes",
      rating: 5,
      title: "Software and charging are top tier",
      comment: "Frequent updates keep the car fresh, and long trips are stress-free because of reliable fast charging.",
      ownershipMonths: 16,
      useCase: "Long-distance + commute",
    },
    {
      id: "model3-r2",
      author: "J. Cole",
      rating: 4,
      title: "Very efficient overall",
      comment: "Energy efficiency is excellent and handling is sharp. Ride can feel firm on rough roads.",
      ownershipMonths: 10,
      useCase: "Daily commute",
    },
  ],
};

const genericReviews: EVReview[] = [
  {
    id: "generic-r1",
    author: "EV Owner",
    rating: 4,
    title: "Good ownership experience",
    comment: "Lower fuel and maintenance costs are the biggest wins. Charging routine became easy after the first few weeks.",
    ownershipMonths: 9,
    useCase: "Daily driving",
  },
  {
    id: "generic-r2",
    author: "Verified Driver",
    rating: 5,
    title: "Would buy electric again",
    comment: "Smooth acceleration and quiet cabin make every trip more comfortable than my old ICE vehicle.",
    ownershipMonths: 12,
    useCase: "Family + weekend travel",
  },
];

export function getReviewsForModel(modelId: string): EVReview[] {
  return reviewMap[modelId] ?? genericReviews;
}
