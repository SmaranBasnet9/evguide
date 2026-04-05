import type { ApprovedFeedbackStory } from "@/lib/feedback";
import ApprovedFeedbackStories from "@/components/ApprovedFeedbackStories";
import Link from "next/link";

const stories = [
  {
    title: "Why drivers switch to EVs",
    text: "Owners often mention lower running costs, silent driving, easier city commuting, and less maintenance.",
  },
  {
    title: "What people love most",
    text: "Fast charging, instant torque, smart tech, and lower daily fuel spending are the most common reasons.",
  },
  {
    title: "Real buyer mindset",
    text: "Most buyers compare range, affordability, charging speed, and long-term reliability before choosing a model.",
  },
];

type Props = {
  feedbackStories: ApprovedFeedbackStory[];
  models: Array<{
    id: string;
    brand: string;
    model: string;
  }>;
};

export default function StoriesSection({ feedbackStories, models }: Props) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-sm font-semibold text-blue-600">Feedback & Stories</p>
        <h2 className="mt-2 text-3xl font-bold">
          Why EVs are winning people over
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold">{story.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{story.text}</p>
              <Link href="/blog" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                Read more →
              </Link>
            </div>
          ))}
        </div>

        <ApprovedFeedbackStories stories={feedbackStories} models={models} />
      </div>
    </section>
  );
}
