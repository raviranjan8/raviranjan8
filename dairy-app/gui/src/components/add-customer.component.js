import React, { Component } from "react";
import CustomerService from "../services/customer.service";
import RouteService from "../services/route.service";
import moment from "moment";

export default class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeMobNo = this.onChangeMobNo.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
    this.onChangeRoute = this.onChangeRoute.bind(this);
	this.onChangeType = this.onChangeType.bind(this);
    this.onChangeDefaultQuantity = this.onChangeDefaultQuantity.bind(this);
    this.onChangeRouteSeq = this.onChangeRouteSeq.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.myRef = React.createRef();
	this.myRefType = React.createRef();

    const today = moment();
    this.state = {
      id: null,
      name: "",
      address: "", 
      mobNo: "",
	  type:"",
      active: true,
      startDate: today.format("DD-MMM-YYYY"),
      routeId: "",
      defaultQuantity: 1,
      routes:[],
      routeSeq:null,
      submitted: false
    };
  }

	onChangeType(e){
		this.setState({
		  type: e.target.value
		});
	}
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }
  onChangeMobNo(e) {
    if (e.target.value.length<11 ){
    this.setState({
    mobNo: e.target.value  
    });
  }
  }

  onChangeRouteSeq(e) {
    this.setState({
      routeSeq: e.target.value
    });
  }

  onChangeStartDate(e) {
    this.setState({
      startDate: e.target.value
    });
  }

  onChangeActive(e) {
    this.setState({
      active: e.target.checked
    });
  }

  onChangeRoute(e) {
    this.setState({
      routeId: e.target.value
    });
  }

  onChangeDefaultQuantity(e) {
    this.setState({
      defaultQuantity: e.target.value
    });
  }

  saveTutorial(e) {
	e.target.disabled=true;
    var data = {
      name: this.state.name,
      address: this.state.address,
      mobNo: this.state.mobNo,
      startDate: this.state.startDate,
      active: this.state.active,
      routeId: this.myRef.current.value,
	  type: this.myRefType.current.value,
      defaultQuantity: this.state.defaultQuantity,
      routeSeq: this.state.routeSeq
    };
console.log(data);
this.setState({submitted: true});
    CustomerService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          address: response.data.address,
          mobNo: Response.data.mobNo,
          active: response.data.active,
          startDate: response.data.startDate,
          routeId: response.data.routeId,
		  type: response.data.type,
          defaultQuantity: response.data.defaultQuantity,
          routeSeq: response.data.routeSeq,
          submitted: true
        });
		e.target.disabled=false;
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTutorial() {
    this.setState({
      id: null,
      name: "",
      address: "",
      mobNo: "",
      startDate: moment().format("DD-MMM-YYYY"),
      active: true,
      routeId: "",
	  type: "",
      defaultQuantity:1,
      routeSeq: null,
      submitted: false
    });
  }

  //
  componentDidMount() {
    this.getRoute();
  }

  getRoute(){
    RouteService.getAll()
      .then(response => {
        this.setState({
          routes: response.data
        });
        console.log(response.data);
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
            <button className="btn btn-success" onClick={this.newTutorial}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="name">Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                required
                value={this.state.address}
                onChange={this.onChangeAddress}
                name="address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobNo">MobNo</label>
              <input
                type="number"
                className="form-control phone validate"
                id="mobNo"
                required
                value={this.state.mobNo}
                onChange={this.onChangeMobNo}
                name="mobNo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="text"
                className="form-control"
                id="startDate"
                required
                value={this.state.startDate}
                onChange={this.onChangeStartDate}
                name="startDate"
              />
            </div>
            <div className="form-group">
              <label htmlFor="defaultQuantity">Default Quantity</label>
              <input
                type="number"
                className="form-control"
                id="defaultQuantity"
                required
                value={this.state.defaultQuantity}
                onChange={this.onChangeDefaultQuantity}
                name="defaultQuantity"
              />
            </div>
            <div className="form-group">        
                  <label htmlFor="routeId">Route</label>
                  <div className="select-container">
                    <select className="form-control" value={this.state.routeId} 
                    onChange={this.onChangeRoute} ref={this.myRef} name="routeId">
                      {routes.map((option) => (
                        <option value={option.id}>{option.name}</option>
                      ))}
                    </select>
                  </div>
            </div>
            <div className="form-group">
              <label htmlFor="routeSeq">Route Sequene</label>
              <input
                type="number"
                className="form-control"
                id="routeSeq"
                required
                value={this.state.routeSeq}
                onChange={this.onChangeRouteSeq}
                name="routeSeq"
              />
            </div>
			 <div className="form-group">        
                  <label htmlFor="type">Type</label>
                  <div className="select-container">
                    <select className="form-control" value={this.state.type} 
						onChange={this.onChangeType} ref={this.myRefType} name="type">
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="vendor">Vendor</option>
                        <option value="chicken">Chicken</option>
                        <option value="car">Car</option>
                        <option value="ace">Ace</option>
                        <option value="vegetable">Vegetable</option>
                        <option value="grains">Grains</option>
                        <option value="fuel">Fuel</option>
                    </select>
                  </div>
            </div>
            <div className="form-group">        
                  <label htmlFor="active">Active</label>
                  <input type="checkbox" className="form-control"
                  id="active" name="active"
                  onChange={this.onChangeActive} defaultChecked={this.state.active}/>
            </div>

            <button onClick={this.saveTutorial} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
