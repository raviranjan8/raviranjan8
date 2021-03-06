import React, { Component } from "react";
import moment from 'moment';
import { View, Text, StyleSheet ,ScrollView } from "react-native";
import {  Card,Avatar, LinearProgress} from 'react-native-elements';

import CustomerService from "../services/customer.service";
import DeliveryService from "../services/delivery.service";
import Modal from "./modal.component";

export default class ProjectData extends Component {
  
  constructor(props) {
    super(props);
    this.getProjects= this.getProjects.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
    this.getData = this.getData.bind(this);
    

    this.state = {
      projects: [],
      activeProject: '',
      modalTitle: '',
      partyId: null,
      quantity: null,
	    amount: null,
      date: moment().format("DD-MMM-YYYY"),
      routeId: null,
      progress:0,
      pending: null
    }
  }
  
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(){
    this.getData();
  }

  getData(){    
    if(this.state.routeId != this.props.route.params.id || this.state.pending != this.props.route.params.pending){
      this.handleModalClose();
      this.setState({
        projects: [],
        progress:0
      });
      this.getProjects(this.props.route.params.id, this.props.route.params.pending);
      this.setState({
        routeId: this.props.route.params.id,
        pending: this.props.route.params.pending
      });  
    }
  }
  
  getProjects(id, pending) {
    if(pending){
      const params ={ "routeId" : id, type: "customer", searchFlag: "pending" };
      CustomerService.getAll(params).then(response => {
        this.setState({
          projects: response.data,
          progress:1
        });
      })
      .catch(e => {
      console.log(e);
      });
    }else{
      const params ={ "routeId" : id, type: "customer" };
      CustomerService.getAll(params).then(response => {
        console.log(response.data);
        var projects = response.data;
        var today = moment();
        const params =  { date: today.format("DD"),
                          month: today.format("MMM-YYYY"), 
                          "type": "income"
                     };
        //checking if already delivered for the day
        DeliveryService.getAll(params).then(response => {
          var deliverys = response.data;
          deliverys && deliverys.map((delivery) => {
            for(var initialRow of projects){                   
              if(initialRow.id == delivery.partyId){
                initialRow.today = delivery.quantity;                
                break;
              }
            };
          });          
          this.setState({
            projects: projects,
            progress:1
          });
        })
        .catch(e => {
          console.log(e);
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
        url={data.today}
        onModalOpen={this.handleModalOpen}
      />,
    );
        
    return (
        <ScrollView>
          <LinearProgress style={{ marginVertical: 10 }} value={this.state.progress}  variant="determinate"/>
        {this.state.activeProject === '' ?         
          (this.state.projects == null || this.state.projects.length==0)?
          <Text>{''}</Text>
          :
            <View style={[styles.container, {
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: 'space-around',
                  marginBottom: 30,
                }]}>
                  {projectComponents} 
            </View>
            
        : 
        <View>
            <Modal 
              name={this.state.modalTitle}
              quantity={this.state.quantity}
              amount={this.state.amount}
              date={this.state.date}
              partyId={this.state.partyId}
              previousTitle={prevTitle(this.state.activeProject, projects)}
              nextTitle={nextTitle(this.state.activeProject, projects)}
              onModalClose={this.handleModalClose}
              onNext={this.handleNextProject}
              onPrev={this.handlePrevProject}
            />
        </View>
        }
        </ScrollView>
      );
    
  }
}

class Project extends React.Component {
  render() {
    return (
         <Avatar     
           title={this.props.url ? (this.props.name +'::' + this.props.url) : this.props.name }
           containerStyle={{ backgroundColor: '#1F1A24', margin: 5, }}
           size={94}
           titleStyle={{fontSize:15, color:'grey' }}
           key={1}
           onPress={() => {this.props.onModalOpen(this.props.index)}}>
        </Avatar>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
