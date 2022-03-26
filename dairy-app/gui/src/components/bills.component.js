import React, { Component } from "react";
import DeliveryService from "../services/delivery.service";
import BillService from "../services/bill.service";
import moment from "moment";

export default class Bills extends Component {
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
      const paramsBill ={ month : month, active: true, type: "income"};
      var initialRows = [];
      BillService.getAll(paramsBill).then((response) => {
        var bills = response.data;
        bills && bills.map((bill,index) => {
			if(bill.quantity > 0 || bill.dues > 0){
				var initialRow = {};  
				initialRow["id"]=bill.id;
				initialRow["partyId"]=bill.partyId;
				initialRow["month"]=month;
				initialRow["qty"] = bill.quantity;
				initialRow["rate"]=bill.rate;
				initialRow["bill"]=bill.bill;
				initialRow["dues"]=bill.dues;
				initialRow["totalBill"]=initialRow["bill"]+(initialRow["dues"]? initialRow["dues"] : 0);
				initialRow["paid"]=+bill.payment;
        initialRow["discount"]=+bill.discount;
        initialRow["lastBillTotal"]=+bill.lastBillTotal;
				if(bill.customer){
					initialRow["name"]=bill.customer.name;
				}
				initialRows[index]={};
				initialRows[index]=initialRow;
			}
        });
		
	  const params ={ "month" : month, type: "income"};
	  DeliveryService.getAll(params).then((response) => {
		var deliverys = response.data;
		deliverys && deliverys.map((delivery) => {
		  for(var initialRow of initialRows){
			if(initialRow && initialRow.partyId == delivery.partyId){
			  initialRow[delivery.date] = delivery.quantity;
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
                           
                             <th>Month</th>
                             <td>{count.month}</td>
                           
                             <th>Last Bill</th>
                             <td>{count.lastBillTotal}</td>

                             <th>Payment</th>
                             <td>{count.paid}</td>

                             <th>Discount</th>
                             <td>{count.discount}</td>
                             
                           </tr>
                           <tr>
                             <th >Quantity</th>
                             <td >{count.qty + ' Ltr'}</td>

                             <th >Rate</th>
                             <td >{count.rate}</td>
                           
                             <th >Bill</th>
                             <td >{count.bill}</td>

                             <th>Dues</th>
                             <td>{count.dues}</td>
							 
							               <th>Total Bill</th>
                             <td>{count.totalBill} </td>
                           </tr>
                           <tr>
                             <td style={{margin:0, padding:0}} colspan={10}>
                               <table style={{margin:0, padding:0}}>
                                 <tr>
                                   <td >Day</td>
                                   <td >1</td>
                                   <td >2</td>
                                   <td >3</td>
                                   <td >4</td>
                                   <td >5</td>
                                   <td >6</td>
                                   <td >7</td>
                                   <td >8</td>
                                   <td >9</td>
                                   <td >10</td>
                                   <td >11</td>
                                   <td >12</td>
                                   <td >13</td>
                                   <td >14</td>
                                   <td >15</td>
                                   <td >16</td>
                                   <td rowSpan={2}><h1>RAMJI DAIRY</h1></td>								   
                                 </tr>
                                 <tr>
                                          <td >Quantity</td>  
                                          <td  >{count["01"]}</td>
                                          <td  >{count["02"]}</td>
                                          <td  >{count["03"]}</td>
                                          <td  >{count["04"]}</td>
                                          <td  >{count["05"]}</td>
                                          <td  >{count["06"]}</td>
                                          <td  >{count["07"]}</td>
                                          <td  >{count["08"]}</td>
                                          <td  >{count["09"]}</td>
                                          <td  >{count["10"]}</td>
                                          <td  >{count["11"]}</td>
                                          <td  >{count["12"]}</td>
                                          <td  >{count["13"]}</td>
                                          <td  >{count["14"]}</td>
                                          <td  >{count["15"]}</td>
                                          <td  >{count["16"]}</td>
                                 </tr>
                                 
                                 <tr>
                                   <td >Day</td>
                                   <td >17</td>
                                   <td >18</td>
                                   <td >19</td>
                                     <td >20</td>
                                   <td >21</td>
                                   <td >22</td>
                                   <td >23</td>
                                   <td >24</td>
                                   <td >25</td>
                                   <td >26</td>
                                   <td >27</td>
                                   <td >28</td>
                                   <td >29</td>
                                   <td >30</td>
                                   <td >31</td>
                                   <td >{" "}</td>
                                   <td rowSpan={2}><h3>9860910995,</h3></td>
                                 </tr>
                                 <tr>
                                          <td >quantity</td>
                                          <td  >{count["17"]}</td>
                                          <td  >{count["18"]}</td>
                                          <td  >{count["19"]}</td>
                                          <td  >{count["20"]}</td>
                                          <td  >{count["21"]}</td>
                                          <td  >{count["22"]}</td>
                                          <td  >{count["23"]}</td>
                                          <td  >{count["24"]}</td>
                                          <td  >{count["25"]}</td>
                                          <td  >{count["26"]}</td>
                                          <td  >{count["27"]}</td>
                                          <td  >{count["28"]}</td>
                                          <td  >{count["29"]}</td>
                                          <td  >{count["30"]}</td>
                                          <td  >{count["31"]}</td>
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
