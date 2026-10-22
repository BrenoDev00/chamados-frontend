"use client";

import type { MouseEvent } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageItems, getTotalPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel: { singular: string; plural: string };
};

export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  itemLabel,
}: TablePaginationProps) {
  const totalPages = getTotalPages(totalItems, pageSize);
  const firstItem = page * pageSize + 1;
  const lastItem = Math.min((page + 1) * pageSize, totalItems);
  const label = totalItems === 1 ? itemLabel.singular : itemLabel.plural;
  const isFirstPage = page === 0;
  const isLastPage = page >= totalPages - 1;

  function goTo(event: MouseEvent<HTMLAnchorElement>, targetPage: number) {
    event.preventDefault();
    if (targetPage < 0 || targetPage >= totalPages || targetPage === page) return;
    onPageChange(targetPage);
    // a nova página deve ser lida do início, não a partir do rodapé onde está a paginação
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>
        {totalItems === 0
          ? `Mostrando 0 ${label}`
          : `Mostrando ${firstItem} a ${lastItem} de ${totalItems} ${label}`}
      </span>

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={isFirstPage}
                className={cn(isFirstPage && "pointer-events-none opacity-50")}
                onClick={(event) => goTo(event, page - 1)}
              />
            </PaginationItem>

            {getPageItems(page, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    aria-label={`Ir para a página ${item + 1}`}
                    onClick={(event) => goTo(event, item)}
                  >
                    {item + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={isLastPage}
                className={cn(isLastPage && "pointer-events-none opacity-50")}
                onClick={(event) => goTo(event, page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
