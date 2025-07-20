import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
