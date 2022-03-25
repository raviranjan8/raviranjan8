import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import DataGrid,  {HeaderRendererProps} from 'react-data-grid';

import NumericEditor from "./editor/numericeditor.component";
import DeliveryService from "../services/delivery.service";
import CustomerService from "../services/customer.service";
import BillService from "../services/bill.service";
import PaymentService from "../services/payment.service";
import moment from 'moment';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { CSVLink } from 'react-csv';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

const CollectionBillsList = props => {

  const [filters, setFilters] = useState({
    enabled: true
  });

  const initialCalendar = {
    currentDate: moment()
  };
  
    const [rows, setRows] = useState([]);  
    const [calendar, setCalendar] = useState(initialCalendar);
    const [sortColumns, setSortColumns] = useState([]);  
    const [from, setFrom] = useState(); 
    const [to, setTo] = useState();   
    const [confirm, setConfirm] = useState(false);
    const [open, setOpen] = useState(false); 
    const [message, setMessage] = useState();

    const columns = [

      { key: 'print', name: 'PRINT' , width: 70, resizable: true,
      formatter(props) {
        return <>
          <Link disable="true"
          to={ ("/gui/collectionBills/"+moment(props.row.from,'YYYY-MMM-DD').format("YYYY-MM-DD")+"/"+moment(props.row.to,'YYYY-MMM-DD').format("YYYY-MM-DD")+"/"+(props.row.partyId)) }
          className="badge badge-warning">
          Print
          </Link>
        </>;
      }
    },

      { key: 'id', name: 'ID' ,width:50, resizable: true ,
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
      { key: 'name', name: 'Name' ,  resizable: true},
      { key: 'from', name: 'FROM' ,  resizable: true},
      { key: 'to', name: 'TO' ,  resizable: true},
      { key: 'qty', name: 'Quantity' , resizable: true},
      { key: 'bill', name: 'Total' ,   resizable: true },
    ];
    
    
    useEffect(() => {
      getBills();
    }, [props.match.params.date]);



    function getBills(){
      var calendar={currentDate: moment(props.match.params.date,'DD-MMM-YYYY')};
      setCalendar(calendar);
      var initialRows = null;
     const paramsBill={active:true, type:"expense", category: "collection"};
     BillService.getAll(paramsBill).then((response) => {
       var deliverys = response.data;
       console.log(deliverys);
       initialRows=new Array (deliverys.length);
        deliverys && deliverys.map((bill, index)=>{
          initialRows[index]={};
          initialRows[index]["id"]=bill.id;
          initialRows[index]["name"]=bill.customer.name;
            initialRows[index]["qty"]=bill.quantity;
          initialRows[index]["rate"]=bill.rate;
          initialRows[index]["from"]=bill.from;
          initialRows[index]["to"]=bill.to;
          initialRows[index]["bill"]=bill.bill;
          initialRows[index]["partyId"]=bill.partyId;
        });
        billService(calendar, initialRows);
        })
        .catch((e) => {
          console.log(e);
        });    
      
    }

    function onChangeFrom(e){
      setFrom(e.target.value);
    }

    function onChangeTo(e){
      setTo(e.target.value);
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



    function deliveryService(calendar, initialRows){
      const params ={ "date": calendar.currentDate.format("DD"),  type: "expence"};
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
      const paramsBill ={ active: true, type: "expense", category: "collection"};
      BillService.getAll(paramsBill).then((response) => {
        var deliverys = response.data;
        console.log(deliverys);
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              if(delivery.from){
                initialRow["qty"] = delivery.quantity;
                initialRow["rate"]=delivery.rate;
                initialRow["bill"]=delivery.bill;
                initialRow["from"]=delivery.from;
                initialRow["to"]=delivery.to;
              }
              break;
            }
          };
        });
        deliveryService(calendar, initialRows);
      })
      .catch((e) => {
        console.log(e);
      });    
    }

    function rowChange(row, col) {
      constructDeliveryUpdateData(row,col);
    }

     function generateBillCollection(){
        const paramsFrom ={ "type": "expense","from":from, "to":to };
        BillService.validateCollectionBillsGeneration("expense",paramsFrom).then((response) => {
          console.log(response.data);
          var bill = response.data;
          //bill object has bill, means the bill was generated
          if(bill.from){
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
            //call getBills
             getBills();
            setMessage("Bill generated for the period .");
            handleClickOpen();
            console.log(rows);
            setRows(rows);
          })
          .catch((e) => {
            if(e.response.status == 404){
              setMessage("Bill could not be generated for the period as there are overlapping bills.");
              setConfirm(false);
              handleClickOpen();
            }
          });
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
		    type: "expence"
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
          <Grid item xs={3} sm={2}> 
              <Link
                to={(from && to) ? ("/gui/collectionBills/"+from+"/"+to) : ""}
                hidden={(from && to) ? false : true}
                className="badge">
                 Print Collection
              </Link>
          </Grid> 

          <Grid item xs={6} sm={3}> 
              <Link
                onClick={ (from && to) ? (() => generateBillCollection(calendar.currentDate.format("DD-MM-YYYY"))): ""}
                className="badge">
                 Generate Collection Bill
              </Link>    
          </Grid> 
          <Grid item xs={6} sm={3}> 
			<input
                type="date"
                id="from"
                required
                onChange={onChangeFrom}
                name="from"
				        style={{ width:150, height:20 }}
                placeholder="From"
              />
              <input
                type="date"
                id="to"
                required
                onChange={onChangeTo}
                name="to"
				        style={{ width:150, height:20 }}
                placeholder="To"
              />
			  
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

          <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                {"Bills"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {message}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                  {confirm ? (
                    <Button onClick={handleConfirm}>Confirm</Button>
                    ) : ""}
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
      </div>
    );
  };
export default CollectionBillsList;


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