import React from 'react';
import AddTicket from './component/AddTicket';
import AddCategory from './component/AddCategory';
import PaginationTicketList from './component/PaginationTicketList';
import AssignedTicketList from './component/AssignedTicketList';
import OwnedTicketList from './component/OwnedTicketList';
import Login from './component/login/Login';
import useLocalStorage from './component/utils/useToken';
import {BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import {Button} from 'reactstrap';


function App() {  
  const { token, setToken,username,deleteToken } = useLocalStorage();

  function handleLogout(){
    deleteToken();
    window.location.reload();
  }
  if(!token){
    return <Login setToken={setToken}/>
  }
  return (  
    <Router>  
      <div className="container">  
        <nav className="navbar navbar-expand-lg navheader">  
          <div className="collapse navbar-collapse" >  
            <ul className="navbar-nav mr-auto">  
              <li className="nav-item">
                <p>Welcome, {username}!</p>
              </li>
              <li className="nav-item">  
                <Link to={'/AddTicket'} className="nav-link">Add Ticket</Link>  
              </li>  
              <li className="nav-item">  
                <Link to={'/AddCategory'} className="nav-link">Add Category</Link>  
              </li>
              <li className="nav-item">  
                <Link to={'/Page'} className="nav-link">Ticket List</Link>  
              </li>
              <li className="nav-item">
                <Link to={'/Assigned'} className="nav-link">Assigned Tickets</Link>
              </li>
              <li className="nav-item">
                <Link to={'/Owned'} className="nav-link">Owned Tickets</Link>
              </li>
              <li className="nav-item">  
                <Button onClick={handleLogout} color="danger" className="nav-link">Logout</Button>  
              </li>  
            </ul>  
          </div>  
        </nav> <br />  
        <Switch>  
          <Route exact path='/AddTicket'><AddTicket/></Route>
          <Route path='/AddCategory'><AddCategory/></Route>
          <Route path='/Page'><PaginationTicketList/></Route>
          <Route path='/Assigned'><AssignedTicketList/></Route>
          <Route path='/Owned'><OwnedTicketList/></Route>
        </Switch>  
      </div>  
    </Router>  
  );  
}  

export default App;
