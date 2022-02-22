import React, { Component } from "react";
import moment from 'moment';

import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


import CustomerService from "../services/customer.service";
import DeliveryService from "../services/delivery.service";
import Modal from "./modal.component";

export default class ProjectData extends Component {
  
  constructor(props) {
    super(props);
    this.getProjects= this.getProjects.bind(this);
    this.saveDelivery= this.saveDelivery.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
    this.onChangeDefaultQuantity = this.onChangeDefaultQuantity.bind(this);
	this.onChangeAmount = this.onChangeAmount.bind(this);

    this.state = {
      projects: [],
      activeProject: '',
      modalTitle: '',
      partyId: null,
      quantity: null,
	  amount: null,
      date: moment().format("DD-MMM-YYYY")
    }
   
  }
  
  componentDidMount() {
    this.getProjects(this.props.match.params.id, this.props.match.params.pending);
  }

  getProjects(id, pending) {
	if(pending){
		const params ={ "routeId" : id, type: "customer", searchFlag: "pending" };
		CustomerService.getAll(params)
		  .then(response => {
			console.log(response.data);
			this.setState({
			  projects: response.data
			});
		  })
		  .catch(e => {
			console.log(e);
		  });
	}else{
		const params ={ "routeId" : id, type: "customer" };
		CustomerService.getAll(params)
		  .then(response => {
			console.log(response.data);
			this.setState({
			  projects: response.data
			});
		  })
		  .catch(e => {
			console.log(e);
		  });
	}
  }


  handleModalOpen = (idx) => {
    this.setState({
      activeProject: idx,
      modalTitle: this.state.projects[idx].name,
      quantity: this.state.projects[idx].defaultQuantity,
	  amount: this.state.projects[idx].amount,
      date: this.state.date,
      partyId: this.state.projects[idx].id
    });  
  };

  handleModalClose = () => {
    this.setState({
      activeProject: ''
    });  
  };

  handleNextProject = () => {
    
    var arr = this.state.projects.length;
    var idx = this.state.activeProject + 1;
    var idx = idx % arr;
    
    this.setState({
      activeProject: idx,
      modalTitle: this.state.projects[idx].name,
      quantity: this.state.projects[idx].defaultQuantity,
	  amount: this.state.projects[idx].amount,
      date: this.state.date,
      partyId: this.state.projects[idx].id
    }); 
    
  }

  handlePrevProject = () => {
    var arr = this.state.projects.length;
    var idx = this.state.activeProject;    
    if (idx === 0) {
      var idx = arr - 1;
    } else {
      var idx = idx -1;
    }
    
    this.setState({
      activeProject: idx,
      modalTitle: this.state.projects[idx].name,
      quantity: this.state.projects[idx].defaultQuantity,
	  amount: this.state.projects[idx].amount,
      date: this.state.date,
      partyId: this.state.projects[idx].id
    });  
    
  }

  handleModalUpdate = (e) => {
	  e.target.disabled=true;
    this.saveDelivery(this.state.partyId,this.state.date, this.state.quantity,this.state.amount, e);
  }

  onChangeDefaultQuantity(e) {
    this.setState({
      quantity: e.target.value
    });
  }
  onChangeAmount(e) {
    this.setState({
      amount: e.target.value
    });
  }
  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  saveDelivery (id, date, quantity, amount, e) {
    const dateObj = moment(date, "DD-MMM-YYYY");
    var data = {
      partyId: id,
      date: dateObj.format("DD"),
      month: dateObj.format("MMM-YYYY"),
      quantity: quantity,
	  amount: amount,
	  type: "income"
    };
    
    const params =  { "partyId" : id , 
                      "date": data.date,
                      "month": data.month, 
					  type: "income"
                   };
				   
    DeliveryService.getAll(params).then(response => {
        if(response.data && response.data.length > 0){
          data["id"]=response.data[0].id;
          DeliveryService.update(data["id"], data).then(response1 => {
            console.log(response1.data);
			 e.target.disabled=false;
			this.handleNextProject();
          })
          .catch(e => {
            console.log(e);
          });
        } else {
          DeliveryService.create(data).then(response1 => {
            console.log(response1.data);
			e.target.disabled=false;
			this.handleNextProject();
          })
          .catch(e => {
            console.log(e);
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    
    this.state.date=moment().format("DD-MMM-YYYY");
  }

  render() {
    const { projects } = this.state;
    
    function nextTitle(idx, arr) {
      var i = idx + 1;
      var i = i % arr.length;
      return arr[i].name;
    }
    
    function prevTitle(idx, arr) {
      
      if (idx === 0) {
        var i = arr.length -1;
      } else {
        var i = idx -1;
      }
      
      return arr[i].name;
    }

    const projectComponents = projects && projects.map((data, idx, arr) =>
      <Project
        key={'project-' + data.id}
        index={idx}
        name={data.name}
        url={data.address}
        onModalOpen={this.handleModalOpen}
      />,
    );

    if(this.state.activeProject === '') {
      return (
        <div>
          <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {projectComponents}
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <Modal 
            name={this.state.modalTitle}
            defaultQuantity={this.state.quantity}
			amount={this.state.amount}
            date={this.state.date}
            partyId={this.state.partyId}
            previousTitle={prevTitle(this.state.activeProject, projects)}
            nextTitle={nextTitle(this.state.activeProject, projects)}
            onModalClose={this.handleModalClose}
            onNext={this.handleNextProject}
            onPrev={this.handlePrevProject}
            onDate={this.onChangeDate}
            onQuantity={this.onChangeDefaultQuantity}
			onAmount={this.onChangeAmount}
            onUpdate={this.handleModalUpdate}
          />
        </div>
      );
    }
  }
}

const styles = theme => ({
  root: {
    color: theme.success.main
  }
});

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



class Project extends React.Component {
  render() {
    return (

  <Grid item xs={2} sm={4} md={4} key={this.props.index} onClick={this.props.onModalOpen.bind(this, this.props.index)}>
    <Item><h1>{this.props.name} - {this.props.url}</h1></Item>
  </Grid>                
    );
  }
}


