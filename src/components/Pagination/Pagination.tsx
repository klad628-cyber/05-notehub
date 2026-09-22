import ReactPaginate from "react-paginate";

import styles from "./Pagination.module.css";

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={Math.max(currentPage - 1, 0)}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      renderOnZeroPageCount={null}
      containerClassName={styles.pagination}
      pageClassName={styles.pageItem}
      pageLinkClassName={styles.pageLink}
      previousClassName={styles.pageItem}
      previousLinkClassName={styles.pageLink}
      nextClassName={styles.pageItem}
      nextLinkClassName={styles.pageLink}
      breakClassName={styles.pageItem}
      breakLinkClassName={styles.pageLink}
      activeClassName={styles.activePage}
      disabledClassName={styles.disabledPage}
    />
  );
};

export default Pagination;
