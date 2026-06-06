import type { BlogCategory } from "./types";

interface BlogFilterProps {
  categories: readonly BlogCategory[];
  activeCategory: BlogCategory;
  onCategoryChange: (value: BlogCategory) => void;
}

export default function BlogFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogFilterProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="inline-flex w-full flex-wrap gap-3 rounded-[2rem] border border-gray-200 bg-white p-3 shadow-sm">
        {categories.map((category) => {
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition duration-300 ${
                active
                  ? "bg-black text-white shadow-sm"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
