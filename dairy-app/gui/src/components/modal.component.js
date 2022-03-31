import React, { Component } from "react";
import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import BillService from "../services/bill.service";
import PaymentService from "../services/payment.service";
import CustomerService from "../services/customer.service";

export default class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.getCustomerBill = this.getCustomerBill.bind(this);
      this.savePayment = this.savePayment.bind(this);
      this.saveMobNo = this.saveMobNo.bind(this);
      this.onChangePayment = this.onChangePayment.bind(this);
      this.onChangeMobNo = this.onChangeMobNo.bind(this);
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.getPayment = this.getPayment.bind(this);
      this.getBill = this.getBill.bind(this);
  
      this.state = {
        partyId: props.partyId,
        payment: null,
        prevBill: {},
        currentBill: {},
        open: false,
        mobNo: null
      }; 
    }
  
    componentDidMount() {
      this.getCustomerBill(this.props);
    }

    
    onChangePayment(e){
      this.setState({
        payment: +e.target.value
      });
    }

    onChangeMobNo(e){
      if (e.target.value.length<11 ){
        this.setState({
          mobNo: +e.target.value
        });
      }
    }
    saveMobNo(e){
      e.target.disabled=true;
      if(this.state.mobNo){
        var data = {id: this.props.partyId};
             CustomerService.updateMobNo(this.props.partyId, this.state.mobNo, data)
              .then(response => {
                console.log(response.data);
                e.target.disabled=false;
              })
              .catch(e => {
                console.log(e);
              }); 
      }
    }

    savePayment(e){
	    e.target.disabled=true;
      if(this.state.payment){
        var data = {
          partyId: this.props.partyId,
          month: moment(this.props.date, "DD-MMM-YYYY").format("MMM-YYYY"),
          date: moment(this.props.date, "DD-MMM-YYYY").format("DD"),
		      active: true,
          payment: this.state.payment,
          type: "income"
        };
        PaymentService.create(data)
          .then(response => {
            this.setState({
              currentBill: {
                quantity: this.state.currentBill.quantity,
                rate: this.state.currentBill.rate,
                bill: this.state.currentBill.bill,
                dues: this.state.currentBill.dues,
                month: moment(this.props.date, "DD-MMM-YYYY").format("MMM-YYYY"),
                payment: (this.state.currentBill.payment? this.state.currentBill.payment : 0) + response.data.payment
              }
            });
            console.log(response.data);
			      e.target.disabled=false;
            this.handleClickOpen();
            this.state.payment="";
          })
          .catch(e => {
            console.log(e);
          });
        }
    }
  
    handleClickOpen = () => {
      this.setState({
        open: true
      });
    };
  
    handleClose = () => {
      this.setState({
        open: false
      });
    };
  
    getCustomerBill(props){
      var date = moment(props.date, "DD-MMM-YYYY");
      var month = date.format("MMM-YYYY");

      var currentBill = {month: month};
      this.getPayment(month, props.partyId, currentBill);
      this.getBill(month, props.partyId, "currentBill", currentBill);
    
      var monthprev = date.clone().subtract(1, 'months').format("MMM-YYYY");
      var prevBill = {month: monthprev};
      this.getPayment(monthprev, props.partyId, prevBill);
      this.getBill(monthprev, props.partyId, "prevBill", prevBill);
    
    }

    getBill(month, partyId, billName, prevBill){
      var params ={ "partyId" : partyId ,
              "month": month, "active": true, type: "income"};
      BillService.getAll(params).then(response => {
        var bills = response.data;
        if(bills){
          bills.map((bill) => {
              prevBill["quantity"] = bill.quantity;
              prevBill["rate"]=bill.rate;
              prevBill["bill"]=bill.bill;
              prevBill["dues"]=bill.dues;
          });
        }
        this.setState({
          [billName]: prevBill
        });
        console.log(this.state);
      })
      .catch(e => {
        console.log(e);
      });
    }

    getPayment(month, partyId, prevBill){
      var params ={ "partyId" : partyId ,
                    "month": month, "active": true, type: "income"};
      PaymentService.getAll(params).then(response => {
        var bills = response.data;
        if(bills){
          bills.map((bill) => {
            if(bill.category == 'discount'){
              prevBill["discount"]=bill.payment;
            } else{
              if(prevBill["payment"]){
                prevBill["payment"]=prevBill["payment"]+bill.payment;
              }else{
                prevBill["payment"]=+bill.payment
              }
            }
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    }
  
    render() {
      const {prevBill, currentBill} = this.state;
      if(this.props.partyId != this.state.partyId){
        this.getCustomerBill(this.props);
        this.setState({
          partyId: this.props.partyId
        });
      }
      return (
        <div>
          <h1 align="center">{this.props.name}</h1>
          <Grid container spacing={{ xs: 4}} >
            <Grid item xs={12} sm={6}> 
                <div className="form-group">
                      <label htmlFor="date"> Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="date"
                        required
						            readOnly ="readOnly"
                        value={this.props.date}
                        onChange={this.props.onDate}
                        name="date"
                      />
                </div>
				<div className="form-group">
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        required
                        value={this.props.amount}
                        onChange={this.props.onAmount}
                        name="amount"
                      />
                </div>
                <div className="form-group">
                      <label htmlFor="defaultQuantity">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        id="defaultQuantity"
                        required
                        value={this.props.defaultQuantity}
                        onChange={this.props.onQuantity}
                        name="defaultQuantity"
                      />
                </div>
                    <div className="form-group" style={{ textAlign: 'center' }}>
                      <button className="btn btn-success" onClick={this.props.onUpdate}>Update & Next</button>
                    </div>
                    <div className="form-group" style={{ textAlign: 'center' }}>
                      <button className="btn btn-success" onClick={this.props.onModalClose}>Back</button>
                      {" "}
                      <button className="btn btn-success" onClick={this.props.onPrev}>{'\u2B05'}{this.props.previousTitle} </button>
                      {" "}                      
                      <button className="btn btn-success" onClick={this.props.onNext}>{this.props.nextTitle} {'\u27A1'}</button>
                    </div>
          </Grid>
          <Grid item xs={12} sm={6}> 
                <div className="form-group">
  
                <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 200 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Billing</TableCell>
                              <TableCell align="right">Prev Month ({prevBill.month})</TableCell>
                              <TableCell align="right">Current Month ({currentBill.month})</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    Quantity
                                </TableCell>
                                <TableCell align="right">{prevBill.quantity}</TableCell>
                                <TableCell align="right">{currentBill.quantity}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    Rate
                                </TableCell>
                                <TableCell align="right">{prevBill.rate}</TableCell>
                                <TableCell align="right">{currentBill.rate}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    Bill
                                </TableCell>
                                <TableCell align="right">{prevBill.bill}</TableCell>
                                <TableCell align="right">{currentBill.bill}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    Payment
                                </TableCell>
                                <TableCell align="right">{prevBill.payment}</TableCell>
                                <TableCell align="right">{currentBill.payment}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                    Dues
                                </TableCell>
                                <TableCell align="right">{prevBill.dues}</TableCell>
                                <TableCell align="right">{currentBill.dues}</TableCell>
                              </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    
                </div>
                <div className="form-group">
                      <label htmlFor="payment">Payment</label>
                      <input
                        className="form-control"
                        id="payment"
                        required
                        value={this.state.payment}
                        onChange={this.onChangePayment}
                        name="payment"
						            type="number"
                      />
                </div>
                <button className="btn btn-success" onClick={this.savePayment}>Payment Received</button>

                <div className="form-group">
                      <label htmlFor="mobNo">MobileNo</label>
                      <input
                        className="form-control"
                        id="mobNo"
                        required
                        value={this.state.mobNo}
                        onChange={this.onChangeMobNo}
                        name="mobNo"
						            type="number"
                      />
                </div>
                <button className="btn btn-success" onClick={this.saveMobNo}>Set Mob No</button>  
          </Grid>
        </Grid>
  
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {"Payments"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Payment of amount {this.state.payment} is confirmed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        </div>
      );
    }
  }