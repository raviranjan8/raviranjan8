import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import moment from 'moment';

import AddCustomer from "./components/add-customer.component";
import AddProduct from "./components/add-product.component";
import ProductList from "./components/product-list.component";
import SellerProduct from "./components/seller-product.component";
import SellerProductList from "./components/seller-product-list.component";
import ProjectData from "./components/daily-delivery.component";
import AddRoute from "./components/add-route.component";
import RoutesList from "./components/routes-list.component";
import CustomerCalendar from "./components/customer-calendar.component";
import CustomerDaily from "./components/customer-today.component";
import CollectionBillsList from "./components/collection-bills-list.component";
import EmployeeDaily from "./components/customer-today.component";
import CollectionDaily from "./components/collection-daily.component";
import CustomerList from "./components/customer-list.component";
import Bills from "./components/bills.component";
import CollectionBills from "./components/collection-bills.component";
import ExpenseBills from "./components/expense-bills.component";
import ExpenseList from "./components/expense-list.component";
import AddExpense from "./components/add-expense.component";
import Login from "./components/login.component";
import AuthService from "./services/auth.service";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
	  showModeratorBoard: true,
      showAdminBoard: false,
      currentUser: undefined
    };
	console.log(props);
	//AuthService.setCurrentUser(props);
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }
	
  render() {
	  const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <Router>
        <div >
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
			{showModeratorBoard && (
			        <li className="nav-item">
                <Link to={"/gui/routes"} className="nav-link">
                  Routes
                </Link>
              </li>
			)}
      {showModeratorBoard && (
			      <li className="nav-item">
              <Link to={"/gui/customerDaily/"+moment().format("DD-MMM-YYYY")} className="nav-link">
                Today
              </Link>
            </li>
			)}
      
			{showAdminBoard && (
              <li className="nav-item">
                <Link to={"/gui/customerCalendar/"+moment().format("MMM-YYYY")} className="nav-link">
                  Calendar 
                </Link>
              </li>
			)}
		
			{showModeratorBoard && (
			  <li className="nav-item">
                <Link to={"/gui/expense/"+moment().format("MMM-YYYY")} className="nav-link">
                  Expense
                </Link>
              </li>
			)}
      {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/gui/customers"} className="nav-link">
                  Party
                </Link>
              </li>
			)}
      
      {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/gui/productlist"} className="nav-link">
                  ProductList
                </Link>
              </li>
			)}
       {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/gui/sellerProductlist"} className="nav-link">
                  SellerProductList
                </Link>
              </li>
			)}

      {showModeratorBoard && (
			  <li className="nav-item">
                <Link to={"/gui/collectionDaily/"+moment().format("DD-MMM-YYYY")} className="nav-link">
                  Collection
                </Link>
              </li>
			)}
        {showModeratorBoard && (
			  <li className="nav-item">
                <Link to={"/gui/CollectionBillsList/"+moment().format("DD-MMM-YYYY")} className="nav-link">
                  CollectionBillsList
                </Link>
              </li>
			)}
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/gui/routes"]} component={RoutesList} />
             // <Route exact path={["/", "/gui/routes/:date"]} component={RoutesList} />
              <Route exact path="/gui/customers" component={CustomerList} />
              <Route exact path="/gui/addCustomer" component={AddCustomer} />
              <Route exact path="/gui/productlist" component={ProductList} />
              <Route exact path="/gui/addProduct" component={AddProduct} />
              <Route exact path="/gui/sellerProduct" component={SellerProduct} />
              <Route exact path="/gui/sellerProductlist" component={SellerProductList} />
              <Route exact path="/gui/dailyDelivery/:id" component={ProjectData} />
			        <Route exact path="/gui/dailyDelivery/:id/:pending" component={ProjectData} />
              <Route exact path="/gui/route" component={AddRoute} />
              <Route exact path="/gui/routes" component={RoutesList} />
              <Route exact path="/gui/customerCalendar/:date" component={CustomerCalendar} />
              <Route exact path="/gui/customerDaily/:date" component={CustomerDaily} />
              <Route exact path="/gui/bills/:month" component={Bills} />
              <Route exact path="/gui/collectionbills/:from/:to" component={CollectionBills} />
              <Route exact path="/gui/collectionbills/:from/:to/:partyId" component={CollectionBills} />
              <Route exact path="/gui/expenseBills/:month" component={ExpenseBills} />
              <Route exact path="/gui/bills/:month/:partyId" component={Bills} />
			        <Route exact path="/gui/expense/:month" component={ExpenseList} />
			        <Route exact path="/gui/addExpense" component={AddExpense} />
			        <Route exact path="/gui/login" component={Login} />
              <Route exact path="/gui/collectionDaily/:date" component={CollectionDaily} />
              <Route exact path="/gui/routes/:date" component={RoutesList} />
              <Route exact path="/gui/CollectionBillsList/:date" component={CollectionBillsList} />
              <Route exact path="/gui/employeeDaily/:date" component={EmployeeDaily} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
