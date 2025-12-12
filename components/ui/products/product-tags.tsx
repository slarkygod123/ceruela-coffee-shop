import { Badge } from "@/components/ui/badge";

interface ProductTagsProps {
  tags: string[];
}

export function ProductTags({ tags }: ProductTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="font-medium text-gray-700 mb-2">Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-amber-100 text-amber-800"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}