/**
 * Recursively appends a plain object to a FormData instance using
 * Laravel-compatible bracket notation for arrays and nested objects.
 */
export function appendToFormData(formData: FormData, data: unknown, parentKey?: string): void {
  if (data === undefined || data === null) {
    return;
  }

  if (data instanceof File) {
    formData.append(parentKey!, data);
    return;
  }

  if (typeof data === "boolean") {
    formData.append(parentKey!, data ? "1" : "0");
    return;
  }

  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      appendToFormData(formData, value, `${parentKey}[${index}]`);
    });
    return;
  }

  if (typeof data === "object") {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      appendToFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
    });
    return;
  }

  formData.append(parentKey!, String(data));
}

export function toFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();
  appendToFormData(formData, data);
  return formData;
}
