import React, { Component } from "react";
import AuthService from "../services/auth.service";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AuthService.setCurrentUser("Alok");
	console.log(AuthService.getCurrentUser());
	this.props.history.push("/gui/routes");
	window.location.reload();
  }

  render() {
	  return "";
  }
}
