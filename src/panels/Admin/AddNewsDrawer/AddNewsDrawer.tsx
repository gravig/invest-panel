import type { NewsLabel } from "@src/server/model/news.model";
import { useNewsService } from "@src/services/news/NewsServiceProvider";
import type { useNews } from "@src/services/news/useNews/useNews";
import clsx from "clsx";
import React from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  url: "",
  imageUrl: "",
};

export const AddNewsDrawer = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [labels, setLabels] = React.useState<NewsLabel[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { create } = useNewsService<typeof useNews>({ lazy: true });

  const reset = () => {
    setForm(EMPTY_FORM);
    setLabels([]);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    create({
      title: form.title,
      description: form.description,
      date: form.date,
      url: form.url,
      imageUrl: form.imageUrl,
      labels,
    });
  };

  const addLabel = () => setLabels((prev) => [...prev, { key: "", value: "" }]);

  const updateLabel = (idx: number, field: "key" | "value", val: string) =>
    setLabels((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: val } : l)),
    );

  const removeLabel = (idx: number) =>
    setLabels((prev) => prev.filter((_, i) => i !== idx));

  const field = (
    id: keyof typeof EMPTY_FORM,
    label: string,
    required = false,
    type = "text",
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        required={required}
        onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
        className="border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-10" onClick={handleClose} />
      )}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-[28rem] bg-white shadow-2xl z-20 flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-base">Add News</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 cursor-pointer text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-5 py-4 overflow-auto flex-1"
        >
          {field("title", "Title", true)}
          {field("url", "URL", true)}
          {field("description", "Description")}
          {field("date", "Date")}
          {field("imageUrl", "Image URL")}

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Labels</span>
              <button
                type="button"
                onClick={addLabel}
                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                + Add label
              </button>
            </div>
            {labels.map((label, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  placeholder="key"
                  value={label.key}
                  onChange={(e) => updateLabel(idx, "key", e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <input
                  placeholder="value"
                  value={label.value}
                  onChange={(e) => updateLabel(idx, "value", e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeLabel(idx)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-auto pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border rounded px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving…" : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
