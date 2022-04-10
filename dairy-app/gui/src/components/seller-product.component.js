import React, { Component } from "react";
import moment from "moment";
import ProductService from "../services/product.service";
import SellerProductService from "../services/seller.product.service";

export default class SellerProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeImagepath = this.onChangeImagepath.bind(this);
    this.onChangeBrand = this.onChangeBrand.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.onChangeMrp = this.onChangeMrp.bind(this);
    this.onChangeWeight = this.onChangeWeight.bind(this);
    this.onChangeUnit = this.onChangeUnit.bind(this);
  	this.onChangeMeasurment = this.onChangeMeasurment.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.onChangeDiscount = this.onChangeDiscount.bind(this);
    this.onChangeDiscountType = this.onChangeDiscountType.bind(this);
    this.onChangeDeliveryCharge = this.onChangeDeliveryCharge.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    this.onChangeproduct=this.onChangeproduct.bind(this);
    this.getproduct=this.getproduct.bind(this);
    this.myRef = React.createRef();
    this.myRefUnit = React.createRef();    
    const today = moment();
    this.state = {
      id: null,
      name: "",
      description: "", 
      imagepath: "",
      brand: "",
	    company:"",
      mrp:"",
      weight:"",
      unit:"",
      measurment:"",
      quantity:"",
      rate:"",
      discount:"",
      discountType:"",
      deliveryCharge:"",
      products:[],
      productId: "",
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

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeImagepath(e) {
    this.setState({
      imagepath: e.target.value
    });
  }
  onChangeBrand(e) {
    if (e.target.value.length<11 ){
    this.setState({
    brand: e.target.value  
    });
  }
  }

  onChangeCompany(e) {
    this.setState({
      company: e.target.value
    });
  }

  onChangeMrp(e) {
    this.setState({
      mrp: e.target.value
    });
  }

  onChangeWeight(e) {
    this.setState({
      weight: e.target.value
    });
  }

  onChangeUnit(e) {
    this.setState({
      unit: e.target.value
    });
  }

  onChangeMeasurment(e) {
    this.setState({
      measurment: e.target.value
    });
  }

  onChangeQuantity(e) {
    this.setState({
      quantity: e.target.value
    });
  }

  onChangeRate(e) {
    this.setState({
      rate: e.target.value
    });
  }

  onChangeDiscount(e) {
    this.setState({
      discount: e.target.value
    });
  }

  onChangeDiscountType(e) {
    this.setState({
      discountType: e.target.value
    });
  }

  onChangeDeliveryCharge(e) {
    this.setState({
      deliveryCharge: e.target.value
    });
  }
  onChangeproduct(e) {
    this.setState({
      productId: e.target.value
    });
    console.log(e.target.value);
    this.state.products.map((product)=>{
      if (e.target.value==product.id){
        this.setState({
          description: product.description,
          imagepath: product.imagepath
        });
      }
    })
  }

  onChangeActive(e) {
    this.setState({
      active: e.target.checked
    });
  }

  saveTutorial(e) {
	e.target.disabled=true;
  
    var data = {
      name: this.state.name,
      description: this.state.description,
      imagepath: this.state.imagepath,
      brand: this.state.brand,
      company: this.state.company,
      mrp: this.state.mrp,
      weight: this.state.weight,
      unit: this.state.unit,
      measurment: this.state.measurment,
      quantity: this.state.quantity,
      rate: this.state.rate,
      discount: this.state.discount,
      discountType: this.state.discountType,
      deliveryCharge: this.state.deliveryCharge,
      active: this.state.active,
      productId: this.state.productId,
     
    };
console.log(data);
this.setState({submitted: true});
    SellerProductService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          imagepath: response.data.imagepath,
          brand: response.data.brand,
          company: response.data.company,
          mrp: response.data.mrp,
          weight: response.data.weight,
          unit: response.data.unit,
          measurment: response.data.measurment,
          quantity: response.data.quantity,
          rate: response.data.rate,
          discount: response.data.discount,
          discountType: response.data.discountType,
          deliveryCharge: response.data.deliveryCharge,
          active: response.data.active,
          productId: response.data.productId,
         
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
      description: "",
      imagepath: "",
      brand: "",
      company: "",
      mrp: "",
      weight: "",
      unit: "",
      measurment: "",
      quantity: "",
      rate: "",
      discount: "",
      discountType: "",
      deliveryCharge: "",
      productId: "",
      submitted: false
    });
  }

  //
  componentDidMount() {
    this.getproduct();
  }

  getproduct(){
    ProductService.getAll()
      .then(response => {
        this.setState({
          products: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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
                  <label htmlFor="productId">Product Name</label>
                  <div className="select-container">
                    <select className="form-control" value={this.state.productId} 
                    onChange={this.onChangeproduct} ref={this.myRef} name="productId">
                      {products && products.map((option) => (
                        <option value={option.id}>{option.name}</option>
                      ))}
                    </select>
                  </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imagepath">Imagepath</label>
              <input
                type="text"
                className="form-control"
                id="imagepath"
                required
                value={this.state.imagepath}
                onChange={this.onChangeImage}
                name="imagepath"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                required
                value={this.state.brand}
                onChange={this.onChangeBrand}
                name="brand"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="company"
                required
                value={this.state.company}
                onChange={this.onChangeCompany}
                name="company"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mrp">MRP</label>
              <input
                type="text"
                className="form-control"
                id="mrp"
                required
                value={this.state.mrp}
                onChange={this.onChangeMrp}
                name="mrp"
              />
            </div>
           
            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                className="form-control"
                id="weight"
                required
                value={this.state.weight}
                onChange={this.onChangeWeight}
                name="weight"
              />
            </div>
            <div className="form-group">        
                  <label htmlFor="unit">Unit</label>
                  <div className="select-container">
                    <select className="form-control" value={this.state.unit} 
						onChange={this.onChangeUnit} ref={this.myRefUnit} name="unit">
                        <option value="killogram">Kg</option>
                        <option value="gram">grm</option>
                        <option value="litre">litre</option>

                    </select>
                  </div>
            </div>
            <div className="form-group">
              <label htmlFor="measurment">Measurment</label>
              <input
                type="text"
                className="form-control"
                id="measurment"
                required
                value={this.state.measurment}
                onChange={this.onChangeMeasurment}
                name="measurment"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                className="form-control"
                id="quantity"
                required
                value={this.state.quantity}
                onChange={this.onChangeQuantity}
                name="quantity"
              />
            </div>
            <div className="form-group">
              <label htmlFor="rate">Product Rate</label>
              <input
                type="text"
                className="form-control"
                id="rate"
                required
                value={this.state.rate}
                onChange={this.onChangeRate}
                name="rate"
              />
            </div>

            <div className="form-group">
              <label htmlFor="discount">Discount </label>
              <input
                type="text"
                className="form-control"
                id="discount"
                required
                value={this.state.discount}
                onChange={this.onChangeDiscount}
                name="discount"
              />
            </div>
            <div className="form-group">
              <label htmlFor="discountType">DiscountType </label>
              <input
                type="text"
                className="form-control"
                id="discountType"
                required
                value={this.state.discountType}
                onChange={this.onChangeDiscountType}
                name="discountType"
              />
            </div>
            <div className="form-group">
              <label htmlFor="deliveryCharge">DeliveryCharge </label>
              <input
                type="text"
                className="form-control"
                id="deliveryCharge"
                required
                value={this.state.deliveryCharge}
                onChange={this.onChangeDeliveryCharge}
                name="deliveryCharge"
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
