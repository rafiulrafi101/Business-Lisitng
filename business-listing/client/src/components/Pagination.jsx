const createPageRange = (current, total) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let last;

  for (let i = 1; i <= total; i += 1) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  range.forEach((page) => {
    if (last) {
      if (page - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (page - last > 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(page);
    last = page;
  });

  return rangeWithDots;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = createPageRange(currentPage, totalPages);

  return (
    <nav className="pagination">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="pagination-pages">
        {pages.map((page) =>
          page === '...' ? (
            <span key={`dots-${Math.random()}`} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`pagination-page ${page === currentPage ? 'pagination-page--active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
