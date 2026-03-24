import { buildMetadata } from "@/lib/seo";

import AllToolsPageClient from "./AllToolsPageClient";

export const metadata = buildMetadata({
  title: "All Tools",
  description:
    "Alternate catalog view for browsing Toolmitra tools across images, documents, developer utilities, and calculators.",
  path: "/all-tools/",
  canonicalPath: "/tools/",
  noIndex: true,
});

export default function AllToolsPage() {
  return <AllToolsPageClient />;
}
