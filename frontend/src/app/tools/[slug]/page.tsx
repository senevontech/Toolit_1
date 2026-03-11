"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/tools";

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;

  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-500">
          Tool not found.
        </h2>
      </div>
    );
  }

  const Component = tool.component;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Component />
      </div>
    </div>
  );
}