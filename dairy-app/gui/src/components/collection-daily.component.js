import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import DataGrid,  {HeaderRendererProps} from 'react-data-grid';
import { Link } from "react-router-dom";
import NumericEditor from "./editor/numericeditor.component";
import DeliveryService from "../services/delivery.service";
import CustomerService from "../services/customer.service";
import BillService from "../services/bill.service";
import PaymentService from "../services/payment.service";
import moment from 'moment';
import Grid from '@mui/material/Grid';

import { CSVLink } from 'react-csv';
import Button from '@mui/material/Button';
import { collapseClasses } from "@mui/material";

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

const CollectionDaily = props => {

  const [filters, setFilters] = useState({
    name: '',
    enabled: true
  });

  const initialCalendar = {
    currentDate: moment()
  };
  
    const [rows, setRows] = useState([]);  
	  const [message, setMessage] = useState();
	  const [rate, setRate] = useState({});
	  const [open, setOpen] = useState(false);
	  const [confirm, setConfirm] = useState(false);
    const [calendar, setCalendar] = useState(initialCalendar);
    const [sortColumns, setSortColumns] = useState([]);  
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
 
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
      { key: 'today', name: 'Quantity' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:80, resizable: true },
      { key: 'fat', name: 'Fat' , minWidth:20 , resizable: true , editor: NumericEditor, editorOptions: {editOnClick: true} },
      { key: 'snf', name: 'Snf' , minWidth:20 , resizable: true, editor: NumericEditor, editorOptions: {editOnClick: true} },
      { key: 'water', name: 'Water' , minWidth:40 , resizable: true, editor: NumericEditor, editorOptions: {editOnClick: true} },
      { key: 'rate', name: 'Rate' , minWidth:40 , resizable: true ,editor: NumericEditor, editorOptions: {editOnClick: true}},
      { key: 'amount', name: 'Amount' , minWidth:40 , resizable: true },
      { key: 'route', name: 'Route' , minWidth:40, resizable: true },
      { key: 'bill', name: 'Bill' , minWidth:40 , resizable: true },
      { key: 'qty', name: 'Bill Qty' , minWidth:70 , resizable: true },
      { key: 'paid', name: 'Paid' , minWidth:60 , resizable: true }
    ];
    
    
    useEffect(() => {
      var calendar={currentDate:moment(props.match.params.date,'DD-MMM-YYYY')};
      setCalendar(calendar);
      var initialRows = null;
      const paramCustomer = { active: true, type: "farmer"};

      CustomerService.getAll(paramCustomer).then((response) => {
        var customers = response.data;
        initialRows = new Array(customers.length);
        customers.map((customer, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=customer.id;
          initialRows[index]["name"]=customer.name;
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
                      "month" : calendar.currentDate.format("MMM-YYYY"), type: "expense"};
      DeliveryService.getAll(params).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              initialRow["today"] = delivery.quantity;
              initialRow["idtoday"]=delivery.id;
              initialRow["fat"]=delivery.fat;
              initialRow["snf"]=delivery.snf;
              initialRow["water"]=delivery.water;
              initialRow["rate"]=delivery.rate;
              initialRow["amount"]=delivery.amount;
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
      const paramsBill ={ from: calendar.currentDate.format("YYYY-MM-DD"), month : calendar.currentDate.format("MMM-YYYY"), active: true, type: "expense"};
      BillService.getAll(paramsBill).then((response) => {
        var deliverys = response.data;        
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              if(delivery.bill){
                initialRow["qty"] = delivery.quantity;                
                initialRow["bill"]=delivery.bill;                
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
	  const paramsBillPrev ={ month :  calendar.currentDate.clone().subtract(1, 'months').format('MMM-YYYY'), active: true, type: "expense"};
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
      var params ={ "month": calendar.currentDate.format("MMM-YYYY"), "active": true, type: "expense"};
      PaymentService.getAll(params).then(response => {
        var bills = response.data;
        initialRows && initialRows.map((initialRow) => {
          bills && bills.map((bill) => {
              if(bill.partyId == initialRow.id){
                if(initialRow["paid"]){
                  initialRow["paid"]=initialRow["paid"]+bill.payment;
                }else{
                  initialRow["paid"]=+bill.payment
                }
              }
            });
        });
      })
      .catch(e => {
        console.log(e);
      });
    }
   

    function handleClickOpen () {
      setOpen(true);
    }
  
    function handleClose () {
      setConfirm(false);
      setOpen(false);
    };
	
      function handleConfirm () {
        setConfirm(false);
        generateBillsCollectionAfterCheck(calendar.currentDate.format("MMM-YYYY"));
        setOpen(false);
      }

    function rowChange(row, col) {
      constructDeliveryUpdateData(row,col);
      setRows (row);
    }

    function constructDeliveryUpdateData(row, col){
      var rowData = row[col.indexes];
      var columnVal = rowData[col.column.key]; 
      var columnId = rowData["idtoday"];
      console.log(rowData.id+ " - "+columnVal + " - " +columnId+" - " + col.column.key);
      saveDelivery(rowData.id, calendar.currentDate, calendar.currentDate , rowData.today, 
        columnId, rowData, rowData.fat, rowData.snf, rowData.water, rowData.rate);
    }

    function saveDelivery (cutomerId, date, month, quantity, id, rowData, fat, snf, water, rate) {
      var amount = 0;
      var tempRate = 0;
      var tempQantity = 0;
      if(rate){
        if(rate<30){
          tempRate = 30;
        }else {
          tempRate = rate;
        }
      }
      if(quantity){
        tempQantity = quantity;
      }

      amount = rate * tempQantity;

      var data = {
        id: id,
        partyId: cutomerId,
        date: date.format("DD"),
        deliveryDate: date.format("DD-MMM-YYYY"),
        month: month.format("MMM-YYYY"),
        fat: fat,
        snf: snf,
        water: water,
        quantity: quantity,
        rate: rate,
		    type: "expense",   
        amount: amount,
        category: "collection"      
      };
      console.log(data);
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

      function generateBillCollection(){
        const paramsFrom ={ "type": "expense","from":from, "to":to };
        BillService.validateCollectionBillsGeneration("expense",paramsFrom).then((response) => {
          console.log(response.data);
          var bill = response.data;
          //bill object has bill, means the bill was generated
          if(bill.rate){
            setConfirm(true);
            setMessage("Bill already generated for the period. Do you want to continue? Please confirm to proceed.");
            handleClickOpen();
          }else{
            generateBillsCollectionAfterCheck();
          }
        })
        .catch((e) => {
          console.log(e);
          //no bill exist for the month, so generate bill without prompting user
          if(e.response.status == 404){
            generateBillsCollectionAfterCheck();
          }
        });
        }
      
      function generateBillsCollectionAfterCheck(){
        const paramsBill ={  "type": "expense","from":from, "to":to , "category":"collection"};
        BillService.generateBillsCollection(paramsBill).then((response) => {
            var deliverys = response.data;
            deliverys && deliverys.map((delivery) => {
              for(var initialRow of rows){
                if(initialRow.id == delivery.partyId){
                  initialRow["qty"] = delivery.quantity;
                  initialRow["rate"]=delivery.rate;
                  initialRow["bill"]=delivery.bill;
                  break;
                }
              };
            });
        setMessage("Bill generated for the period .");
        handleClickOpen();
        console.log(rows);
        setRows(rows);
          })
          .catch((e) => {
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
        {calendar ? (
        <div >
         
            <Grid container spacing={{ xs: 1}} >
          <Grid item xs={6} sm={3}> 
            <Link
                to={"/gui/collectionDaily/"+calendar.currentDate.clone().subtract(1, 'days').format('DD-MMM-YYYY')}
                className="badge badge-warning">
                Prev
              </Link>
              {calendar.currentDate.format("DD-MMM-YYYY")}
              <Link
                to={"/gui/collectionDaily/"+calendar.currentDate.clone().add(1, 'days').format('DD-MMM-YYYY')}
                className="badge badge-warning">
                Next
              </Link>
            </Grid>
           
            <Grid item xs={3} sm={1}>
                &nbsp;
                <Button variant="warning" className="badge">
                      <CSVLink 
                      data={filteredRows} filename={'dailyCollectionExpense.txt'}>Export
                      </CSVLink>
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
export default CollectionDaily;


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