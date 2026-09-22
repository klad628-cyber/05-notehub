import { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import type { NoteFormValues } from "../../types/note";
import styles from "./App.module.css";

const initialPage = 1;
const perPage = 12;

const App = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(initialPage);
    setSearch(value.trim());
  }, 400);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (!search) {
      setPage(initialPage);
    }
  }, [search]);

  const handleCreateNote = async (values: NoteFormValues) => {
    await createMutation.mutateAsync({
      title: values.title.trim(),
      content: values.content.trim(),
      tag: values.tag,
    });
  };

  const handleDeleteNote = async (id: string | number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />

        <button
          type="button"
          className={styles.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isPending ? <p className={styles.status}>Loading notes...</p> : null}

      {isError ? (
        <p className={styles.statusError}>
          {error instanceof Error ? error.message : "Unable to load notes."}
        </p>
      ) : null}

      {!isPending && !isError && notes.length > 0 ? (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      ) : null}

      {!isPending && !isError && notes.length === 0 ? (
        <p className={styles.status}>No notes found.</p>
      ) : null}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;
