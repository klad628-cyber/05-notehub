import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";

import { NOTE_TAGS, type NoteFormValues } from "../../types/note";
import styles from "./NoteForm.module.css";

export interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(NOTE_TAGS, "Tag is not valid")
    .required("Tag is required"),
});

const NoteForm = ({ onSubmit, onCancel }: NoteFormProps) => {
  const handleSubmit = async (
    values: NoteFormValues,
    { resetForm }: FormikHelpers<NoteFormValues>,
  ) => {
    await onSubmit(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={styles.input} />
            <span className={styles.error}>
              <ErrorMessage name="title" />
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={styles.textarea}
            />
            <span className={styles.error}>
              <ErrorMessage name="content" />
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              {NOTE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <span className={styles.error}>
              <ErrorMessage name="tag" />
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
