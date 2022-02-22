import React, { Component } from "react";
import RouteService from "../services/route.service";
import RouteStockService from "../services/route.stock.service";
import CustomerService from "../services/customer.service";
import DeliveryService from "../services/delivery.service";
import { Link } from "react-router-dom";
import DataGrid, {TextEditor} from 'react-data-grid';
import NumericEditor from "../components/editor/numericeditor.component";
import moment from "moment";
import Grid from '@mui/material/Grid';

const columns = [
  { key: 'quantity', name: 'Stock Q' , width: 40, editor: NumericEditor, editorOptions: {editOnClick: true} , resizable: true },
  { key: 'routeId', name: 'Action' , width: 40, resizable: true ,
            formatter(props) {
              return <>
                <Link disable="true"
                to={props.row.quantity ? ("/gui/dailyDelivery/" + props.row.id ): ""}
                className="badge badge-warning">
                Start
                </Link>
              </>;
            }},
  { key: 'delivered', name: 'Delivered Q' , width: 100 , resizable: true },
  { key: 'pending', name: 'Pending' , width: 80 , resizable: true ,
		formatter(props) {
              return <>
                <Link disable="true"
                to={props.row.quantity ? ("/gui/dailyDelivery/" + props.row.id+"/"+props.row.pending ): ""}
                className="badge badge-warning">
                Pending - {props.row.pending}
                </Link>
              </>;
            }},
			
  { key: 'served', name: 'Customer Served' , width: 140 , resizable: true },
  { key: 'totalCustomer', name: 'Total Customer' , width: 130 , resizable: true },
  { key: 'customerQuantity', name: 'Required Q' , width: 100 , resizable: true },
  { key: 'id', name: 'Route ID' , width: 80 , resizable: true },
  { key: 'name', name: 'Name' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true },
  { key: 'address', name: 'Address' , editor: TextEditor, editorOptions: {editOnClick: true} , resizable: true }
];

export default class RoutesList extends Component {
  constructor(props) {
    super(props);
    this.rowChange = this.rowChange.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.routeStockService = this.routeStockService.bind(this);
    this.customerService = this.customerService.bind(this);
    this.deliveryService = this.deliveryService.bind(this);
    

    this.state = {
      rows: []
    };
    
  }

  componentDidMount() {
    this.retrieveRoutes();
  }
  retrieveRoutes() {
    var currentDate = moment();
    var initialRows = null;
    RouteService.getAll().then(response => {
        var routes = response.data;
		    console.log(routes);
        initialRows = new Array(routes.length);
        routes.map((route, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=route.id;
          initialRows[index]["name"]=route.name;
          initialRows[index]["address"]=route.address;          
        });

        const param = {
          date: currentDate.format("DD") ,
          month: currentDate.format("MMM-YYYY") , type: "income"
        };
        this.routeStockService(param, initialRows);
        this.customerService(param, initialRows);
      })
      .catch(e => {
        console.log(e);
      });
  }

  routeStockService(param, initialRows){
    RouteStockService.getAll(param).then((response) => {
      var stocks = response.data;    
	  if(stocks){
		  stocks.map((stock, index) => {
			for(var initialRow of initialRows){
			  if(initialRow.id == stock.routeId){
				initialRow["quantity"]=stock.quantity;
				initialRow["routeStockId"]=stock.id;
				break;
			  }
			};
		  });
	  }
    })
    .catch((e) => {
      console.log(e);
    });   
  }

  customerService(param, initialRows){
    var customers =null;
    const paramCustomer = {active: true, type: "customer"}; 
    CustomerService.getAll(paramCustomer).then((response) => {
      customers = response.data;
      initialRows.map((initialRow, index) => {
        var customerCount = 0;
        var customerQuantity = 0;
        for(var customer of customers){
          if(initialRow.id == customer.routeId){
			//to track which all customer got delivered, keeping all partyIds of the route
            if(initialRow["partyId"]){
              initialRow["partyId"][initialRow["partyId"].length]=customer.id;
            }else{
              initialRow["partyId"]=[];
             initialRow["partyId"][0]=customer.id;
           }
            customerCount++;
            customerQuantity = customerQuantity + customer.defaultQuantity;
          }
        }
        initialRow["totalCustomer"]=customerCount;
        initialRow["customerQuantity"]=customerQuantity;
      });
      this.deliveryService(param, initialRows);
    })
    .catch((e) => {
      console.log(e);
    });
  }

  deliveryService(param, initialRows){
    DeliveryService.getAll(param).then((response) => {
      var deliverys = response.data;
	  if(deliverys){
		  initialRows.map((initialRow, index) => {
			var totalDelivered = 0;
			var countOfCustomerDelivered = 0;
			deliverys.map((delivery) => {
				if(initialRow.partyId){
				  for(var i=0; i < initialRow.partyId.length; i++){
					if(initialRow.partyId[i] == delivery.partyId ){
					  countOfCustomerDelivered++;
					  totalDelivered = totalDelivered + +delivery.quantity ;
					  break;
					}
				  }
				}
			});
			initialRow["served"]=countOfCustomerDelivered;
			initialRow["delivered"]=totalDelivered;
			initialRow["pending"]=initialRow["totalCustomer"]-countOfCustomerDelivered;
		  });
	  }
    console.log(initialRows);
    this.setState({
      rows: initialRows
    });
    })
    .catch((e) => {
      console.log(e);
    }); 
  }

  rowChange(row, col) {
    this.saveRoute(row[col.indexes],col);
    this.setState({
      rows: row
    });
  };

  saveRoute(row,col) {
    if(col.column.key != 'quantity'){
        var data = {
          id: row.id,
          name: row.name,
          address: row.address,
        };
        RouteService.update(row.id, data)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
    }else{
      var data = {
        id: row.routeStockId,
        routeId: row.id,
        quantity: +row.quantity,
        date: moment().format("DD"),
        month: moment().format("MMM-YYYY")
      };
      if(data.id){
        RouteStockService.update(data.id, data)
        .then(response => {
          console.log(response.data);
          row.routeStockId = response.data.id;
        })
        .catch(e => {
          console.log(e);
        });
      }else{
        RouteStockService.create(data)
        .then(response => {
          console.log(response.data);
          row.routeStockId = response.data.id;
        })
        .catch(e => {
          console.log(e);
        });
      }
    }
  }


  render() {
    const { rows } = this.state;

    return (
      <div >
        <Grid container spacing={{ xs: 4}} >
            <Grid item xs={6} sm={6}> 
              <Link to={"/gui/route"} className="nav-link">
                        Add Route
              </Link>
            </Grid>
            <Grid item xs={6} sm={6}> 
            <Link className="nav-link">
                  {moment().format("DD-MMM-YYYY")}
              </Link>
            </Grid>
        </Grid>
        <DataGrid columns={columns} rows={rows} onRowsChange={this.rowChange} />  
      </div>
    );
  }
}
