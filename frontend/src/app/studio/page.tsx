import type { Metadata } from "next";

import ToolStudioClient from "@/components/tools/ToolStudioClient";

export const metadata: Metadata = {
  title: "Tool Studio",
  description:
    "A responsive skeuomorphic workspace that lets you browse and run every Toolit tool from one page.",
};

export default function StudioPage() {
  return <ToolStudioClient />;
}
