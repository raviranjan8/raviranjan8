import React, { Component } from "react";
import CustomerService from "../services/customer.service";
import DeliveryService from "../services/delivery.service";
import PaymentService from "../services/payment.service";
import moment from "moment";

export default class AddExpense extends Component {
  constructor(props) {
    super(props);
	this.saveExpense = this.saveExpense.bind(this);
	this.onChangeQuantity = this.onChangeQuantity.bind(this);
	this.onChangeAmount = this.onChangeAmount.bind(this);
	this.onChangePayment = this.onChangePayment.bind(this);
	this.newExpense = this.newExpense.bind(this);
	
	
	this.onDate = this.onDate.bind(this);
	
    this.myRef = React.createRef();

    this.state = {
      id: null,
      partyId: null,
      quantity: null,
      date:null,
      month: null,
	  type: "expense",
	  amount: null,
	  payment: null,
	  submitted: false,
	  routes:[],
	  inputDate: moment().format("DD-MMM-YYYY")
    };
  }
  
  onChangeQuantity(e){
	  this.setState({
		  quantity: e.target.value
		});
  }
  
  onChangePayment(e){
	   this.setState({
		  payment: e.target.value
		});
  }
  
  onChangeAmount(e){
	   this.setState({
		  amount: e.target.value
		});
  }
  
  onDate(e){
	   this.setState({
		  inputDate: e.target.value
		});
  }
  
  
  
  saveExpense(e) {
	e.target.disabled=true;
	var data = {
		  partyId: this.myRef.current.value,
		  quantity: this.state.quantity,
		  date:moment(this.state.inputDate, "DD-MMM-YYYY").format("DD"),
		  month: moment(this.state.inputDate, "DD-MMM-YYYY").format("MMM-YYYY"),
		  type: "expense",
		  amount: this.state.amount,
		  payment: this.state.payment,
		  active: true
		};
		
	if(this.state.amount > 0){
		DeliveryService.create(data)
		  .then(response => {
			this.setState({
			  id: response.data.id,
			  amount: response.data.amount,
			  submitted: true
			});
			console.log(response.data);
		  })
		  .catch(e => {
			console.log(e);
		  });
	}
	if(this.state.payment > 0){
		PaymentService.create(data)
		  .then(response => {
			this.setState({
			  id: response.data.id,
			  payment: response.data.payment,
			  submitted: true
			});
			console.log(response.data);
			e.target.disabled=false;
		  })
		  .catch(e => {
			console.log(e);
		  });
	}
  }

  newExpense() {
    this.setState({
      id: null,
      partyId: null,
      quantity: null,
      date:null,
      month: null,
	  type: "expense",
	  amount: null,
	  payment: null,
	  submitted: false,
	  inputDate: moment().format("DD-MMM-YYYY")
    });
  }

  componentDidMount() {
    this.getRoute();
  }

  getRoute(){
	var paramCustomer = {searchFlag: "non-customer"};
    CustomerService.getAll(paramCustomer)
      .then(response => {
		this.setState({
		  routes: response.data
		});
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { routes } = this.state;
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newExpense}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="name">Vendor/Staff Name</label>
                  <div className="select-container">
                    <select className="form-control" value={this.state.partyId} 
						onChange={this.onChangeRoute} ref={this.myRef} name="partyId">
						  {routes && routes.map((option) => (
							<option value={option.id}>{option.name}</option>
						  ))}
                    </select>
                  </div>
            </div>
			<div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                required
                value={this.state.quantity}
                onChange={this.onChangeQuantity}
                name="quantity"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Bill Amount</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                required
                value={this.state.amount}
                onChange={this.onChangeAmount}
                name="amount"
              />
            </div>
			<div className="form-group">
              <label htmlFor="payment">Payment Amount</label>
              <input
                type="number"
                className="form-control"
                id="payment"
                required
                value={this.state.payment}
                onChange={this.onChangePayment}
                name="payment"
              />
            </div>
			<div className="form-group">
                      <label htmlFor="inputDate">Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputDate"
                        required
						readOnly ="readOnly"
                        value={this.state.inputDate}
                        onChange={this.onDate}
                        name="inputDate"
                      />
            </div>
            <button onClick={this.saveExpense} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
