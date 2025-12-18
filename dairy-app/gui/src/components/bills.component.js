import React, { Component } from "react";
import DeliveryService from "../services/delivery.service";
import BillService from "../services/bill.service";
import RateService from "../services/rate.service";
import RouteService from "../services/route.service";
import CustomerService from "../services/customer.service";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";
import ContentEditable from 'react-contenteditable'

export default class Bills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: null,
      allBills: null,
      rate: {},
      routes: [],
      selectedRoute: "",
      duesFilter: "all" // "all", "withDues", "withoutDues", "paid"
    }
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleDuesFilterChange = this.handleDuesFilterChange.bind(this);
  }

  componentDidMount() {
    this.getBills(this.props.match.params.month);
    this.getRateAdminData();
    this.getRoutes();
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
				
				initialRow["name"]=bill.party;
				
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
		
		// Fetch party information to get route data
		this.getPartyRouteInfo(initialRows);
	  })
	  .catch((e) => {
		console.log(e);
	  });
	  
        this.setState({
          bills: initialRows,
          allBills: initialRows
        });
      })
      .catch((e) => {
        console.log(e);
      });

    
  }

  getPartyRouteInfo(initialRows) {
    const params = { active: true, type: "customer" };
    CustomerService.getAll(params).then((response) => {
      var parties = response.data;
      var partyRouteMap = {};
      
      // Create a map of partyId to route
      parties && parties.map((party) => {
        if(party.route) {
          partyRouteMap[party.id] = {
            routeId: party.routeId,
            routeName: party.route.name
          };
        }
      });
      
      // Add route information to bills
      initialRows && initialRows.map((row) => {
        if(row && row.partyId && partyRouteMap[row.partyId]) {
          row["routeId"] = partyRouteMap[row.partyId].routeId;
          row["routeName"] = partyRouteMap[row.partyId].routeName;
        }
      });
      
      this.setState({
        bills: initialRows,
        allBills: initialRows
      }, () => {
        this.applyFilters();
      });
    })
    .catch((e) => {
      console.log(e);
      this.setState({
        bills: initialRows,
        allBills: initialRows
      }, () => {
        this.applyFilters();
      });
    });
  }

  getRoutes() {
    RouteService.getAll().then((response) => {
      this.setState({
        routes: response.data || []
      });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  handleRouteChange(e) {
    this.setState({
      selectedRoute: e.target.value
    }, () => {
      this.applyFilters();
    });
  }

  handleDuesFilterChange(e) {
    this.setState({
      duesFilter: e.target.value
    }, () => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const { allBills, selectedRoute, duesFilter } = this.state;
    
    if (!allBills || allBills.length === 0) {
      this.setState({
        bills: allBills || []
      });
      return;
    }
    
    let filteredBills = allBills.filter((bill) => {
      if (!bill) return false;
      
      // Filter by route
      if (selectedRoute && selectedRoute !== "") {
        const routeId = parseInt(selectedRoute);
        // If routeId is not set yet, exclude from filtered results when route filter is active
        if (bill.routeId === undefined || bill.routeId === null) {
          return false;
        }
        if (bill.routeId !== routeId) {
          return false;
        }
      }
      
      // Filter by dues/payment
      if (duesFilter === "withDues") {
        // Show only bills with dues > 0
        if (!bill.dues || bill.dues <= 0) {
          return false;
        }
      } else if (duesFilter === "withoutDues") {
        // Show only bills with dues <= 0 (paid or no dues)
        if (bill.dues && bill.dues > 0) {
          return false;
        }
      } else if (duesFilter === "paid") {
        // Show only bills that are fully paid (dues <= 0 and totalBill = 0)
        if ( bill.totalBill || bill.totalBill != 0) {
          return false;
        }
      }
      // "all" - no filtering
      
      return true;
    });
    
    this.setState({
      bills: filteredBills
    });
  }

  getRateAdminData(){
    const param = { active: true}; 

    RateService.getAll(param).then((response) => {
      var rates = response.data[0];
      this.setState({
        rate: rates
      });
      console.log(this.state.rate);
    }).catch((e) => {
          console.log(e);
    });
  }

  render() {
    const { bills, rate, routes, selectedRoute, duesFilter } = this.state;
    return (
      <div>
        <div className="mb-3 no-print" style={{ padding: "15px", backgroundColor: "#f8f9fa", marginBottom: "20px" }}>
          <div className="row">
            <div className="col-md-4 d-flex align-items-center">
              <label
                htmlFor="routeFilter"
                className="form-label"
                style={{ marginRight: 8, marginBottom: 0 }}
              >
                <strong>Route:</strong>
              </label>
              <select
                className="form-control"
                id="routeFilter"
                value={selectedRoute}
                onChange={this.handleRouteChange}
                style={{ maxWidth: 180 }}
              >
                <option value="">All Routes</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <label
                htmlFor="duesFilter"
                className="form-label"
                style={{ marginRight: 8, marginBottom: 0 }}
              >
                <strong>Payment/Dues:</strong>
              </label>
              <select
                className="form-control"
                id="duesFilter"
                value={duesFilter}
                onChange={this.handleDuesFilterChange}
                style={{ maxWidth: 220 }}
              >
                <option value="all">All Bills</option>
                <option value="withDues">With Dues</option>
                <option value="withoutDues">Without Dues (Paid/No Dues)</option>
                <option value="paid">Fully Paid</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              <div>
                <strong>Total Bills: </strong>{bills ? bills.length : 0}
              </div>
            </div>
          </div>
        </div>
          {bills && bills.length > 0 ? bills.map((count, index) => (
            <div key={count.id || index}>
                      <table className="table" border="1" >
                          <tr >
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
                           <tr >
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
                           <tr >
                             <td style={{margin:0, padding:0}} colspan={10}>
                               <table style={{margin:0, padding:0, width:'100%', }}>
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
                                   <td rowSpan={2}><h3>9860910995</h3></td>
                                 </tr>
                                 <tr>
                                          <td >Quantity</td>
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
                           {rate.message &&(
                            <tr >
                             <td align="center" colspan={10}>
                                <ContentEditable html={rate.message} />
                              </td>
                            </tr>
                           )}
                        </table>
                </div>
          )) : (
            <div className="alert alert-info" style={{ margin: "20px", padding: "20px", textAlign: "center" }}>
              <strong>No bills found</strong> matching the selected filters.
            </div>
          )}    
           
      </div>
    );
  }
}
