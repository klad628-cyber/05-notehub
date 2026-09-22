import axios from "axios";

import type { CreateNotePayload, Note, NoteTag } from "../types/note";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN ?? "";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Accept: "application/json",
    ...(NOTEHUB_TOKEN
      ? {
          Authorization: `Bearer ${NOTEHUB_TOKEN}`,
        }
      : {}),
  },
});

const normalizeTag = (value: unknown): NoteTag => {
  const allowedTags: NoteTag[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];
  return allowedTags.includes(value as NoteTag) ? (value as NoteTag) : "Todo";
};

const normalizeNote = (value: unknown): Note => {
  const note = (value ?? {}) as Record<string, unknown>;
  const now = new Date().toISOString();

  return {
    id: String(note.id ?? note._id ?? crypto.randomUUID()),
    title: String(note.title ?? "Untitled"),
    content: String(note.content ?? ""),
    tag: normalizeTag(note.tag),
    createdAt: typeof note.createdAt === "string" ? note.createdAt : now,
    updatedAt: typeof note.updatedAt === "string" ? note.updatedAt : now,
  };
};

const unwrapNotesList = (payload: unknown): Note[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeNote(item));
  }

  if (payload && typeof payload === "object") {
    const records = payload as Record<string, unknown>;

    const candidates = [
      records.notes,
      records.data,
      records.items,
      records.result,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.map((item) => normalizeNote(item));
      }
    }
  }

  return [];
};

const unwrapTotalPages = (payload: unknown): number => {
  if (!payload || typeof payload !== "object") {
    return 1;
  }

  const records = payload as Record<string, unknown>;
  const pagination = (records.pagination ?? {}) as Record<string, unknown>;
  const meta = (records.meta ?? {}) as Record<string, unknown>;

  const value =
    records.totalPages ??
    records.total_pages ??
    records.pages ??
    records.pageCount ??
    pagination.totalPages ??
    meta.totalPages;

  const parsed = Number(value ?? 1);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const unwrapTotalItems = (payload: unknown): number => {
  if (!payload || typeof payload !== "object") {
    return 0;
  }

  const records = payload as Record<string, unknown>;
  const pagination = (records.pagination ?? {}) as Record<string, unknown>;
  const meta = (records.meta ?? {}) as Record<string, unknown>;

  const value =
    records.totalItems ??
    records.total ??
    records.totalCount ??
    records.count ??
    meta.totalCount ??
    pagination.totalItems;

  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const response = await api.get<unknown>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  const payload = response.data;
  const notes = unwrapNotesList(payload);

  return {
    notes,
    page,
    perPage,
    totalPages: unwrapTotalPages(payload),
    totalItems: unwrapTotalItems(payload),
  };
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<unknown>("/notes", payload);
  const record =
    response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : {};

  return normalizeNote(record.note ?? record.data ?? response.data);
};

export const deleteNote = async (id: string | number): Promise<Note> => {
  const response = await api.delete<unknown>(`/notes/${id}`);
  const record =
    response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : {};

  return normalizeNote(record.note ?? record.data ?? response.data);
};
