import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";

import { Link } from "react-router-dom";
import DataGrid, {TextEditor, SelectCellFormatter} from 'react-data-grid';
import DeliveryService from "../services/delivery.service";
import ProductService from "../services/product.service";
import DropDownEditor, {useRoute} from "./editor/dropdown.component";
import NumericEditor from "./editor/numericeditor.component";
import moment from 'moment';

//const rootClassname = 'rootClassname';
const filterColumnClassName = 'filter-cell';
const filterContainerClassname = 'filterContainerClassname';
const filterClassname = 'filterClassname';

const FilterContext = createContext(undefined);

function inputStopPropagation(event) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

export function stopPropagation(event) {
  event.stopPropagation();
}

function getComparator(sortColumn) {
  switch (sortColumn) {
    case 'name':
	case 'description':

      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
  }
}

const ProductList = props => {  

  const [rows, setRows] = useState([]);
	const [sortColumns, setSortColumns] = useState([]);  
  const [filters, setFilters] = useState({
    name: '',
    enabled: true
  });

  const columns = [
    { key: 'id', name: 'ID' , width: 40 , resizable: true,
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.name}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        )
    },
    { key: 'name', name: 'Name' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'minRate', name: 'minRate' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'maxRate', name: 'maxRate' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'photo', name: 'Photo' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'description', name: 'Description' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true ,
           },
  ];

    useEffect(() => {
      var initialRows = null;
      const paramProduct= { _sort: "routeId",
                        _order: "asc"};
     ProductService.getAll(paramProduct).then((response) => {
        var products = response.data;
        initialRows = new Array(products.length);
        products.map((product, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=product.id;
          initialRows[index]["name"]=product.name;
          initialRows[index]["minRate"]=product.minRate;
          initialRows[index]["maxRate"]=product.maxRate;
          initialRows[index]["photo"]=product.photo;
          initialRows[index]["description"]=product.description;
          
        });
        setRows(initialRows);
      })
      .catch((e) => {
        console.log(e);
      });    
    }, []);

    function rowChange(row, col) {
      constructDeliveryUpdateData(row,col);
      setRows (row);
    }

    function constructDeliveryUpdateData(row, col){
      console.log(row[col.indexes].id+ " - "+row[col.indexes][col.column.key]);
      saveDelivery(row[col.indexes]);
    }

    function saveDelivery (row) {
      var data = {
        id: row.id,
        name: row.name,
        minRate: row.minRate,
        maxRate: row.maxRate,
        photo: row.photo,
        description: row.description,
      };
      console.log(data);
      
           ProductService.update(row.id, data)
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            }); 
    }

	  const filteredRows = useMemo( () => {
      function filter(){
        var filteredRows = null;
         filteredRows = rows.filter((r) => {
          return (
            (filters.name ? r.name.includes(filters.name) : true)
          );
        })
        if (sortColumns.length === 0) return filteredRows;
        filteredRows = [...filteredRows].sort((a, b) => {
          for (const sort of sortColumns) {
            const comparator = getComparator(sort.columnKey);
            const compResult = comparator(a, b);
            if (compResult !== 0) {
              return sort.direction === 'ASC' ? compResult : -compResult;
            }
          }
          return 0;
        })
        return filteredRows;
      }
      return filter();
    }, [rows, filters, sortColumns]);
  
    return (
      <div >
                <Link to={"/gui/addProduct"} className="nav-link">
                  Add Product
                </Link>
        <div className="rootClassname">
          <FilterContext.Provider value={filters}>
            <DataGrid columns={columns} onRowsChange={rowChange} 
             defaultColumnOptions={{
              sortable: true,
              resizable: true
            }}
              className={filters.enabled ? filterContainerClassname : undefined}
              rows={filteredRows}
              sortColumns={sortColumns}
              onSortColumnsChange={setSortColumns}
              headerRowHeight={filters.enabled ? 50 : undefined}
              />
            </FilterContext.Provider>
          </div>
      </div>
    );
  };
  
  export default ProductList;

  
function FilterRenderer({isCellSelected,column,children}) {
  const filters = useContext(FilterContext);
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}

export function useFocusRef(isSelected) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!isSelected) return;
    ref.current && ref.current.focus({ preventScroll: true });
  }, [isSelected]);


  return {
    ref,
    tabIndex: isSelected ? 0 : -1
  };
}