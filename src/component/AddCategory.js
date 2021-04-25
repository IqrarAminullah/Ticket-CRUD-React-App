import React from 'react';  
import axios from 'axios';  
import '../component/AddTicket.css'  
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';  

class AddCategory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categoryName : ""
        };
    }

    AddCategory=()=>{
        var newCategory = {
            categoryName:this.state.categoryName
        }
        axios.post(process.env.REACT_APP_API_URL+'/api/Category',newCategory)
        .then(response =>{
            console.log(response.data);
        })
    }

    handleChange = (e) => {
        this.setState({[e.target.name]:e.target.value});
    }

    render(){
        return(
            <Container className="App">
                <h4 className="PageHeading">Enter New Category Name</h4>
                <Form className="Form">
                    <Col>
                        <FormGroup row>
                            <Label for="ticketName" sm={2}>Category Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="categoryName" onChange={this.handleChange} value={this.state.categoryName} placeholder="Enter Category Name"/>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup row>
                            <Col sm={5}></Col>
                            <Col sm={1}>
                                <button type="button" onClick={this.AddCategory} className="btn btn-success">Submit</button>
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
   
export default AddCategory;  