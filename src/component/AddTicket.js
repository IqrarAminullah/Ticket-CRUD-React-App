import React from 'react';  
import axios from 'axios';  
import '../component/AddTicket.css'  
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';  

require('dotenv').config()


class AddTicket extends React.Component{
    constructor(props){
        super(props);
        this.checkValidity = this.checkValidity.bind(this);
        this.AddTicket = this.AddTicket.bind(this);
        this.GetUsers = this.GetUsers.bind(this);
        this.GetCategories = this.GetCategories.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.state = {
            ticketName : '',
            description : '',
            assignee : 0,
            categoryId : 0,

            errMsg : '',

            userList : [],
            categoryList : []
        };
    }

    checkValidity(){
        let valid = true;
        var errMsg = '';
        let {ticketName,assignee,categoryId} = this.state;

        if(assignee === 0){
            valid = false;
            errMsg = 'Ticket Target must be chosen!'
        }
        if(categoryId === 0){
            valid = false;
            errMsg = 'A category must be chosen!'
        }
        if(ticketName === ''){
            valid = false;
            errMsg = 'All Fields must be filled!'
        }

        const finalMsg = errMsg;
        this.state.errMsg = finalMsg;
        return valid;
    }

    componentDidMount() {
        this.GetUsers();
        this.GetCategories();
        console.log(process.env);
      }

    onUserChange(e){
        const newUID = e.target.value;
    
        this.setState({
            assignee : newUID
        })
      }

      onCategoryChange(e){
        const newCategoryId = e.target.value;
    
        this.setState({
            categoryId : newCategoryId
        })
      }

    AddTicket=()=>{
        if(!this.checkValidity()){
            alert(this.state.errMsg);
        }else{
            var newTicket = {
                ticketName :this.state.ticketName,
                description :this.state.description,
                assigneeId : this.state.assignee,
                ownerId : JSON.parse(localStorage.getItem('token')).id,
                categoryId : this.state.categoryId,
            }
            axios.post(process.env.REACT_APP_API_URL+'/api/Ticket',newTicket)
            .then(json =>{
                alert("Data added successfully");
            }).catch(err =>{
                alert("Data failed to be added");
            })
        }
    }

    GetUsers =()=>{
        var userList = [{userId:0,username:"None"}]
        axios.get(process.env.REACT_APP_API_URL+'/api/User')
        .then(response =>{
            userList.push.apply(userList,response.data)
            this.setState({
                userList : userList
            })
        }).catch(error =>{
            alert("Failed to fetch list of users");
        })
    }

    GetCategories =()=>{
        var categories = [{categoryId:0,categoryName:"None"}]
        axios.get(process.env.REACT_APP_API_URL+'/api/Category')
        .then(response =>{
            categories.push.apply(categories,response.data)
            this.setState({
                categoryList : categories
            })
        }).catch(error =>{
            alert("Failed to fetch list of category");
        })
    }


    handleChange = (e) => {
        this.setState({[e.target.name]:e.target.value});
    }

    render(){

        const renderUserList = () =>{
            return <Input type="select" onChange={this.onUserChange}>{this.state.userList.map(e =><option key={e.userId} value={e.userId}>{e.username}</option>)}</Input>
        }

        const renderCategoryList = () =>{
            return <Input type="select" onChange={this.onCategoryChange}>{this.state.categoryList.map(e =><option key={e.categoryId} value={e.categoryId}>{e.categoryName}</option>)}</Input>
        }
        return(
            <Container className="App">
                <h4 className="PageHeading">Enter Ticket Information</h4>
                <Form className="Form">
                    <Col>
                        <FormGroup row>
                            <Label for="ticketName" sm={2}>Ticket Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="ticketName" onChange={this.handleChange} value={this.state.ticketName} placeholder="Enter Ticket Name"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="assignee" sm={2}>Assigned User</Label>
                            <Col sm={10}>
                                {renderUserList()}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="category" sm={2}>Category</Label>
                            <Col sm={10}>
                                {renderCategoryList()}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={2}>Description</Label>
                            <Col sm={10}>
                                <Input type="text" name="description" onChange={this.handleChange} value={this.state.description} placeholder="Enter Ticket Description"/>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup row>
                            <Col sm={5}></Col>
                            <Col sm={1}>
                                <button type="button" onClick={this.AddTicket} className="btn btn-success">Submit</button>
                            </Col>
                            <Col sm={1}>
                                <Button color="danger">Cancel</Button>{' '}
                            </Col>
                            <Col sm={5}></Col>
                        </FormGroup>
                    </Col>
                </Form>
            </Container>
        );
    }
}
   
export default AddTicket;  