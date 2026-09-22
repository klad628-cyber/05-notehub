import type { ChangeEvent } from "react";

import styles from "./SearchBox.module.css";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
      aria-label="Search notes"
    />
  );
};

export default SearchBox;
