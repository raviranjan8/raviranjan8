import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";

import { Link } from "react-router-dom";
import DataGrid, {TextEditor, SelectCellFormatter} from 'react-data-grid';
import DeliveryService from "../services/delivery.service";
import SellerProductService from "../services/seller.product.service";
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
    case 'brand':
    case 'company':
    case 'measurment':
    case 'discountType':
           
    return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
  }
}

const SellerProductList = props => {  

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
    { key: 'description', name: 'Description' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'imagepath', name: 'Imagepath' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'brand', name: 'Brand' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'company', name: 'Company' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'mrp', name: 'Mrp' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'weight', name: 'Weight' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'unit', name: 'Unit' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'measurment', name: 'Measurment' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'quantity', name: 'Quantity' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'rate', name: 'Rate' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'discount', name: 'Discount' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'discountType', name: 'DiscountType' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'deliveryCharge', name: 'DeliveryCharge' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true,
   },

  ];

    useEffect(() => {
      var initialRows = null;
      const paramSellerProduct= { _sort: "routeId", _order: "asc"};
     SellerProductService.getAll(paramSellerProduct).then((response) => {
        var sellerproducts = response.data;
        initialRows = new Array(sellerproducts.length);
        sellerproducts && sellerproducts.map((sellerproducts, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=sellerproducts.id;
          initialRows[index]["name"]=sellerproducts.name;
          initialRows[index]["description"]=sellerproducts.description;
          initialRows[index]["imagepath"]=sellerproducts.imagepath;
          initialRows[index]["brand"]=sellerproducts.brand;
          initialRows[index]["company"]=sellerproducts.company;
          initialRows[index]["mrp"]=sellerproducts.mrp;
          initialRows[index]["weight"]=sellerproducts.weight;
          initialRows[index]["unit"]=sellerproducts.unit;
          initialRows[index]["measurment"]=sellerproducts.measurment;
          initialRows[index]["quantity"]=sellerproducts.quantity;
          initialRows[index]["rate"]=sellerproducts.rate;
          initialRows[index]["discount"]=sellerproducts.discount;
          initialRows[index]["discountType"]=sellerproducts.discountType;
          initialRows[index]["deliveryCharge"]=sellerproducts.deliveryCharge;
          
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
        description: row.description,
        imagepath: row.imagepath,
        brand: row.brand,
        company: row.company,
        mrp: row.mrp,
        weight: row.weight,
        unit: row.unit,
        measurment: row.measurment,
        quantity: row.quantity,
        rate: row.rate,
        discount: row.discount,
        discountType: row.discountType,
        deliveryCharge: row.deliveryCharge,
        
      };
      console.log(data);
      
           SellerProductService.update(row.id, data)
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
                <Link to={"/gui/sellerProduct"} className="nav-link">
                  Add Seller Product
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
  
  export default SellerProductList;

  
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