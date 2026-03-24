import { buildMetadata } from "@/lib/seo";

import AllToolsClient from "./AllToolsClient";

export const metadata = buildMetadata({
  title: "Tool Categories",
  description:
    "Alternate browsing experience for Toolmitra's tool catalog.",
  path: "/home2/",
  canonicalPath: "/tools/",
  noIndex: true,
});

export default function Home2Page() {
  return <AllToolsClient />;
}
