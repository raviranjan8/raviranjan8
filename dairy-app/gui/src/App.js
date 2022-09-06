import React, { Component } from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.min.js';
import "./App.css";
import moment from 'moment';

import Profile from "./components/Profile";
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
import UsersList from "./components/user-list.component";
import Login from "./components/login.component";
import AuthService from "./services/auth.service";

import AuthVerify from "./components/listner/AuthVerify";
import { history } from "./helpers/history";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined
    };
	  console.log(props);
    this.logout = this.logout.bind(this);
    
    history.listen((location) => {
      AuthVerify();
    });
  }
  componentDidMount() {
    const user = AuthVerify();
    //console.log(user);
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("staff"),
        showAdminBoard: user.roles.includes("admin"),
      });
    }
  }

  logout() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined
    });
  };
	
  render() {
	  const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <Router history={history}>
        <div >
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
                  <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                        {showModeratorBoard && (
                                  <li className="nav-item">
                                    <Link to={"/gui/routes"} className="nav-link">
                                      Routes
                                    </Link>
                                  </li>
                          )}
                  </ul>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="true" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
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
                          {showAdminBoard && (
                                  <li className="nav-item">
                                    <Link to={"/gui/Users"} className="nav-link">
                                      Users
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

                    
                    </ul>


                    <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                    {currentUser ? (
                      <div className="navbar-nav me-auto">
                        <li className="nav-item">
                          <Link to={"/gui/Profile"} className="nav-link">
                            {currentUser.username}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to={"/gui/login"} className="nav-link" onClick={this.logout}>
                            Logout
                          </Link>
                        </li>
                      </div>
                    ) : (
                      <div className="navbar-nav me-auto">
                        <li className="nav-item">
                          <Link to={"/gui/login"} className="nav-link">
                            Login
                          </Link>
                        </li>
                      </div>
                    )}
                    </ul>
                </div>
              </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/gui/routes"]} component={RoutesList} />
              <Route exact path={["/", "/gui/routes/:date"]} component={RoutesList} />
              <Route exact path="/gui/customers" component={CustomerList} />
              <Route exact path="/gui/addCustomer" component={AddCustomer} />
              <Route exact path="/gui/productlist" component={ProductList} />
              <Route exact path="/gui/addProduct" component={AddProduct} />
              <Route exact path="/gui/sellerProduct/:id" component={SellerProduct} />
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
              <Route exact path="/gui/Profile" component={Profile} />
              <Route exact path="/gui/Users" component={UsersList} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
