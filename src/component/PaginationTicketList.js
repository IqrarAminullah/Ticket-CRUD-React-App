import React, { Component } from "react";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";

export default class TicketList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTicket = this.onChangeSearchTicket.bind(this);
    this.onChangeSearchStatus = this.onChangeSearchStatus.bind(this);
    this.retrieveTickets = this.retrieveTickets.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTicket = this.setActiveTicket.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

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
      categoryList : []
    };

    this.pageSizes = [3, 6, 9, 12];
  }

  componentDidMount() {
    this.retrieveTickets();
    this.getCategories();
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

  onStatusChange(e){
    const newStatus = e.target.value;

    this.setState({
        selectedStatus : newStatus
    })
  }


  retrieveTickets() {
    const { searchTicketName, page, pageSize,searchStatusId } = this.state;

    axios.get(process.env.REACT_APP_API_URL+"/api/Ticket/?"+
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



  render(){
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


    const renderCategoryList = () =>{
        return this.state.categoryList.find(x => x.categoryId === this.state.currentTicket.categoryId).categoryName;
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
                  {currentTicket.ticketName}
                </div>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentTicket.description}
                </div>
                <div>
                  <label>
                    <strong>Category:</strong>
                  </label>{" "}
                  {renderCategoryList()}
                </div>
                <div>
                  <label>
                    <strong>Owner:</strong>
                  </label>{" "}
                  {currentTicket.owner.username}
                </div>
                <div>
                  <label>
                    <strong>Assigned To:</strong>
                  </label>{" "}
                  {currentTicket.assignee.username}
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
