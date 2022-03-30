import React, { Component, useState , useMemo, useEffect } from "react";
import RouteService from "../services/route.service";
import { Link } from "react-router-dom";
import DataGrid, {TextEditor, SelectCellFormatter} from 'react-data-grid';
import NumericEditor, { textEditorClassname } from "../components/editor/numericeditor.component";
import DeliveryService from "../services/delivery.service";
import PaymentService from "../services/payment.service";
import moment from 'moment';
import Grid from '@mui/material/Grid';
import BillService from "../services/bill.service";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { CSVLink } from 'react-csv';

export function stopPropagation(event) {
  event.stopPropagation();
}

function getComparator(sortColumn) {
  switch (sortColumn) {
    case 'name':
	case 'date':
	case 'month':
	case 'category' :
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
  }
}

const columns = [
  { key: 'id', name: 'ID' , width: 40 , resizable: true },
  { key: 'name', name: 'Name' , width:50, resizable: true },
  { key: 'date', name: 'Date' , editor: TextEditor ,width: 20 , resizable: true },
  { key: 'month', name: 'Month' , editor: TextEditor , width: 40 , resizable: true },
  { key: 'payment', name: 'Payment Amount' , width: 140  ,editor: NumericEditor , resizable: true },
  { key: 'amount', name: 'Bill Amount' , width: 120  , editor: NumericEditor , resizable: true },
  { key: 'quantity', name: 'Quantity' , width: 80  , editor: NumericEditor , resizable: true },
  { key: 'category', name: 'Category', editor:  TextEditor , resizable: true}
];

const ExpenseList = props => {  

	 const initialCalendar = {
		currentDate: moment()
	  };
    const [rows, setRows] = useState([]);
	const [sortColumns, setSortColumns] = useState([]);  
	const [calendar, setCalendar] = useState(initialCalendar);
	const [open, setOpen] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [message, setMessage] = useState();
  
    useEffect(() => {
	  var calendar={currentDate: moment(props.match.params.month,'MMM-YYYY')};
      setCalendar(calendar);
      var initialRows = null;
      const paramCustomer = {type: "expense", month: props.match.params.month};
      DeliveryService.getAll(paramCustomer).then((response) => {
        var expenses = response.data;
		console.log(expenses);
        initialRows = [];
        expenses && expenses.map((customer, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=customer.id;
          initialRows[index]["partyId"]=customer.partyId;
          initialRows[index]["date"]=customer.date;
          initialRows[index]["month"]=customer.month;
          initialRows[index]["quantity"]=customer.quantity;
          initialRows[index]["amount"]=customer.amount;
		  initialRows[index]["type"]=customer.type;
		  initialRows[index]["category"]=customer.category;
          
          initialRows[index]["name"]=customer.party;
          
        });
		console.log(initialRows);
		getPayment(props.match.params.month, initialRows);
      })
      .catch((e) => {
        console.log(e);
      });    
    }, [props.match.params.month]);
	
	function getPayment(month, initialRows){
      var params ={ "month": month, "active": true, type: "expense"};
      PaymentService.getAll(params).then(response => {
        var bills = response.data;
        bills &&  bills.map((customer) => {
			  var index = initialRows.length;
			  initialRows[initialRows.length]={};
			  initialRows[index]["id"]=customer.id;
			  initialRows[index]["partyId"]=customer.partyId;
			  initialRows[index]["date"]=customer.date;
			  initialRows[index]["month"]=customer.month;
			  initialRows[index]["payment"]=customer.payment;
			  initialRows[index]["type"]=customer.type;
			  initialRows[index]["category"]=customer.category;
			  
			  initialRows[index]["name"]=customer.party;
			  
          });
		  setRows(initialRows);
		  console.log(initialRows);
      })
      .catch(e => {
        console.log(e);
      });
    }

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
        partyId: row.partyId,
        month: row.month,
        date: row.date,
        quantity: row.quantity,
        amount: row.amount,
		payment: row.payment,
		type: row.type,
		cotegory: row.category,
		active: true
      };
	  
	if(row.amount > 0){
		DeliveryService.update(row.id, data)
		  .then(response => {
			console.log(response.data);
		  })
		  .catch(e => {
			console.log(e);
		  });
	}
	if(row.payment > 0){
		PaymentService.update(row.id, data)
		  .then(response => {
			console.log(response.data);
		  })
		  .catch(e => {
			console.log(e);
		  });
	}
      
         
    }

	 const sortedRows = useMemo( () => {
		if (sortColumns.length === 0) return rows;
		return [...rows].sort((a, b) => {
		  for (const sort of sortColumns) {
			const comparator = getComparator(sort.columnKey);
			const compResult = comparator(a, b);
			if (compResult !== 0) {
			  return sort.direction === 'ASC' ? compResult : -compResult;
			}
		  }
		  return 0;
		});
	  }, [rows, sortColumns]);
	  
	function generateExpenseBill(month){
		BillService.validateBillGeneration(month,"expense").then((response) => {
			console.log(response.data);
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
		const paramsBill ={ "month" : month, "type": "expense"};
		BillService.generateBills(paramsBill).then((response) => {
        var deliverys = response.data;
		setMessage("Bill generated for the month "+month+".");
		handleClickOpen();
		console.log(deliverys);
      })
      .catch((e) => {
        console.log(e);
      });
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
  
    return (
      <div >	
		<div>
			<Grid container spacing={{ xs: 1}} >
				<Grid item xs={6} sm={3}> 
					<Link to={"/gui/addExpense"} className="badge">
					  Add Expense
					</Link>
				</Grid>
				 <Grid item xs={6} sm={3}> 
					  <Link to="#"
						onClick={ () => generateExpenseBill(calendar.currentDate.format("MMM-YYYY"))}
						className="badge">
						 Generate Expense Bill Month - {calendar.currentDate.format("MMM-YYYY")}
					  </Link>
				</Grid>
				  <Grid item xs={6} sm={3}> 
					  <Link
						to={"/gui/expense/"+calendar.currentDate.clone().subtract(1, 'months').format('MMM-YYYY')}
						className="badge badge-warning">
						Prev
					  </Link>
					  {calendar.currentDate.format("DD-MMM-YYYY")}
					  <Link
						to={"/gui/expense/"+calendar.currentDate.clone().add(1, 'months').format('MMM-YYYY')}
						className="badge badge-warning">
						Next
					  </Link>
				  </Grid>
				<Grid item xs={3} sm={2}>
						  <Link
							to={"/gui/expenseBills/"+calendar.currentDate.format('MMM-YYYY')}
							className="badge">
							 Print - {calendar.currentDate.format("MMM-YYYY")} 
						  </Link>
				</Grid> 
				<Grid item xs={3} sm={1}>
					&nbsp;
					<Button variant="warning" className="badge">
								<CSVLink data={sortedRows} filename={'expense.txt'}>Export</CSVLink>
					</Button>
				</Grid> 		  
          </Grid> 
		  </div>
        <div>
          <DataGrid columns={columns} onRowsChange={rowChange} 
		  defaultColumnOptions={{
            sortable: true,
            resizable: true
          }}
          rows={sortedRows}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}/>  
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
  
  export default ExpenseList;