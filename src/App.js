/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

      //add data retrieved to the debit list array to pass down as props
      addCredit = ( amount, description, date) => {
        const nextCreditId = this.state.creditList.length + 1;
        //account for change in account balance by subtracting new entry from account balance
        const updatedBalance = this.state.accountBalance - parseFloat(amount);
        //create object to be added to the array
        const newCredit = { id: nextCreditId, amount,description, date };
        //add the object in the debtList array
        //update state for accountBalance
        this.setState(prevState => ({
          accountBalance: updatedBalance,
          creditList: [...prevState.creditList, newCredit]
        }));
      };

      //method to add data to debitList array
      addDebit = (description,amount, date) => {
        //need to keep track of ids and pass to array
        const nextDebitId = this.state.creditList.length + 1;
        //will perform math for "deposits"
        const updatedBalance = this.state.accountBalance + parseFloat(amount);
        //create object to be added to the array
        const newDebit = { id: nextDebitId, description, amount, date };
        //add the object in the debtList array
        this.setState(prevState => ({
          accountBalance: updatedBalance,
          debitList: [...prevState.debitList, newDebit]
        }));
      }

    //componentDidMount method that makes API calls to access necessary data for other components
    componentDidMount () {
      //access relevant data to be added to creditlist array
      fetch('https://johnnylaicode.github.io/api/credits.json')
      .then((response) => response.json())
      .then((data) => {
        //counter for sum of credits
        let totalCredits = 0;
        for (const credit of data) {
          //sum each time
          totalCredits += parseFloat(credit.amount);
        }
  
        // Update balance by subtracting totalCredits
        this.setState((prevState) => ({
          creditList: data,
          accountBalance: prevState.accountBalance - totalCredits
        }));
      });

      //access data to be added to debitlist array 
      fetch('https://johnnylaicode.github.io/api/debits.json')
      .then((response) => response.json())
      .then((data) => {
        // Calculate totalDebits from fetched data
        let totalDebits = 0;
        for (const debit of data) {
          totalDebits += parseFloat(debit.amount);
        }
        this.setState({ debitList: data, totalDebits });
      });

    }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    //pass down addCredit method to child
    const CreditsComponent = () => (
      <Credits 
      credits = {this.state.creditList} 
      addCredit = {this.addCredit}
      accountBalance = {this.state.accountBalance}
      />) 

    //pass down addDebit method to child
    const DebitsComponent = () => (
      <Debits 
      debits = {this.state.debitList} 
      addDebit = {this.addDebit}
      accountBalance = {this.state.accountBalance}
      />) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      // <Router basename="/bank-of-react-starter-code">
      <Router basename="/Assignment-3">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;