import Link from "next/link";
import { getDocsByGroup } from "@/lib/docs-utils";

export async function DocsSidebar() {
  const groupedDocs = await getDocsByGroup();

  // Define the display order of groups
  const groupOrder = ["Getting started", "User guide", "Resources"];
  const sortedGroups = Object.entries(groupedDocs).sort((a, b) => {
    const aIndex = groupOrder.indexOf(a[0]);
    const bIndex = groupOrder.indexOf(b[0]);
    if (aIndex === -1 && bIndex === -1) return a[0].localeCompare(b[0]);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <nav className="space-y-6" aria-label="Docs navigation">
      {sortedGroups.map(([group, docs]) => (
        <div key={group}>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/55">
            {group}
          </p>
          <ul className="mt-2 space-y-1.5">
            {docs.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={`/docs/${doc.slug}`}
                  className="block py-1 text-sm text-black/80 no-underline transition-colors hover:text-black hover:underline"
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      </nav>
  );
}
