import React, { Component } from "react";
import DeliveryService from "../services/delivery.service";
import BillService from "../services/bill.service";
import PaymentService from "../services/payment.service";
import moment from "moment";

export default class ExpenseBills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: null
    }
  }

  componentDidMount() {
    this.getBills(this.props.match.params.month);
  }

  getBills(month){
      const paramsBill ={ month : month, active: true, type: "expense"};
      var initialRows = [];
      BillService.getAll(paramsBill).then((response) => {
        var bills = response.data;
        bills && bills.map((bill,index) => {
			if(bill.quantity > 0 || bill.dues > 0 || bill.payment > 0){
				var initialRow = {};
				initialRow["id"]=bill.id;
				initialRow["partyId"]=bill.partyId;
				initialRow["month"]=month;
				initialRow["qty"] = bill.quantity;
				initialRow["rate"]=bill.rate;
				initialRow["bill"]=bill.bill;
				initialRow["dues"]=bill.dues;
				initialRow["totalBill"]=initialRow["bill"]+(initialRow["dues"]? initialRow["dues"] : 0);
				initialRow["paid"]=+bill.payment
				if(bill.customer){
					initialRow["name"]=bill.customer.name;
				}
				initialRows[index]={};
				initialRows[index]=initialRow;
				
				//fetch all bills for the vendor/staff
				 const params ={ "month" : month, type: "expense", partyId: bill.partyId};
				  DeliveryService.getAll(params).then((response) => {
					var deliverys = response.data;
					initialRows[index]["allBills"] = deliverys;
					this.setState({
					  bills: initialRows
					});
				  })
				  .catch((e) => {
					console.log(e);
				  });
				  PaymentService.getAll(params).then((response) => {
					var deliverys = response.data;
					initialRows[index]["allPayments"] = deliverys;
					this.setState({
					  bills: initialRows
					});
				  })
				  .catch((e) => {
					console.log(e);
				  });
	  
			}
        });
		console.log(initialRows);
        this.setState({
          bills: initialRows
        });
      })
      .catch((e) => {
        console.log(e);
      });    
  }

  render() {
    const { bills } = this.state;
    return (
      <div className="container">
        <table className="table">
          {bills && bills.map((count) => (
            <tr>
                <td >
                      <table className="table noBorder" border="1" >
                          <tr>
                             <th>Name</th>
                             <td colspan="3"><b>{count.name ? count.name : count.id}</b></td>
                           
                             <th>Month</th>
                             <td>{count.month}</td>
                           
                             <th >Quantity</th>
                             <td >{count.qty}</td>
                           </tr>
                           <tr>
                             <th >Bill</th>
                             <td >{count.bill}</td>

                             <th>Prev Dues</th>
                             <td>{count.dues}</td>
							 
							 <th>Total Bill</th>
                             <td>{count.totalBill} </td>
							 
							 <th>Payment</th>
                             <td>{count.paid} </td>
                           </tr>
                           <tr>
                             <td  colspan={4}>
                               <table width="100%">
								{count.allBills && count.allBills.map((allBill) => (
                                 <tr>
                                   <td >{allBill.date}-{allBill.month}</td>
                                   <td >{allBill.amount}</td>
                                 </tr>
								 ))}
                               </table>
                             </td>
							 <td colspan={4}>
                               <table width="100%">
								 {count.allPayments && count.allPayments.map((allPayment) => (
                                  <tr>
                                   <td>{allPayment.date}-{allPayment.month}</td>
                                   <td>{allPayment.payment}</td>
                                 </tr>	
								))}								 
                               </table>
                             </td>
                           </tr>
                        </table>
              </td>
            </tr>
          ))}    
           </table> 
      </div>
    );
  }
}
