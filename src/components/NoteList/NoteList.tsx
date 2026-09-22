import type { Note } from "../../types/note";
import styles from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string | number) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>

          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>
            <button
              type="button"
              className={styles.button}
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
