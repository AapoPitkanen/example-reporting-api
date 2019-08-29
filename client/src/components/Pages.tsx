import React from "react";

interface PageProps {
    currentPage: number;
    pageNumbers: number[];
    handlePagination: Function;
}

const Pages: React.FC<PageProps> = ({
    currentPage,
    pageNumbers,
    handlePagination,
}) => {
    return (
        <div className="page-list-container">
            <ul className="pagination">
                {pageNumbers.map((pageNumber: number) => (
                    <li
                        className={`page-link page-list-item${
                            pageNumber === currentPage ? " selected" : ""
                        }`}
                        key={pageNumber}
                        onClick={() => handlePagination(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pages;
