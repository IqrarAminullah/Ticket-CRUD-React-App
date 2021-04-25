import React, { Component } from "react";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";

export default class OwnedTicketList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTicket = this.onChangeSearchTicket.bind(this);
    this.onChangeSearchStatus = this.onChangeSearchStatus.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.retrieveTickets = this.retrieveTickets.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.setActiveTicket = this.setActiveTicket.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);


    this.state = {
      tickets: [],
      currentTicket: null,
      currentIndex: -1,
      searchTicketName: "",
      searchStatusId: 0,
      isEdit:false,
      selectedStatus: "",

      page: 1,
      count: 0,
      pageSize: 3,
      status :[
            {key:0,value:"None"},
            {key:1,value:"Open"},
            {key:2,value:"In Progress"},
            {key:3,value:"Done"},
            {key:4,value:"Closed"}
        ],
      userList :[],
      categoryList :[]
    };

    this.pageSizes = [3, 6, 9];
  }

  componentDidMount() {
    this.retrieveTickets();
    this.getCategories();
    this.getUsers();
  }

  onChangeSearchTicket(e) {
    const searchTicketName = e.target.value;

    this.setState({
      searchTicketName: searchTicketName,
    });
  }

  onChangeSearchStatus(e){
      const searchStatusId = e.target.value;

      this.setState({
          searchStatusId : searchStatusId
      })
  }

  updateTicket(e){
      var newTicket = this.state.currentTicket;
      let valid = true;
      for(const fields in newTicket){
        if(fields === null || fields === ""){
          valid =false;
        }
      }
      if(valid){
        this.sendNewTicket(newTicket);
      }
  }

  sendNewTicket(ticket){
    axios.put(process.env.REACT_APP_API_URL+"/api/Ticket/"+ticket.ticketId,ticket)
      .then((response) =>{
          this.setState({
              currentTicket : null
          })
          alert("Status updated successfully");
          this.retrieveTickets();
          this.toggleEdit();
      })
      .catch(error =>{
          alert(error.response);
      })
  }

  onStatusChange(e){
    const newStatus = e.target.value;

    this.setState({
        selectedStatus : newStatus
    })
  }

  onNameChange(e){
    const newName = e.target.value;

    this.setState(prevState =>{
      let newTicket = Object.assign({},prevState.currentTicket);
      newTicket.ticketName = newName;
      return {currentTicket : newTicket}
  })
  }

  onDescChange(e){
    const newDesc = e.target.value;

    this.setState(prevState =>{
      let newTicket = Object.assign({},prevState.currentTicket);
      newTicket.description = newDesc;
      return {currentTicket : newTicket}
  })
  }

  onUserChange(e){
    const newUID = e.target.value;

    this.setState(prevState =>{
      let newTicket = Object.assign({},prevState.currentTicket);
      newTicket.assigneeId = newUID;
      return {currentTicket : newTicket}
  })
  }

  onCategoryChange(e){
    const newCategoryId = e.target.value;

    this.setState(prevState =>{
        let newTicket = Object.assign({},prevState.currentTicket);
        newTicket.categoryId = newCategoryId;
        return {currentTicket : newTicket}
    })
  }


  retrieveTickets() {
    const { searchTicketName, page, pageSize,searchStatusId } = this.state;

    axios.get(process.env.REACT_APP_API_URL+"/api/Ticket/"+
    JSON.parse(localStorage.getItem('token')).id+
    "/owned/?"+
    "pageNumber="+page+
    "&pageSize="+pageSize+
    "&ticketName="+searchTicketName+
    "&status="+searchStatusId)
      .then((response) => {
        const { data, totalPages } = response.data;
        this.setState({
            tickets : data,
            count: totalPages
        })
      })
      .catch((e) => {
        alert("Failed to fetch items");
      });
  }

  getUsers =()=>{
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

  getCategories =()=>{
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

  refreshList() {
    this.retrieveTickets();
    this.setState({
      currentTicket: null,
      currentIndex: -1,
    });
  }

  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveTickets();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveTickets();
      }
    );
  }

  setActiveTicket(ticket, index) {
    this.setState({
      currentTicket: ticket,
      currentIndex: index,
      isEdit:false,
      selectedStatus:ticket.statusId
    });
  }

  toggleEdit() {
    this.setState({
        isEdit: !this.state.isEdit
    });
}

  render() {
    const {
        searchTicketName,
        searchStatusId,
        tickets,
        currentTicket,
        currentIndex,
        page,
        count,
        pageSize,
        isEdit
      } = this.state;

    const renderName = () =>{
      if(isEdit){
        return <input type="text" name="textName"onChange={this.onNameChange} placeholder={this.state.currentTicket.ticketName}></input>
      }else{
        return this.state.currentTicket.ticketName;
      }
    }

    const renderDesc = () =>{
      if(isEdit){
        return <input type="text" name="textName"onChange={this.onDescChange} placeholder={this.state.currentTicket.description}></input>
      }else{
        return this.state.currentTicket.description;
      }
    }

    const renderAssignedUser = () =>{
      if(isEdit){
        return <select onChange={this.onUserChange}>
          {this.state.userList.map(e =>
          <option key={e.userId} value={e.userId}>{e.username}</option>
          )}</select>
      }else{
        return this.state.userList.find(x => x.userId === this.state.currentTicket.assigneeId).username;
      }
    }

    const renderCategoryList = () =>{
      if(isEdit){
        return <select onChange={this.onCategoryChange} >
          {this.state.categoryList.map(e =>
          <option key={e.categoryId} value={e.categoryId}>{e.categoryName}</option>
          )}
          </select>
      }else{
        return this.state.categoryList.find(x => x.categoryId === this.state.currentTicket.categoryId).categoryName;
      }
    }

    const renderDate = () =>{
      return this.state.currentTicket.dateCreated.substr(0,this.state.currentTicket.dateCreated.indexOf('T'))
    }

    const renderStatus = () => {
      return this.state.status.find(x => x.key === this.state.currentTicket.status).value;
    }

    const renderStatusOptions = () =>{
        return this.state.status.map(e =><option key={e.key} value={e.key}>{e.value}</option>)
    }

    const renderEditButton = () =>{
        if(isEdit){
            return <button onClick={this.updateTicket} className="btn btn-success">Save</button>
        }else{
            return <button onClick={this.toggleEdit} className="btn btn-success">Edit</button>
        }
    }

  
      return (
        <div className="list row">
          <div className="col-md-8">
            <h4>Search by Title</h4>
            <div className="input-group mb-3">
              
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTicketName}
                onChange={this.onChangeSearchTicket}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.retrieveTickets}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <h4>Filter by Status</h4>
            <div className="input-group mb-3">
              <select
                className="form-control"
                placeholder="Search by status"
                value={searchStatusId}
                onChange={this.onChangeSearchStatus}
              >
                  {renderStatusOptions()}
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.retrieveTickets}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Ticket List</h4>
  
            <div className="mt-3">
              {"Items per Page: "}
              <select onChange={this.handlePageSizeChange} value={pageSize}>
                {this.pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
  
              <Pagination
                className="my-3"
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={this.handlePageChange}
              />
            </div>
  
            <ul className="list-group">
              {tickets &&
                tickets.map((ticket, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveTicket(ticket, index)}
                    key={index}
                  >
                    {ticket.ticketName}
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-md-6">
            {currentTicket ? (
              <div>
                <h4>Ticket Details</h4>
                <div>
                  <label>
                    <strong>Title Name:</strong>
                  </label>{" "}
                  {renderName()}
                </div>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {renderDesc()}
                </div>
                <div>
                  <label>
                    <strong>Category:</strong>
                  </label>{" "}
                  {renderCategoryList()}
                </div>
                <div>
                  <label>
                    <strong>Assigned To:</strong>
                  </label>{" "}
                  {renderAssignedUser()}
                </div>
                <div>
                  <label>
                    <strong>Created On:</strong>
                  </label>{" "}
                  {renderDate()}
                </div>
                <div>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {renderStatus()}
                </div>
                <div>
                  <div>
                    {renderEditButton()}
                  </div>
                  <div>
                    <button className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <br />
                <p>Click on a ticket to show details</p>
              </div>
            )}
          </div>
        </div>
      );
  }
}
