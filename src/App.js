import React from 'react';
import Request from 'superagent';
import GoogleLogin from 'react-google-login';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      error: '',
      name: '',
      email: '',
      target: '',
      participants: [],
      data: null
    }

    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    //make those MF API calls BOIIIIII
    Request.get("https://nchsassassin.com/participants")
    .then((res) => {
      let participantsArr = [];
      for(let participant of res.body){
        participantsArr.push(participant["name"]);
      }
      this.setState({
        data: res.body,
        participants: participantsArr
      });
    });
  }

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const name = profile.getName().toLowerCase();
    const email = profile.getEmail();
    const emailSubdomain = email.substring(email.indexOf("@"));

    //javier clayton dumbass check    
    if(email.toLowerCase() === "javier.d.clayton@gmail.com"){ 
      name = "javier clayton"
    }
    
    // not signed in with student email (with added javi check)
    if(emailSubdomain !== "@apps.nsd.org" && email.toLowerCase() !== "javier.d.clayton@gmail.com"){
      this.setState({
        error: 'non_nsd'
      })
    } else if(!this.state.participants.includes(name)){ //not a participant
      this.setState({
        error: 'non_participant'
      });
    } else {
      //api get request for persons target
      const url = "https://nchsassassin.com/participants/" + name;
      const Cryptr = require('cryptr');
      const cryptr = new Cryptr('4t7w!z%C&F)J@NcRfUjXn2r5u8x/A?D(');

      Request.get(url)
      .then((res) => {
        let target = res.body["target"];
        try {
          target = cryptr.decrypt(target);
        } catch(e) {
          target = "blank";
        }

        this.setState({
          loggedIn: true,
          error: '',
          name: name,
          target: target,
          email: email
        });
      });
    }
  }

  render() {
    //if logged in and no errors
    if(this.state.loggedIn && this.state.error === ''){
      return(
        <div className="App text-center container">
          <h1 className="display-4">NCHS Senior Assassin</h1>
          <p className="lead">Welcome back {this.state.name}</p>
          <p className="lead">your target for this week is {this.state.target}</p>
        
          <p style={{"position":"fixed", "bottom":"10px", "left": "50%", "transform": "translateX(-50%)", "width": "100%"}}>Website made by <a href="https://kylemumma.me">Kyle Mumma</a> and 
          <a href="https://linkedin.com/in/rishabhjain101"> Rishabh Jain</a></p>
        </div>
      );
    }

    //if not logged in or error
    let errorMessage = null;
    if(this.state.error === 'non_nsd'){
      errorMessage = <p className="alert alert-danger">Error: You must log in with your apps.nsd.org student email</p>
    } else if(this.state.error === 'non_participant'){
      errorMessage = <p className="alert alert-danger">
                        Error: You are not registered for Senior Assassin,
                        if this is an error please contact Monica Potts on instagram
                        <a href="https://www.instagram.com/monicapottts" target="_blank"> @monicapottts</a>
                      </p>
    }

    return (
      <div className="App text-center container">
        <h1 className="display-4">NCHS Senior Assassin</h1>

        {errorMessage}
        <GoogleLogin
          clientId="406456758580-snl7rfngdoidunla1jsanccm1l9odi8i.apps.googleusercontent.com"
          buttonText="Sign In with Google"
          onSuccess={this.onSignIn}
          onFailure={this.onSignIn}
          cookiePolicy={'single_host_origin'}
        />

        <p style={{"position":"fixed", "bottom":"10px", "left": "50%", "transform": "translateX(-50%)", "width": "100%"}}>Website made by <a href="https://kylemumma.me">Kyle Mumma</a> and 
          <a href="https://linkedin.com/in/rishabhjain101"> Rishabh Jain</a></p>
      </div>
    );
  }
}

export default App;
