"use client";

type VideoFieldNoteProps = {
  label: string;
  help: string;
  children: React.ReactNode;
};

export default function VideoFieldNote({
  label,
  help,
  children,
}: VideoFieldNoteProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-100">{label}</span>
      {children}
      <span className="mt-2 block text-xs leading-5 text-slate-500">{help}</span>
    </label>
  );
}
