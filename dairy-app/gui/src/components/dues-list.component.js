import React, { Component } from "react";
import BillService from "../services/bill.service";
import RouteService from "../services/route.service";
import CustomerService from "../services/customer.service";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";

export default class DuesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: null,
      allBills: null,
      routes: [],
      selectedRoute: "",
      duesFilter: "all",
      sortField: "",
      sortDirection: "asc"
    };

    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleDuesFilterChange = this.handleDuesFilterChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.renderSortIndicator = this.renderSortIndicator.bind(this);
  }

  componentDidMount() {
    const month = this.props.match.params.month;
    this.getDuesBills(month);
    this.getRoutes();
  }

  getDuesBills(month) {
    const paramsBill = { month: month, active: true, type: "income" };
    let initialRows = [];

    BillService.getAll(paramsBill)
      .then((response) => {
        const bills = response.data;
        bills &&
          bills.map((bill, index) => {
            // Only pick customers having dues
            if ((bill.dues && bill.dues > 0) || (bill.bill && bill.bill > 0)) {
              const initialRow = {};
              initialRow["id"] = bill.id;
              initialRow["partyId"] = bill.partyId;
              initialRow["month"] = month;
              initialRow["name"] = bill.party;
              initialRow["bill"] = bill.bill;
              initialRow["dues"] = bill.dues;
              initialRow["lastBillTotal"] = bill.lastBillTotal;
              initialRow["paid"] = +bill.payment;
              initialRow["totalBill"] =
                (bill.bill ? +bill.bill : 0) +
                (bill.dues ? +bill.dues : 0);

              initialRows[index] = {};
              initialRows[index] = initialRow;
            }
          });

        // fetch party / route mapping for route filter
        this.getPartyRouteInfo(initialRows);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getPartyRouteInfo(initialRows) {
    const params = { active: true, type: "customer" };
    CustomerService.getAll(params)
      .then((response) => {
        const parties = response.data;
        const partyRouteMap = {};

        parties &&
          parties.map((party) => {
            if (party.route) {
              partyRouteMap[party.id] = {
                routeId: party.routeId,
                routeName: party.route.name
              };
            }
          });

        initialRows &&
          initialRows.map((row) => {
            if (row && row.partyId && partyRouteMap[row.partyId]) {
              row["routeId"] = partyRouteMap[row.partyId].routeId;
              row["routeName"] = partyRouteMap[row.partyId].routeName;
            }
          });

        this.setState(
          {
            bills: initialRows,
            allBills: initialRows
          },
          () => {
            this.applyFilters();
          }
        );
      })
      .catch((e) => {
        console.log(e);
        this.setState(
          {
            bills: initialRows,
            allBills: initialRows
          },
          () => {
            this.applyFilters();
          }
        );
      });
  }

  getRoutes() {
    RouteService.getAll()
      .then((response) => {
        this.setState({
          routes: response.data || []
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleRouteChange(e) {
    this.setState(
      {
        selectedRoute: e.target.value
      },
      () => {
        this.applyFilters();
      }
    );
  }

  handleDuesFilterChange(e) {
    this.setState(
      {
        duesFilter: e.target.value
      },
      () => {
        this.applyFilters();
      }
    );
  }

  applyFilters() {
    const { allBills, selectedRoute, duesFilter } = this.state;

    if (!allBills || allBills.length === 0) {
      this.setState({
        bills: allBills || []
      });
      return;
    }

    const filteredBills = allBills.filter((bill) => {
      if (!bill) return false;

      if (selectedRoute && selectedRoute !== "") {
        const routeId = parseInt(selectedRoute);
        if (bill.routeId === undefined || bill.routeId === null) {
          return false;
        }
        if (bill.routeId !== routeId) {
          return false;
        }
      }

      // Filter by dues/payment (same options as bills page)
      if (duesFilter === "withDues") {
        // Only with dues > 0
        if (!bill.dues || bill.dues <= 0) {
          return false;
        }
      } else if (duesFilter === "withoutDues") {
        // Only with dues <= 0
        if (bill.dues && bill.dues > 0) {
          return false;
        }
      } else if (duesFilter === "paid") {
        // Fully paid: dues <= 0 and some payment done
        if ( bill.totalBill || bill.totalBill != 0) {
          return false;
        }
      }

      return true;
    });

    this.setState({
      bills: filteredBills
    });
  }

  handleSort(field) {
    const { bills, sortField, sortDirection } = this.state;
    if (!bills || bills.length === 0) {
      return;
    }

    let direction = "asc";
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    }

    const sorted = [...bills].sort((a, b) => {
      let av = a[field];
      let bv = b[field];

      // Handle undefined / null
      if (av === undefined || av === null) av = 0;
      if (bv === undefined || bv === null) bv = 0;

      const aNum = typeof av === "number";
      const bNum = typeof bv === "number";

      // Numeric sort when both are numbers, otherwise string sort
      if (aNum && bNum) {
        return direction === "asc" ? av - bv : bv - av;
      } else {
        const as = ("" + av).toLowerCase();
        const bs = ("" + bv).toLowerCase();
        if (as < bs) return direction === "asc" ? -1 : 1;
        if (as > bs) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    this.setState({
      bills: sorted,
      sortField: field,
      sortDirection: direction
    });
  }

  renderSortIndicator(field) {
    const { sortField, sortDirection } = this.state;
    if (sortField !== field) {
      return null;
    }
    return sortDirection === "asc" ? " ▲" : " ▼";
  }

  render() {
    const { bills, routes, selectedRoute, duesFilter } = this.state;
    const month = this.props.match.params.month;

    return (
      <div>


        <div
          className="mb-3 no-print"
          style={{
            padding: "15px",
            backgroundColor: "#f8f9fa",
            marginBottom: "20px"
          }}
        >
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
                style={{ maxWidth: 220 }}
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
                <strong>Total Customers with Dues: </strong>
                {bills ? bills.length : 0}
              </div>
            </div>
          </div>
        </div>

        {bills && bills.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("name")}
                >
                  Customer{this.renderSortIndicator("name")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("routeName")}
                >
                  Route{this.renderSortIndicator("routeName")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("lastBillTotal")}
                >
                  Last Bill{this.renderSortIndicator("lastBillTotal")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("bill")}
                >
                  Current Bill{this.renderSortIndicator("bill")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("paid")}
                >
                  Payment{this.renderSortIndicator("paid")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("dues")}
                >
                  Dues{this.renderSortIndicator("dues")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleSort("totalBill")}
                >
                  Total Bill{this.renderSortIndicator("totalBill")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{row.name ? row.name : row.id}</td>
                  <td>{row.routeName}</td>
                  <td>{row.lastBillTotal}</td>
                  <td>{row.bill}</td>
                  <td>{row.paid}</td>
                  <td>{row.dues}</td>
                  <td>{row.totalBill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            className="alert alert-info"
            style={{ margin: "20px", padding: "20px", textAlign: "center" }}
          >
            <strong>No customers with dues</strong> for this month / filter.
          </div>
        )}
      </div>
    );
  }
}


