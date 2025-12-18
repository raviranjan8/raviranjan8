import React, { Component } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import DataGrid, {textEditor} from 'react-data-grid';
import NumericEditor from "./editor/numericeditor.component";
import RateService from "../services/rate.service";
import moment from "moment";
import Grid from '@mui/material/Grid';

const columns = [
  { key: 'id', name: 'ID' , width: 40, resizable: true },		
  { key: 'user', name: 'User' , resizable: true },
  { key: 'email', name: 'Email' , editor: textEditor, editorOptions: {editOnClick: true} , width: 130 , resizable: true },
  { key: 'role', name: 'Role' , editor: textEditor, editorOptions: {editOnClick: true} ,width: 330 , resizable: true }
];

const initialCalendar = {
  currentDate: moment()
};

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.rowChange = this.rowChange.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.saveRate = this.saveRate.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.updateAgain = this.updateAgain.bind(this);

    this.state = {
      rows: [],
      rate: {},
      prevRate: {},
      submitted: false,
    };
    
  }

  componentDidMount() {
    this.getRateAdminData();
  }

  updateAgain(){
    this.setState({
      submitted: false,
    });
    this.getRateAdminData();
  }
  getRateAdminData(){
    const param = { active: true}; 

    RateService.getAll(param).then((response) => {
      var rates = response.data;
      var rate ={};
      rates && rates.map((r, index) => {
        rate = {
          id: r.id,
          rate: r.rate,
          startDate: r.startDate,
          message: r.message
        };
        });
        this.setState({
          rate: rate,
          prevRate: rate
        });
      })
        .catch((e) => {
          console.log(e);
    });
  }
  saveUser(row,col) {
    var data = {
      username: row.user,
      email: row.email,
      userUpdate: true,
      role:row.role.split(",")
    };
    console.log(data);
    AuthService.register(data)
      .then(response => { 
        console.log(response.data);
      })
      .catch(e => {
        alert("Updated failed.");
        console.log(e);
      });
  }

  retrieveUsers() {
    UserService.getAll().then(response => {
        var users = response.data;
        var initialRows = new Array(users.length);
        users && users.map((user, index) => {
          initialRows[index]={};
          initialRows[index]["id"]=user.id;
          initialRows[index]["user"]=user.username;
          initialRows[index]["email"]=user.email;
          initialRows[index]["role"]='';
          user.roles && user.roles.map((role) => {
            initialRows[index]["role"]=role.name+","+initialRows[index]["role"];
          });   
        });
        this.setState({
          rows: initialRows
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  rowChange(row, col) {
    this.saveUser(row[col.indexes],col);
    this.setState({
      rows: row
    });
  };

  onChangeRate(e){
    this.setState({
      rate : {...this.state.rate, "rate": e.target.value}
    });
	}
  onChangeMessage(e){
    this.setState({
      rate : {...this.state.rate,"message": e.target.value}
    });
	}

  saveRate(){
    var data = {
      id: this.state.prevRate.id,
      active: false,
      endDate: initialCalendar.currentDate.format("DD-MMM-YYYY"),
      rate: this.state.prevRate.rate,
      message: this.state.prevRate.message,
      startDate: this.state.prevRate.startDate
    };
    if(this.state.rate.id){
        RateService.update(data.id, data)
          .then(response => {
            this.setState({
              submitted: true,
            });
          })
          .catch(e => {
            console.log(e);
          });
    }
    
  var newRate = {
      rate: this.state.rate.rate,
      active: true,
      message: this.state.rate.message,
      startDate: initialCalendar.currentDate.format("DD-MMM-YYYY")
    };
  RateService.create(newRate)
  .then(response => {
     this.setState({
      rate: response.data,
      prevRate: response.data
    });
  })
  .catch(e => {
    console.log(e);
  });
}


  render() {
    const { rows, rate } = this.state;
    return (

      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.updateAgain}>
              Check
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="address">Billing Rate</label>
              <input
                type="number"
                id="rate"
                className="form-control"
                required
                defaultValue={rate.rate}
                onChange={this.onChangeRate}
                name="rate"
              />
            </div>    
            <div className="form-group">
              <label htmlFor="address">Promotion Message</label>
              <input
                type="text"
                id="message"
                className="form-control"
                required
                defaultValue={rate.message}
                onChange={this.onChangeMessage}
                name="message"
              />
            </div>            

            <button onClick={this.saveRate} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
        
    );
  }
}
