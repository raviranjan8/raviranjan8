import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import DataGrid from 'react-data-grid';
import NumericEditor from "../components/editor/numericeditor.component";
import DeliveryService from "../services/delivery.service";
import CustomerService from "../services/customer.service";
import BillService from "../services/bill.service";
import RateService from "../services/rate.service";
import PaymentService from "../services/payment.service";
import CountdownLatch from "../components/hooks/countdown.latch";
import moment from 'moment';
import Grid from '@mui/material/Grid';

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

const CustomerCalendar = props => {

  const [filters, setFilters] = useState({
    name: '',
    route: '',
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
    
    const columns = [
      { key: 'id', name: 'ID' , minWidth: 60 , resizable: true , frozen: true,
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
      { key: 'name', name: 'Name' , width: 200, resizable: true, frozen: true },
      { key: 'route', name: 'Route' , minWidth:100 , resizable: true ,
          headerCellClass: filterColumnClassName,
          headerRenderer: (p) => (
            <FilterRenderer {...p}>
              {({ filters, ...rest }) => (
                <input
                  {...rest}
                  className={filterClassname}
                  value={filters.route}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      route: e.target.value
                    })
                  }
                  onKeyDown={inputStopPropagation}
                />
              )}
            </FilterRenderer>
          )
      },
      { key: '01', name: '1' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40, resizable: true },
      { key: '02', name: '2' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '03', name: '3' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '04', name: '4' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '05', name: '5' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '06', name: '6' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '07', name: '7' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '08', name: '8' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '09', name: '9' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '10', name: '10' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '11', name: '11' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '12', name: '12' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '13', name: '13' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '14', name: '14' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '15', name: '15' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '16', name: '16' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '17', name: '17' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '18', name: '18' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '19', name: '19' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '20', name: '20' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '21', name: '21' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '22', name: '22' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '23', name: '23' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '24', name: '24' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '25', name: '25' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '26', name: '26' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '27', name: '27' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '28', name: '28' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '29', name: '29' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '30', name: '30' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: '31', name: '31' , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: 'qty', name: 'Qty' , minWidth:40 , resizable: true },
      { key: 'rate', name: 'Rate' , minWidth:40 , resizable: true },
      { key: 'bill', name: 'Bill' , minWidth:60 , resizable: true },
      { key: 'dues', name: 'Dues' , minWidth:40 , resizable: true },
      { key: 'totalBill', name: 'Total' , minWidth:60 , resizable: true },
      { key: 'prevBill', name: 'P-Bill' , minWidth:75 , resizable: true },
      { key: 'paid', name: 'Paid' , minWidth:60 , resizable: true },
      { key: 'currentDue', name: 'C-Due' , minWidth:60 , resizable: true },
      { key: 'discount', name: 'Discount' , width:80 , editor: NumericEditor, editorOptions: {editOnClick: true} , minWidth:40 , resizable: true },
      { key: 'pay', name: 'Pay' , minWidth:60 , resizable: true , editor: NumericEditor, editorOptions: {editOnClick: true} }
    ];

    useEffect(() => {
      var calendar={currentDate: moment(props.match.params.date,'MMM-YYYY')};
      setCalendar(calendar);
      var initialRows = null;
      const paramCustomer = { active: true, type: "customer"}; 

      RateService.getAll(paramCustomer).then((response) => {
        var rates = response.data;
        var rate ={};
        rates && rates.map((r, index) => {
          rate = {
            id: r.id,
            rate: r.rate,
            message: r.message,
            startDate: r.startDate,
          };
          });
        setRate(rate);
        })
          .catch((e) => {
            console.log(e);
      });
      var barrier = new CountdownLatch(3);
      CustomerService.getAll(paramCustomer).then((response) => {
        var customers = response.data;
        initialRows = new Array(customers.length);
        customers.map((customer, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=customer.id;
          initialRows[index]["name"]=customer.name;
          if(customer.route){
            initialRows[index]["route"]=customer.route.name;
          }
        });
        billService(calendar, initialRows,barrier);
        getPayment(calendar, initialRows,barrier);
        deliveryService(calendar, initialRows,barrier);
      })
      .catch((e) => {
        console.log(e);
      });
	  
      barrier.await(function(){
        setRows(initialRows);
        console.log('done all');
      });
    }, [props.match.params.date]);

    function getPayment(calendar, initialRows, barrier){
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
        barrier.countDown();      
      })
      .catch(e => {
        console.log(e);
      });
    }

    function deliveryService(calendar, initialRows,barrier){
      const params ={ "month" : calendar.currentDate.format("MMM-YYYY"), type: "income"};
      DeliveryService.getAll(params).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              initialRow[delivery.date] = delivery.quantity;
              initialRow["id"+delivery.date]=delivery.id;
              break;
            }
          };
        });
        barrier.countDown();
      })
      .catch((e) => {
        console.log(e);
      });
    }

    function billService(calendar, initialRows,barrier){
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
                initialRow["prevBill"]=delivery.lastBillTotal;
                initialRow["currentDue"]=initialRow["prevBill"]-(initialRow["paid"]? initialRow["paid"] : 0);
              }
              break;
            }
          };
        });
        barrier.countDown();   
        //previous month bill and due amount
	  const paramsBillPrev ={ month :  calendar.currentDate.clone().subtract(1, 'months').format('MMM-YYYY'), active: true, type: "income"};
	  BillService.getAll(paramsBillPrev).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of initialRows){
            if(initialRow.id == delivery.partyId){
              if(delivery.rate){
                initialRow["prevBill"]=delivery.bill+delivery.dues;
                initialRow["prevDues"]=delivery.dues;
                initialRow["currentDue"]=initialRow["prevBill"]-(initialRow["paid"]? initialRow["paid"] : 0);
              }
              break;
            }
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });

      })
      .catch((e) => {
        console.log(e);
      });
    }
   
    function rowChange(row, col) {
      constructDeliveryUpdateData(row,col);
    }

	function handleClickOpen () {
      setOpen(true);
    };
  
    function handleClose () {
		setConfirm(false);
		setOpen(false);
    };
	
	function handleConfirm () {
		setConfirm(false);
		generateBillAfterCheck(calendar.currentDate.format("MMM-YYYY"));
		setOpen(false);
	}

    function constructDeliveryUpdateData(row, col){
      var columnVal = row[col.indexes][col.column.key]; 
      var columnId = row[col.indexes]["id"+col.column.key];
      /* for (const [key, value] of Object.entries(row[col.indexes])) {
        if(key == col.column.key){
          columnVal = value;
        }else if(key == ("id"+col.column.key)){
          columnId = value;
        }
      } */
      console.log(row[col.indexes].id+ " - "+columnVal + " - " +columnId);
      saveDelivery(row[col.indexes].id, col.column.key, calendar.currentDate , columnVal, columnId, row[col.indexes]);
      rows[col.indexes] = row[col.indexes];
      //row gives filtered rows, so putting updated data into rows
      setRows (rows.slice());
    }
    
    function saveDelivery (cutomerId, date, month, columnVal, id, rowData) {
      var data = {
        id: id,
        partyId: cutomerId,
        date: date,
        month: month.format("MMM-YYYY"),
        quantity: columnVal,
        type: "income",
        category:null,
        active: true,
        payment: null
      };
      if(date != "discount" && date != "pay"){
          if(id){
              DeliveryService.update(id, data)
                .then(response => {
                  console.log(response.data);
                })
                .catch(e => {
                  console.log(e);
                });
          } else {
            DeliveryService.createDelivery(data)
                .then(response => {
                  var idName = "id"+date;
                  rowData[idName]=response.data.id;
                  console.log(rowData);
                })
                .catch(e => {
                  console.log(e);
                });
            }
      }else{
        if(date == "discount"){
          data.category="discount";
        }
        //null payments are coming so added null check
        if(columnVal){
          data.payment=columnVal;
          data.date=moment().format("DD");
          if(id){
            PaymentService.update(id, data)
              .then(response => {
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
          } else {
            PaymentService.create(data)
              .then(response => {
                var idName = "id"+date;
                rowData[idName]=response.data.id;
                console.log(rowData);
              })
              .catch(e => {
                console.log(e);
              });
          }
        }
      }
    }

    function generateBill(month){
		BillService.validateBillGeneration(month,"income").then((response) => {
			var bill = response.data;
			//bill object has bill, means the bill was generated
			if(bill.rate){
				setConfirm(true);
				setMessage("Bill already generated for the month "+month+". Do you want to continue? Please confirm to proceed.");
				handleClickOpen();
			}else{
				generateBillAfterCheck(month);
			}
		})
		.catch((e) => {
			console.log(e);
			//no bill exist for the month, so generate bill without prompting user
			if(e.response.status == 404){
				generateBillAfterCheck(month);
			}
		});
    }
	
	function generateBillAfterCheck(month){
		const paramsBill ={ "month" : month, "type": "income"};
		BillService.generateBills(paramsBill).then((response) => {
        var deliverys = response.data;
        deliverys && deliverys.map((delivery) => {
          for(var initialRow of rows){
            if(initialRow.id == delivery.partyId){
              initialRow["qty"] = delivery.quantity;
              initialRow["rate"]=delivery.rate;
              initialRow["bill"]=delivery.bill;
              initialRow["dues"]=delivery.dues;
              initialRow["totalBill"]=initialRow["bill"]+(initialRow["dues"]? initialRow["dues"] : 0);
              break;
            }
          };
        });
		setMessage("Bill generated for the month "+month+".");
		handleClickOpen();
		setRows(rows);
      })
      .catch((e) => {
        console.log(e.response);
      });
	}
	
	function onChangeRate(e){
		rate.rate = e.target.value;
		setRate(rate);
	}
  function sendMail(){
    
  }
	function saveRate(){
      var data = {
        id: rate.id,
        rate: rate.rate,
		    active: false,
	    	startDate: rate.startDate,
	    	endDate: calendar.currentDate.format("DD-MMM-YYYY"),
        message: rate.message
      };
      if(rate.id){
          RateService.update(data.id, data)
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
      }
	  var newRate = {
        rate: rate.rate,
		    active: true,
		    startDate: calendar.currentDate.format("DD-MMM-YYYY"),
        message: rate.message,
      };
	  RateService.create(newRate)
		.then(response => {
		   setRate(response.data);
        setMessage("New rate saved.");
        handleClickOpen();
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
          && (filters.route ? r.route.includes(filters.route) : true)
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
          <Grid item xs={2} sm={2}> 
              <Link
                to={"/gui/customerCalendar/"+calendar.currentDate.clone().subtract(1, 'months').format('MMM-YYYY')}
                className="badge bg-warning">
                Prev
              </Link>
              {calendar.currentDate.format("DD-MMM-YYYY")}
              <Link
                to={"/gui/customerCalendar/"+calendar.currentDate.clone().add(1, 'months').format('MMM-YYYY')}
                className="badge bg-warning">
                Next
              </Link>
          </Grid>
          <Grid item xs={3} sm={3}> 
              <Link to="#" onClick={ () => generateBill(calendar.currentDate.format("MMM-YYYY"))}
                className="badge bg-secondary">
                 Generate Bill Month - {calendar.currentDate.format("MMM-YYYY")}
              </Link>
               
          </Grid> 
          <Grid item xs={2} sm={2}> 
            <input
                    type="number"
                    id="rate"
                    required
                    defaultValue={rate.rate}
                    onChange={onChangeRate}
                    name="rate"
                    className="no-print"
                    style={{ width:60, height:20, marginRight:5 }}
                  />
                  <Link to="#" onClick={saveRate} className="badge bg-secondary">
                    Set Rate
                  </Link>
          </Grid> 
          <Grid item xs={2} sm={2}> 
              <Link
                to={"/gui/bills/"+calendar.currentDate.format('MMM-YYYY')}
                className="badge bg-secondary">
                  Print - {calendar.currentDate.format("MMM-YYYY")}
              </Link>
          </Grid> 
          <Grid item xs={2} sm={2}> 
              <Link
                to={"/gui/dues/"+calendar.currentDate.format('MMM-YYYY')}
                className="badge bg-secondary">
                  Dues - {calendar.currentDate.format("MMM-YYYY")}
              </Link>
          </Grid> 
          <Grid item xs={1} sm={1}>
              <Button  className="badge bg-secondary bg-warning">
                    <CSVLink data={filteredRows} filename={'income.txt'}>Export</CSVLink>
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
  
  export default CustomerCalendar;


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