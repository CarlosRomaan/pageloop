"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SearchResults = {
  projects: {
    id: string;
    name: string;
    slug: string;
  }[];
  comments: {
    id: string;
    number: number;
    message: string;
    project: {
      name: string;
      slug: string;
    };
  }[];
  pages: {
    id: string;
    title: string | null;
    path: string;
    project: {
      name: string;
      slug: string;
    };
  }[];
};

type FlattenedResult = {
  id: string;
  href: string;
  label: string;
  description?: string;
  type: "project" | "comment" | "page";
};

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
    setSelectedIndex(0);
  };

  const flattenedResults = useMemo<FlattenedResult[]>(() => {
    if (!results) {
      return [];
    }

    return [
      ...results.projects.map((project) => ({
        id: project.id,
        href: `/projects/${project.slug}`,
        label: project.name,
        description: "Project",
        type: "project" as const,
      })),

      ...results.comments.map((comment) => ({
        id: comment.id,
        href: `/projects/${comment.project.slug}/comments/${comment.id}`,
        label: `#${comment.number} ${comment.message}`,
        description: comment.project.name,
        type: "comment" as const,
      })),

      ...results.pages.map((page) => ({
        id: page.id,
        href: `/projects/${page.project.slug}/pages`,
        label: page.title ?? page.path,
        description: page.project.name,
        type: "page" as const,
      })),
    ];
  }, [results]);

  const hasResults = flattenedResults.length > 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setSelectedIndex(0);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setResults(data);
      setSelectedIndex(0);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!flattenedResults.length) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setSelectedIndex((current) =>
          current === flattenedResults.length - 1 ? 0 : current + 1
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setSelectedIndex((current) =>
          current === 0 ? flattenedResults.length - 1 : current - 1
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const selected = flattenedResults[selectedIndex];

        if (selected) {
          window.location.href = selected.href;
          closeSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flattenedResults, selectedIndex]);

  const isSelected = (href: string) => {
    return flattenedResults[selectedIndex]?.href === href;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-72 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search anything...</span>

        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px]">
          ⌘ K
        </kbd>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeSearch}
          />

          <div className="relative mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-2xl rounded-2xl border bg-background shadow-2xl">
            <div className="flex items-center gap-3 border-b px-4">
              <Search className="h-4 w-4 text-muted-foreground" />

              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, comments, pages..."
                className="h-14 flex-1 bg-transparent text-sm outline-none"
              />

              <button
                type="button"
                onClick={closeSearch}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Start typing to search across your workspace.
                </div>
              ) : !hasResults ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                <>
                  {results?.projects.length ? (
                    <div className="mb-3">
                      <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Projects
                      </p>

                      {results.projects.map((project) => {
                        const href = `/projects/${project.slug}`;

                        return (
                          <Link
                            key={project.id}
                            href={href}
                            onClick={closeSearch}
                            className={`block rounded-lg px-3 py-2 text-sm ${
                              isSelected(href) ? "bg-muted" : "hover:bg-muted"
                            }`}
                          >
                            {project.name}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}

                  {results?.comments.length ? (
                    <div className="mb-3">
                      <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Comments
                      </p>

                      {results.comments.map((comment) => {
                        const href = `/projects/${comment.project.slug}/comments/${comment.id}`;

                        return (
                          <Link
                            key={comment.id}
                            href={href}
                            onClick={closeSearch}
                            className={`block rounded-lg px-3 py-2 text-sm ${
                              isSelected(href) ? "bg-muted" : "hover:bg-muted"
                            }`}
                          >
                            <span className="font-medium">
                              #{comment.number}
                            </span>{" "}
                            {comment.message}

                            <p className="mt-1 text-xs text-muted-foreground">
                              {comment.project.name}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}

                  {results?.pages.length ? (
                    <div>
                      <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Pages
                      </p>

                      {results.pages.map((page) => {
                        const href = `/projects/${page.project.slug}/pages`;

                        return (
                          <Link
                            key={page.id}
                            href={href}
                            onClick={closeSearch}
                            className={`block rounded-lg px-3 py-2 text-sm ${
                              isSelected(href) ? "bg-muted" : "hover:bg-muted"
                            }`}
                          >
                            {page.title ?? page.path}

                            <p className="mt-1 text-xs text-muted-foreground">
                              {page.project.name}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {hasResults ? (
              <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                <span>Use ↑ ↓ to navigate</span>
                <span>Press Enter to open</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GlobalSearch;
