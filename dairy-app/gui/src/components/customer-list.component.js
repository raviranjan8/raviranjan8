import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import RouteService from "../services/route.service";
import { Link } from "react-router-dom";
import DataGrid, {textEditor, SelectCellFormatter} from 'react-data-grid';
import DeliveryService from "../services/delivery.service";
import CustomerService from "../services/customer.service";
import DropDownEditor, {useRoute} from "../components/editor/dropdown.component";
import NumericEditor from "../components/editor/numericeditor.component";
import moment from 'moment';

const rootClassname = 'rootClassname';
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
	case 'address':
	case 'startDate':
	case 'endDate':
	case 'type':
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
  }
}

const CustomerList = props => {  

  const [rows, setRows] = useState([]);
	const [sortColumns, setSortColumns] = useState([]);  
  const [filters, setFilters] = useState({
    name: '',
    enabled: true
  });

  const columns = [
    { key: 'id', name: 'ID' , width: 40 , resizable: true,frozen: true,
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
    { key: 'name', name: 'Name' , editor: textEditor, editorOptions: {editOnClick: true} , resizable: true ,frozen: true,},
    { key: 'address', name: 'Address' , editor: textEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'mobNo', name: 'MobNo' , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'startDate', name: 'StartDate' , editor: textEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'endDate', name: 'EndDate' , editor: textEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'defaultQuantity', name: 'Quantity' , width: 40  , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'rate', name: 'Rate' , width: 40  , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'active', name: 'Active' , width: 40 ,
            formatter({ row, onRowChange, isCellSelected }) {
              return (
                <SelectCellFormatter
                  value={row.active}
                  onChange={() => {
                    onRowChange({ ...row, active: !row.active });
                  }}
                  onClick={stopPropagation}
                  isCellSelected={isCellSelected}
                />
              );
            } },
    { key: 'routeId', name: 'Route' , resizable: true ,
              formatter(props) {
                return <>{props.row.routeName}</>;
              },
              editor: DropDownEditor,
              editorOptions: {
                editOnClick: true
              }},
    { key: 'routeSeq', name: 'Seq' , width: 40 , editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
    { key: 'type', name: 'Type' , width: 80 , editor: textEditor, editorOptions: {editOnClick: true} , resizable: true }
  ];

    useEffect(() => {
      var initialRows = null;
      const paramCustomer = { _sort: "routeId", _order: "asc"};
      console.log(paramCustomer);
      CustomerService.getAll(paramCustomer).then((response) => {
        var customers = response.data;
        initialRows = new Array(customers.length);
        customers.map((customer, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=customer.id;
          initialRows[index]["name"]=customer.name;
          initialRows[index]["address"]=customer.address;
          initialRows[index]["mobNo"]=customer.mobNo;
          initialRows[index]["startDate"]=customer.startDate;
          initialRows[index]["endDate"]=customer.endDate;
          initialRows[index]["defaultQuantity"]=customer.defaultQuantity;
          initialRows[index]["rate"]=customer.rate;
          initialRows[index]["active"]=customer.active;
          initialRows[index]["routeId"]=customer.routeId;
          initialRows[index]["routeSeq"]=customer.routeSeq;
		      initialRows[index]["type"]=customer.type;
          if(customer.route){
            initialRows[index]["routeName"]=customer.route.name;
          }
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
        address: row.address,
        mobNo: row.mobNo,
        startDate: row.startDate,
        endDate: row.endDate,
        active: row.active,
        routeId: row.routeId,
        defaultQuantity: row.defaultQuantity,
        rate: row.rate,
        routeSeq: row.routeSeq,
		    type: row.type
      };
      console.log(data);
      
           CustomerService.update(row.id, data)
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
                <Link to={"/gui/addCustomer"} className="badge bg-secondary">
                  Add Customer
                </Link>
        <div className={rootClassname}>
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
  
  export default CustomerList;

  
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