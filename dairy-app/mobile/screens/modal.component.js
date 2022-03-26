import React, { Component } from "react";
import moment from 'moment';

import DeliveryService from "../services/delivery.service";
import PaymentService from "../services/payment.service";
import CustomerService from "../services/customer.service";
import { View,ScrollView,StyleSheet,Text,Dimensions,KeyboardAvoidingView,Platform,Vibration,} from 'react-native';
import {  Input,  SearchBar,  Icon,  Button,  ThemeProvider,  InputProps,} from 'react-native-elements';

export default class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.savePayment = this.savePayment.bind(this);
      this.saveMobNo = this.saveMobNo.bind(this);
      this.onChangePayment = this.onChangePayment.bind(this);
      this.onChangeMobNo = this.onChangeMobNo.bind(this);
      this.updateComponent = this.updateComponent.bind(this);
      this.onChangeQuantity = this.onChangeQuantity.bind(this);
      this.onChangeAmount = this.onChangeAmount.bind(this);      
      this.handleModalUpdate = this.handleModalUpdate.bind(this);
      this.saveDelivery = this.saveDelivery.bind(this);
      

      this.state = {
        payment: '',
        prevBill: {},
        currentBill: {},
        open: false,
        mobNo: '',
        partyId:null,
        amount: null,
        quantity: null,
        date: null,
        name: null,
        enbale:false
      };
    }

    componentDidMount() {
      this.updateComponent();
    }

    updateComponent(){
      if(this.state.partyId != this.props.partyId){
        this.setState({
           partyId:this.props.partyId,
           amount: this.props.amount? String(this.props.amount): "",
           quantity: String(this.props.quantity),
           date: this.props.date,
           name: this.props.name
         });
         
     }
    }
    componentDidUpdate(prevProps) {
      this.updateComponent();
    }
  
    onChangePayment(e){
      this.setState({
        payment: e
      });
    }
    onChangeQuantity(input){
      this.setState({
        quantity:input
      });
    }
    onChangeAmount(input){
      this.setState({
        amount:input
      });
    }

    onChangeMobNo(e){
      if (e.length<11 ){
        this.setState({
          mobNo: e
        });
      }
    }

    handleModalUpdate = (e) => {      
      this.setState({
        enbale:true
      });
      this.saveDelivery(this.state.partyId,this.state.date, this.state.quantity,this.state.amount, e);
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
                        "type": "income"
                     };
      //checking if already delivered for the day
      DeliveryService.getAll(params).then(response => {
          if(response.data && response.data.length > 0){
            data["id"]=response.data[0].id;
            DeliveryService.update(data["id"], data).then(response1 => {
              console.log(response1.data);                
                this.setState({
                  enbale:false
                });
                this.props.onNext();
            })
            .catch(e => {
              console.log(e);
            });
          } else {
            DeliveryService.create(data).then(response1 => {
              console.log(response1.data);              
              this.setState({
                enbale:false
              });
              this.props.onNext();
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

    saveMobNo(e){
      if(this.state.mobNo){
        var data = {id: this.props.partyId};
             CustomerService.updateMobNo(this.props.partyId, this.state.mobNo, data)
              .then(response => {
                console.log(response.data);
                alert(this.state.mobNo +" Mobile no. saved.");
                this.setState({
                  mobNo:''
                });
              })
              .catch(e => {
                console.log(e);
              }); 
      }
    }

    savePayment(e){	    
      if(this.state.payment){
        var data = {
          partyId: this.props.partyId,
          month: moment(this.props.date, "DD-MMM-YYYY").format("MMM-YYYY"),
          date: moment(this.props.date, "DD-MMM-YYYY").format("DD"),
		      active: true,
          payment: this.state.payment,
          type: "income"
        };
        PaymentService.create(data)
          .then(response => {
            this.setState({
              currentBill: {
                quantity: this.state.currentBill.quantity,
                rate: this.state.currentBill.rate,
                bill: this.state.currentBill.bill,
                dues: this.state.currentBill.dues,
                month: moment(this.props.date, "DD-MMM-YYYY").format("MMM-YYYY"),
                payment: (this.state.currentBill.payment? this.state.currentBill.payment : 0) + response.data.payment
              }
            });
            console.log(response.data);			      
            alert(this.state.payment+ " Rs payment confirmed.");
            this.setState({
              payment: ''
            });
          })
          .catch(e => {
            console.log(e);
          });
        }
    }
  
    render() {
      const {prevBill, currentBill, partyId} = this.state;
     
      return (
        <ScrollView>
        <View>
            <View style={[styles.headerContainer]}>
              <Text style={[styles.heading]}>{this.state.name}</Text>
            </View>
            <View  >
              <View > 
                       
                      <Input
                        required
						            readOnly ="readOnly"
                        value={this.state.date}
                        name="date"
                        label="Date"
                      />
                      <Input label="Amount"
                        value={this.state.amount}
                        keyboardType={'numeric'} 
                        onChangeText={this.onChangeAmount}                       
                      />
                
                      <Input label="Quantity" 
                        keyboardType={'numeric'}
                        value={this.state.quantity}
                        onChangeText={this.onChangeQuantity}
                      />
                
                <View  style={styles.buttonStyle}>
                      <Button 
                           buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 100,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            padding:20
                          }}
                          title={'\u25C0' } onPress={this.props.onPrev}> </Button>
                     
                      <Button      
                          disabled={this.state.enbale}                      
                          buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            padding:20
                          }}
                          title="Update & Next" onPress={e => this.handleModalUpdate(e)}></Button>
                      
                      <Button 
                          buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 100,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            padding:20
                          }}
                          title={'\u25B6'}  onPress={this.props.onNext}></Button>    
                    </View>
                    <View style={styles.buttonStyle}>
                      <Button 
                          buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                          }}
                          title="Back" onPress={this.props.onModalClose}></Button>
                    </View>
              </View>
              <View>                
                      
                      <Input label="Payment"
                        required
                        value={this.state.payment}
                        onChangeText={this.onChangePayment}
						            keyboardType="numeric"
                      />
                </View>
                <View style={styles.buttonStyle}>
                  <Button 
                    title={'Payment Received'}
                    buttonStyle={{
                      backgroundColor: 'rgba(199, 43, 98, 1)',
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 30,
                    }}
                    containerStyle={{
                      width: 200,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                    onPress={this.savePayment}></Button>
                </View>
              
                <View>
                      <Input label="Mobile No"                        
                        value={this.state.mobNo}
                        onChangeText={this.onChangeMobNo}
                        name="mobNo"
						            keyboardType="numeric"
                      />
               </View>
               <View style={styles.buttonStyle}>
                <Button title={'Set Mob No'}
                      buttonStyle={{
                        backgroundColor: 'rgba(199, 43, 98, 1)',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                      }}
                      containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                      }}
                     onPress={this.saveMobNo}></Button>  
            </View>
        </View>
        </View>
        </ScrollView>
      );
    }
  }


  const styles = StyleSheet.create({
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1F1A24',
      marginBottom: 20,
      width: '100%',
      paddingVertical: 15,
      borderRadius: 30,
    },
    heading: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
    },
    headerRight: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 5,
    },
    subheaderText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonStyle: {
      flexDirection: "row",
      justifyContent: 'space-around',
    },
    inputStyle: {
      flexDirection: "row",
      justifyContent: 'space-around',
    },
    labelStyle: {
      padding:20
    }
  });