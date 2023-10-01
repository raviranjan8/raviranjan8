import React, { Component } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import DataGrid, {textEditor} from 'react-data-grid';
import NumericEditor from "../components/editor/numericeditor.component";
import moment from "moment";
import Grid from '@mui/material/Grid';

const columns = [
  { key: 'id', name: 'ID' , width: 40, resizable: true },		
  { key: 'user', name: 'User' , resizable: true },
  { key: 'email', name: 'Email' , editor: textEditor, editorOptions: {editOnClick: true} , width: 130 , resizable: true },
  { key: 'role', name: 'Role' , editor: textEditor, editorOptions: {editOnClick: true} ,width: 330 , resizable: true }
];

export default class UsersList extends Component {
  constructor(props) {
    super(props);
    this.rowChange = this.rowChange.bind(this);
    this.saveUser = this.saveUser.bind(this);

    this.state = {
      rows: []
    };
    
  }

  componentDidMount() {
    this.retrieveUsers();
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


  render() {
    const { rows } = this.state;

    return (
      <div >
        <Grid container spacing={{ xs: 4}} >
            <Grid item xs={6} sm={6}> 
              <Link to={"#"} className="badge bg-secondary">
                        Add User
              </Link>
            </Grid>
            <Grid item xs={6} sm={6}> 
            <Link className="nav-link" to="#">
                  {moment().format("DD-MMM-YYYY")}
              </Link>
            </Grid>
        </Grid>
        <DataGrid columns={columns} rows={rows} onRowsChange={this.rowChange} />  
      </div>
    );
  }
}
