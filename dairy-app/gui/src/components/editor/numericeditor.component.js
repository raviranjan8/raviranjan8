import React from "react";
import type { EditorProps } from 'react-data-grid';

export const TextEditorClassname = `rdg-text-editor TextEditor`;

function autoFocusAndSelect(input: HTMLInputElement | null) {
  if(input)input.select();
  if(input)input.focus();
}

export default function NumericEditor({
  row,
  column,
  onRowChange,
  onClose
}: EditorProps) {
  return (
    <input
		type="number"
		inputmode="numeric" 
      className={TextEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.key]}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true)}
    />
  );
}
