import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import DataGrid,  {HeaderRendererProps} from 'react-data-grid';

import NumericEditor from "../components/editor/numericeditor.component";
import DeliveryService from "../services/delivery.service";
import CustomerService from "../services/customer.service";
import BillService from "../services/bill.service";
import PaymentService from "../services/payment.service";
import moment from 'moment';
import Grid from '@mui/material/Grid';

import { CSVLink } from 'react-csv';
import Button from '@mui/material/Button';

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

function getComparator(sortColumn) {
  switch (sortColumn) {
    case 'name':
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
  }
}

const CustomerDaily = props => {

  const [filters, setFilters] = useState({
    name: '',
    enabled: true
  });

  const initialCalendar = {
    currentDate: moment()
  };
  
    const [rows, setRows] = useState([]);  
    const [calendar, setCalendar] = useState(initialCalendar);
    const [sortColumns, setSortColumns] = useState([]);  


    const columns = [
      { key: 'id', name: 'ID' , minWidth: 40 , resizable: true ,
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
      { key: 'name', name: 'Name' , width: 200, resizable: true},
      { key: 'today', name: 'Today Quantity' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:80, resizable: true },
      { key: 'dailyQuantity', name: 'Daily Quantity' , minWidth:80 , resizable: true },
      { key: 'route', name: 'Route' , minWidth:100 , resizable: true },
      { key: 'qty', name: 'Qty' , minWidth:40 , resizable: true },
      { key: 'rate', name: 'Rate' , minWidth:40 , resizable: true },
      { key: 'bill', name: 'Bill' , minWidth:40 , resizable: true },
      { key: 'dues', name: 'Dues' , minWidth:40 , resizable: true },
      { key: 'totalBill', name: 'Total' , minWidth:60 , resizable: true },
      { key: 'prevBill', name: 'P-Bill' , minWidth:75 , resizable: true },
      { key: 'prevDues', name: 'P-Dues' , minWidth:70 , resizable: true },
      { key: 'paid', name: 'Paid' , minWidth:60 , resizable: true }
    ];
    
    
    useEffect(() => {
      var calendar={currentDate: moment(props.match.params.date,'DD-MMM-YYYY')};
      setCalendar(calendar);
      var initialRows = null;
      const paramCustomer = { active: true, type: "customer"};

      CustomerService.getAll(paramCustomer).then((response) => {
        var customers = response.data;
        initialRows = new Array(customers.length);
        customers.map((customer, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=customer.id;
          initialRows[index]["name"]=customer.name;
          initialRows[index]["dailyQuantity"]=customer.defaultQuantity;
          initialRows[index]["route"]=customer.route.name;
        });
        getPayment(calendar, initialRows);
        deliveryService(calendar, initialRows);
        billService(calendar, initialRows);
      })
      .catch((e) => {
        console.log(e);
      });
	  
    }, [props.match.params.date]);

    function deliveryService(calendar, initialRows){
      const params ={ "date": calendar.currentDate.format("DD"), 
                      "month" : calendar.currentDate.format("MMM-YYYY"), type: "income"};
      DeliveryService.getAll(params).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              initialRow["today"] = delivery.quantity;
              initialRow["idtoday"]=delivery.id;
              break;
            }
          };
        });
        console.log(initialRows);
        setRows(initialRows);
      })
      .catch((e) => {
        console.log(e);
      });
    }

    function billService(calendar, initialRows){
      const paramsBill ={ month : calendar.currentDate.format("MMM-YYYY"), active: true, type: "income"};
      BillService.getAll(paramsBill).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              if(delivery.rate){
                initialRow["qty"] = delivery.quantity;
                initialRow["rate"]=delivery.rate;
                initialRow["bill"]=delivery.bill;
                initialRow["dues"]=delivery.dues;
                initialRow["totalBill"]=initialRow["bill"]+(initialRow["dues"]? initialRow["dues"] : 0);
              }
              break;
            }
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
	  
      //previous month bill and due amount
	  const paramsBillPrev ={ month :  calendar.currentDate.clone().subtract(1, 'months').format('MMM-YYYY'), active: true, type: "income"};
	  BillService.getAll(paramsBillPrev).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              if(delivery.rate){
                initialRow["prevBill"]=delivery.bill;
                initialRow["prevDues"]=delivery.dues;
              }
              break;
            }
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
    }

    function getPayment(calendar, initialRows){
      var params ={ "month": calendar.currentDate.format("MMM-YYYY"), "active": true, type: "income"};
      PaymentService.getAll(params).then(response => {
        var bills = response.data;
        initialRows && initialRows.map((initialRow) => {
          bills && bills.map((bill) => {
              if(bill.partyId == initialRow.id){
                if(bill.category == 'discount'){
                  initialRow["discount"]=bill.payment;
                  initialRow["iddiscount"]=bill.id;
                } else{
                  if(initialRow["paid"]){
                    initialRow["paid"]=initialRow["paid"]+bill.payment;
                  }else{
                    initialRow["paid"]=+bill.payment;
                  }
                }
              }
            });
        });
      })
      .catch(e => {
        console.log(e);
      });
    }

    function rowChange(row, col) {
      constructDeliveryUpdateData(row,col);
    }

    function constructDeliveryUpdateData(row, col){
      var columnVal = row[col.indexes][col.column.key]; 
      var columnId = row[col.indexes]["idtoday"];
      console.log(row[col.indexes].id+ " - "+columnVal + " - " +columnId+" - " + col.column.key);
      saveDelivery(row[col.indexes].id, calendar.currentDate, calendar.currentDate , columnVal, columnId, row[col.indexes]);
      rows[col.indexes] = row[col.indexes];
      //row gives filtered rows, so putting updated data into rows
      setRows (rows.slice());
    }

    function saveDelivery (cutomerId, date, month, quantity, id, rowData) {
      var data = {
        id: id,
        partyId: cutomerId,
        date: date.format("DD"),
        month: month.format("MMM-YYYY"),
        quantity: quantity,
		    type: "income"
      };
      if(id){
          DeliveryService.update(id, data)
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
      } else {
        DeliveryService.create(data)
            .then(response => {
              rowData["idtoday"]=response.data.id;
              console.log(rowData);
            })
            .catch(e => {
              console.log(e);
            });
        }
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
        {calendar ? (
        <div >
          <Grid container spacing={{ xs: 1}} >
            <Grid item xs={3} sm={1}>
                &nbsp;
                <Button variant="warning" className="badge">
                      <CSVLink data={filteredRows} filename={'dailyIncome.txt'}>Export</CSVLink>
                </Button>
              </Grid> 
          </Grid>
        </div>     
         ) : (
          <div>
            <br />
            <p>Please click on a Customer...</p>
          </div>
        )}
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
export default CustomerDaily;


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