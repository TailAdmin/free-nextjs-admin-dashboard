import React, { ChangeEvent, useMemo } from 'react';

function Pagination({
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    totalPages,
    visiblePages = 5,
    onPageChange
}:{
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>,
  currentPage: number,
  totalPages: number,
  visiblePages: number,
  onPageChange: (page: number) => void;
}): JSX.Element {
  const pageNumbers = useMemo(() => {
    const pages = [];
    const addPage = (page: number) => pages.push(
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`mx-1 px-3 py-1 underline bg-gray-200 ${
          currentPage === page ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {page}
      </button>
    );

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        addPage(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      let end = Math.min(totalPages, start + visiblePages - 1);
      if (end === totalPages) {
        start = Math.max(1, end - visiblePages + 1);
      }
      if (start > 1) {
        addPage(1);
        if (start > 2) pages.push(<span key="start-ellipsis">...</span>);
      }
      for (let i = start; i <= end; i++) {
        addPage(i);
      }
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push(<span key="end-ellipsis">...</span>);
        addPage(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, onPageChange, visiblePages]);


  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="mr-2">Show</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="ml-2">per page</span>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 rounded mr-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <span className="mx-4">
          Previous
        </span>
        
        <span className="mx-4">
          {pageNumbers}
        </span>
        
        <span className="mx-4">
          Next
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 rounded ml-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;