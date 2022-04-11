import React, { Component } from "react";
import ProductService from "../services/product.service";
import UploadService from "../services/upload-files.service";
import moment from "moment";

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeminRate = this.onChangeminRate.bind(this);
    this.onChangemaxRate = this.onChangemaxRate.bind(this);
    this.onChangeImagePath = this.onChangeImagePath.bind(this);
    this.onChangedescription = this.onChangedescription.bind(this);
  	this.onChangeType = this.onChangeType.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);

    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    
    const today = moment();
    this.state = {
      id: null,
      name: "",
      minRate: "",
      maxRate: "",
      imagePath: "",
      description: "",
      submitted: false,
      message: "",
      selectedFiles: undefined,
      uploadDisable: false
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
  

  onChangeImagePath(e) {
    this.setState({
      imagePath: e.target.value,
      selectedFiles: undefined,
      uploadDisable: true
    });
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
      imagePath: event.target.files[0].name
    });
  }

  upload(productId) {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, 'P_'+productId).then((response) => {
        this.setState({
          message: response.data.message,
        });
      })
      .catch(() => {
        this.setState({
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }


  onChangedescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  saveTutorial(e) {
	  e.target.disabled=true;
    var data = {
      name: this.state.name,
      minRate: this.state.minRate,
      maxRate: this.state.maxRate,
      imagePath: this.state.imagePath,
      description: this.state.description,
     
    };
    this.setState({submitted: true});
    ProductService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          minRate: response.data.minRate,
          maxRate: response.data.maxRate,
          imagePath: response.data.imagePath,
          description: response.data.description,
          submitted: true
        });
        if(this.state.selectedFiles){
          this.upload(response.data.id);
        }
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
      imagePath: "",
      description: "",
      submitted: false
    });
  }

  //
  componentDidMount() {
  }
  
  render() {
    const { products,message, selectedFiles } = this.state;

    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            {message}
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
              <label htmlFor="imagePath">ImagePath
              </label>
              <input
                type="text"
                className="form-control"
                id="imagePath"
                required
                value={this.state.imagePath}
                onChange={this.onChangeImagePath}
                  name="imagePath"
              />

              <label className="btn btn-default">
                <input disabled={this.state.uploadDisable} type="file" onChange={this.selectFile} />
              </label>
             
                  
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
            
            <button onClick={this.saveTutorial} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
