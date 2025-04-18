import { useMemo } from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Calculate pagination range
  const pageNumbers = useMemo(() => {
    const numbers = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(currentPage - halfRange, 1)
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i)
    }

    return numbers
  }, [currentPage, totalPages])

  return (
    <div className="flex justify-center items-center space-x-2 mt-10">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage === 1
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
        }`}
      >
        ← Prev
      </button>

      {/* First Page */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === 1
                ? 'bg-[#5ccfee] text-black font-medium'
                : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
            }`}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === pageNumber
              ? 'bg-[#5ccfee] text-black font-medium'
              : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Last Page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? 'bg-[#5ccfee] text-black font-medium'
                : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage === totalPages
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
        }`}
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination
