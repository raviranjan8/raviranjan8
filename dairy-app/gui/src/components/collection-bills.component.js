import React, { Component } from "react";
import DeliveryService from "../services/delivery.service";
import BillService from "../services/bill.service";
import moment from "moment";

export default class CollectionBills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: null
    }
  }

  componentDidMount() {
    this.getBills(this.props.match.params.from, this.props.match.params.to, this.props.match.params.partyId);
  }
  getBills(from, to, partyId){
      const paramsBill ={ from : from, to: to, active: true, type: "expense", category: "collection",  partyId : partyId };
      console.log(paramsBill);
      var initialRows = [];
      BillService.getAll(paramsBill).then((response) => {
        var bills = response.data;
        console.log(bills);
        bills && bills.map((bill,index) => {
			if(bill.quantity > 0 || bill.dues > 0){
				var initialRow = {};  
				initialRow["id"]=bill.id;
				initialRow["partyId"]=bill.partyId;
				initialRow["from"]=bill.from;
        initialRow["to"]=bill.to;
				initialRow["qty"] = bill.quantity;
				initialRow["rate"]=bill.rate;
				initialRow["bill"]=bill.bill;
				initialRow["dues"]=bill.dues;
				initialRow["totalBill"]=initialRow["bill"]+(initialRow["dues"]? initialRow["dues"] : 0);
				initialRow["paid"]=+bill.payment;
        initialRow["discount"]=+bill.discount;
        initialRow["lastBillTotal"]=+bill.lastBillTotal;				
				initialRow["name"]=bill.party;
				
				initialRows[index]={};
				initialRows[index]=initialRow;
			}
        });
		
	  const params ={ "from" : from,"to":to, type: "expense", category:"collection"};
	  DeliveryService.getAll(params).then((response) => {
		var deliverys = response.data;
		deliverys && deliverys.map((delivery) => {
		  for(var initialRow of initialRows){
			if(initialRow && initialRow.partyId == delivery.partyId){
        if(initialRow["delivery"]){
          initialRow["delivery"][initialRow["delivery"].length]=delivery;
        }else {
          initialRow["delivery"]=new Array();
          initialRow["delivery"][0]=delivery;
        }
			  break;
			}
		  };
		});
		console.log(initialRows);
		this.setState({
		  bills: initialRows
		});
	  })
	  .catch((e) => {
		console.log(e);
	  });
	  
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
                             <td><b>{count.name ? count.name : count.id}</b></td>
                           
                             <th>From</th>
                             <td>{count.from}</td>

                             <th>To</th>
                             <td>{count.to}</td>
                           
                             <th>Last Bill</th>
                             <td>{count.lastBillTotal}</td>

                             <th>Payment</th>
                             <td>{count.paid}</td>

                             <th>Discount</th>
                             <td>{count.discount}</td>
                             
                           </tr>
                           <tr>
                             <th >Quantity</th>
                             <td colSpan={3}>{count.qty + ' Ltr'}</td>

                             
                           
                             <th >Bill</th>
                             <td >{count.bill}</td>

                               <th>Dues</th>
                             <td>{count.dues}</td>
							 
							               <th>Total Bill</th>
                             <td colSpan={3}>{count.totalBill} </td>
                           </tr>
                           <tr>
                             <td style={{margin:0, padding:0}} colspan={12}>
                               <table style={{margin:0, padding:0}}>   
                                   <tr>
                                     <td>
                                       <table>
                                         <tr>
                                            <th>Date</th>
                                            <th>SNF</th>
                                            <th>Water</th>
                                            <th>Rate</th>                                      
                                            <th>Quantity</th>
                                            <th>Amount</th>                                    
                                          </tr>                               
                                          {count.delivery && count.delivery.map((delivery, index) => (
                                            (index%2==0 ? 
                                          <tr>
                                            <td><b>{delivery.date}</b></td>
                                            <td>{delivery.snf}</td>
                                            <td>{delivery.water}</td>
                                            <td>{delivery.rate}</td>                                      
                                            <td>{delivery.quantity}</td>
                                            <td>{delivery.amount}</td>
                                          </tr>
                                          :"")
                                          ))}
                                    </table>
                                    </td>
                                    <td>
                                       <table>
                                         <tr>
                                            <th>Date</th>
                                            <th>SNF</th>
                                            <th>Water</th>
                                            <th>Rate</th>                                      
                                            <th>Quantity</th>
                                            <th>Amount</th>                                    
                                          </tr>                               
                                          {count.delivery && count.delivery.map((delivery, index) => (
                                           (index%2==1 ? 
                                              <tr>
                                            <td><b>{delivery.date}</b></td>
                                            <td>{delivery.snf}</td>
                                            <td>{delivery.water}</td>
                                            <td>{delivery.rate}</td>                                      
                                            <td>{delivery.quantity}</td>
                                            <td>{delivery.amount}</td>
                                            </tr>
                                            :"")
                                          ))}
                                    </table>
                                    </td>
                                    </tr>
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
