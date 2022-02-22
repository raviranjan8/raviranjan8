import React, { useState , useEffect } from "react";
import RouteService from "../../services/route.service";
import DataGrid, {TextEditor, EditorProps, Row} from 'react-data-grid';
import RoutesList from "../routes-list.component";
import { useRoutes } from "../hooks/route.hook";

export default function DropDownEditor({ row, onRowChange }) {
  const { selectData } = useRoutes(); 
    
  return (
    <select
      className={TextEditor.textEditorClassname}
      value={row.routeId}
      onChange={(event) => onRowChange({ ...row, routeId: event.target.value }, true)}
      autoFocus
    >
      {selectData && selectData.map((selectDataRecord) => (
        <option key={selectDataRecord.id} value={selectDataRecord.id}>
          {selectDataRecord.name}
        </option>
      ))}
    </select>
  );
}