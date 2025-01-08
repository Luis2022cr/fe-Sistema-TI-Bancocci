import React from 'react';

interface PaginationProps {
    PaginaInicial: number;
    TotalPaginas: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ PaginaInicial, TotalPaginas, onPageChange }) => {
    const handlePrevious = () => {
        if (PaginaInicial > 1) {
            onPageChange(PaginaInicial - 1);
        }
    };

    const handleNext = () => {
        if (PaginaInicial < TotalPaginas) {
            onPageChange(PaginaInicial + 1);
        }
    };

    const handlePageClick = (page: number) => {
        if (page !== PaginaInicial) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, PaginaInicial - 2);
        const endPage = Math.min(TotalPaginas, PaginaInicial + 2);

        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageClick(1)}
                    className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 text-sm sm:text-base ${PaginaInicial === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="px-2 py-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 text-sm sm:text-base ${PaginaInicial === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < TotalPaginas) {
            if (endPage < TotalPaginas - 1) {
                pages.push(<span key="end-ellipsis" className="px-2 py-1">...</span>);
            }
            pages.push(
                <button
                    key={TotalPaginas}
                    onClick={() => handlePageClick(TotalPaginas)}
                    className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 text-sm sm:text-base ${PaginaInicial === TotalPaginas ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                    {TotalPaginas}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-wrap justify-center mt-4 space-x-1 sm:space-x-2">
            <button
                onClick={handlePrevious}
                className={`bg-green-800 rounded-full text-white px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${PaginaInicial === 1 ? 'cursor-not-allowed text-white' : 'hover:bg-green-600'}`}
                disabled={PaginaInicial === 1}
            >
                Anterior
            </button>
            {renderPageNumbers()}
            <button
                onClick={handleNext}
                className={`bg-green-800 rounded-full text-white px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${PaginaInicial === TotalPaginas ? 'cursor-not-allowed text-white' : 'hover:bg-green-600'}`}
                disabled={PaginaInicial === TotalPaginas}
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;
