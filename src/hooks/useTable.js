import { useState, useMemo } from 'react';

export function useTable({ data = [], pageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);
  const startIndex = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);
  const endIndex = useMemo(() => startIndex + pageSize, [startIndex, pageSize]);
  const currentData = useMemo(() => data.slice(startIndex, endIndex), [data, startIndex, endIndex]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    currentData,
    currentPage,
    totalPages,
    handlePageChange,
    startIndex,
    endIndex
  };
} 