import { useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getTotalPages } from "@/lib/pagination";

export function usePaginatedSearch(pageSize: number) {
  const [searchTerm, setSearchTermState] = useState("");
  const [page, setPage] = useState(0);
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim());

  // uma nova busca sempre começa da primeira página
  function setSearchTerm(value: string) {
    setSearchTermState(value);
    setPage(0);
  }

  // após exclusões a página atual pode deixar de existir: volta para a última válida.
  // chamado durante a renderização, com os dados já confirmados da página atual
  function keepPageInRange(totalItems: number) {
    const lastPage = getTotalPages(totalItems, pageSize) - 1;
    if (page > lastPage) setPage(lastPage);
  }

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    page,
    setPage,
    keepPageInRange,
  };
}
