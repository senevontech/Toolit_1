import type { Metadata } from "next";

import ToolStudioClient from "@/components/tools/ToolStudioClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tool Studio",
  description:
    "Experimental studio interface for browsing Toolmitra tools in one page.",
  path: "/studio/",
  canonicalPath: "/tools/",
  noIndex: true,
});

export default function StudioPage() {
  return <ToolStudioClient />;
}
