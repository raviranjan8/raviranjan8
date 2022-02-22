import React, { Component } from "react";
import RouteService from "../services/route.service";

export default class AddRoute extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    const today = new Date();
    this.state = {
      id: null,
      name: "",
      address: "", 
      active: true,
      startDate: today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear(),

      submitted: false
    };
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

  onChangeStartDate(e) {
    this.setState({
      startDate: e.target.value
    });
  }

  onChangeActive(e) {
    console.log(e.target.checked);
    this.setState({
      active: e.target.checked
    });
  }

  saveTutorial() {
    var data = {
      name: this.state.name,
      address: this.state.address,
      startDate: this.state.startDate,
      active: this.state.active
    };
    console.log(this.state.active);
    RouteService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          address: response.data.address,
          active: response.data.active,
          startDate: response.data.startDate,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTutorial() {
    this.today = new Date();
    this.setState({
      id: null,
      name: "",
      address: "",
      startDate: this.today.getDate() + "-"+ parseInt(this.today.getMonth()+1) +"-"+this.today.getFullYear(),
      active: true,

      submitted: false
    });
  }

  render() {
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
              <label htmlFor="name">Route Name</label>
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

            <button onClick={this.saveTutorial} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
