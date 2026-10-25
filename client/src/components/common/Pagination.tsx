interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onChange
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        Préc.
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            className={`pagination-button ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-button"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Suiv.
      </button>
    </div>
  );
};

export default Pagination;
