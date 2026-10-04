export const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024;
export const MAX_EVIDENCE_FILES = 10;

export const ACCEPTED_EVIDENCE_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.docx';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}