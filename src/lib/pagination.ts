export type PaginatedList<T> = {
  total: number;
  items: T[];
};

export function getTotalPages(totalItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export type PageItem = number | "ellipsis";

// primeira e última páginas sempre visíveis, vizinhas da atual e reticências nos intervalos
export function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  const pages = new Set([0, totalPages - 1, currentPage - 1, currentPage, currentPage + 1]);
  const visiblePages = [...pages]
    .filter((page) => page >= 0 && page < totalPages)
    .sort((a, b) => a - b);

  return visiblePages.flatMap((page, index) => {
    const previousPage = visiblePages[index - 1];

    if (previousPage === undefined || page - previousPage === 1) return [page];
    // um único número oculto é exibido no lugar das reticências
    if (page - previousPage === 2) return [page - 1, page];
    return ["ellipsis" as const, page];
  });
}
