import React, { Component } from "react";
import ProductService from "../services/product.service";
import moment from "moment";

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeminRate = this.onChangeminRate.bind(this);
    this.onChangemaxRate = this.onChangemaxRate.bind(this);
    this.onChangephoto = this.onChangephoto.bind(this);
    this.onChangedescription = this.onChangedescription.bind(this);
    this.onChangeunitOfQuantity= this.onChangeunitOfQuantity.bind(this);
  	this.onChangeType = this.onChangeType.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    
    const today = moment();
    this.state = {
      id: null,
      name: "",
      minRate: "",
      maxRate: "",
      photo: "",
      description: "",
      unitOfQuantity: "",
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

  onChangeminRate(e) {
    this.setState({
      minRate: e.target.value
    });
  }
  onChangemaxRate(e) {
    this.setState({
      maxRate: e.target.value  
    });
  }
  

  onChangephoto(e) {
    this.setState({
      photo: e.target.value
    });
  }

  onChangedescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeunitOfQuantity(e) {
    this.setState({
      unitOfQuantity: e.target.checked
    });
  }
  
  saveTutorial(e) {
	e.target.disabled=true;
    var data = {
      name: this.state.name,
      minRate: this.state.minRate,
      maxRate: this.state.maxRate,
      photo: this.state.photo,
      description: this.state.description,
      unitOfQuantity:this.state.unitOfQuantity,
    
	 
    };
console.log(data);
this.setState({submitted: true});
    ProductService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          minRate: response.data.minRate,
          maxRate: Response.data.maxRate,
          photo: response.data.photo,
          description: response.data.description,
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
      minRate: "",
      maxRate: "",
      photo: "",
      description: "",
      unitOfQuantity: "",
      submitted: false
    });
  }

  //
  componentDidMount() {
  }
  
  render() {
    const { products } = this.state;
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
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="minRate">MinRate</label>
              <input
                type="number"
                className="form-control"
                id="minRate"
                required
                value={this.state.minRate}
                onChange={this.onChangeminRate}
                name="minRate"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxRate">MaxRate</label>
              <input
                type="number"
                className="form-control"
                id="maxRate"
                required
                value={this.state.maxRate}
                onChange={this.onChangemaxRate}
                name="maxRate"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo
              </label>
              <input
                type="text"
                className="form-control"
                id="photo"
                required
                value={this.state.photo}
                onChange={this.onChangephoto}
                  name="photo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangedescription}
                name="description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="unitOfQuantity">Unit Of Quantity Quantity</label>
              <input
                type="text"
                className="form-control"
                id="unitOfQuantity"
                required
                value={this.state.unitOfQuantity}
                onChange={this.onChangeunitOfQuantity}
                name="unitOfQuantity"
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
