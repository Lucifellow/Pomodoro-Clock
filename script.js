

//reset button component
class Reset extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){
        return(
            <button id="reset" onClick={this.props.handleReset} ><i className="fas fa-redo"></i></button>
        );
    }

}


//start/stop button component
class StartStop extends React.Component {
    constructor(props) {
        super(props);
      }

    render(){
        return(
            <button id="start_stop" onClick={this.props.handleStartStop}><i className="fas fa-play"></i><i className="fas fa-stop"></i></button>
        );
    }
}

//Main parent component
class MainComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state={
          breakVal:5,
          sessionVal:25,
          totalSeconds:1500,
          secondsLeft:"",
          isPlaying:false,
          countType:"Session"   
      }

      this.handleReset=this.handleReset.bind(this);
      this.handleBreakDecrement=this.handleBreakDecrement.bind(this);
      this.handleBreakIncrement= this.handleBreakIncrement.bind(this);
      this.handleSessionDecrement=this.handleSessionDecrement.bind(this);
      this.handleSessionIncrement=this.handleSessionIncrement.bind(this);
      this.handleStartStop=this.handleStartStop.bind(this);
    }

    //handles reset button click
    handleReset(){
       this.setState({
            breakVal:5,
            sessionVal:25,
            totalSeconds:1500,  // (session minutes)25*60
            isPlaying:false,
            countType:"Session"  
        })
        $("#beep")[0].pause();      //pause audio
        $("#beep")[0].currentTime=0;    //rewind it to 0
        clearInterval(this.state.secondsLeft);  //remove current interval

    }

    //handles break decrement
    handleBreakDecrement(){
        if(!this.state.isPlaying){      //only click buttons if no timer is on
            if(this.state.breakVal>1){  //only reduce break value until 1 min
                if(this.state.countType=="Break"){  //if current timer is break 
                    this.setState({
                        breakVal:this.state.breakVal-1
                    },()=>{
                        this.setState({
                            totalSeconds:this.state.breakVal*60
                        })
                    })
                }else if(this.state.countType=="Session"){  //if current timer is session dont update total seconds
                    this.setState({
                        breakVal:this.state.breakVal-1
                    })
                }
            }
        }
    }

    //handles break increment
    handleBreakIncrement(){
        if(!this.state.isPlaying){          //no timer is on
            if(this.state.breakVal<60){     // only increase mins until 60
                if(this.state.countType=="Break"){  //if current timer is break
                    this.setState({
                        breakVal:this.state.breakVal+1
                    },()=>{
                        this.setState({
                            totalSeconds:this.state.breakVal*60
                        })
                    })
                } else if(this.state.countType=="Session"){ //if current timer is session dont update total seconds
                    this.setState({
                        breakVal:this.state.breakVal+1
                    })
                }
            }
        }
    }

    //handle session decrement
    handleSessionDecrement(){
        if(!this.state.isPlaying){              //no timer is on 
                if(this.state.sessionVal>1){    //only decrease mins upto 1
                    if(this.state.countType=="Session"){    //if current timer is session
                        this.setState({
                            sessionVal:this.state.sessionVal-1
                        },()=>{
                            this.setState({
                                totalSeconds:this.state.sessionVal*60
                            });
                        });
                    }else if(this.state.countType=="Break"){    //if current timer is break dont update total seconds
                        this.setState({
                            sessionVal:this.state.sessionVal-1
                        });
                    }
                }
        }
    }

    //handle session increment
    handleSessionIncrement(){
        if(!this.state.isPlaying){ //no timer is on 
            if(this.state.sessionVal<60){   //only increase mins upto 60
                if(this.state.countType=="Session"){    //if current timer is session
                    this.setState({
                        sessionVal:this.state.sessionVal+1
                    },()=>{
                        this.setState({
                            totalSeconds:this.state.sessionVal*60
                        });
                    });
                }else if(this.state.countType=="Break"){        //if current timer is break
                    this.setState({
                        sessionVal:this.state.sessionVal+1
                    });
                }
            }
        }
    }

    //handles start and stop
    handleStartStop(){ 
        if(!this.state.isPlaying){ // if timer is paused or not playing 
            $("#timer-label").addClass("glowing");      //as soon as timer starts add css glowing class
            this.startCountDown();  //call helper func 
            this.setState({         
                isPlaying:true
            })
        }else if(this.state.isPlaying){     // if timer is playing stop it
            $("#timer-label").removeClass("glowing");   //remove glowing css class
            this.setState({
                isPlaying:false
            });
            clearInterval(this.state.secondsLeft);  // remove interval
        }
    }

    //starts countdown
    startCountDown(){
        this.setState({
            secondsLeft: setInterval(()=>{  //calls countDown and timeType every second
                this.countDown();
                this.timeType();
            },1000)
        });
    }

    //reduces totalSeconds to do countdown
    countDown(){
        this.setState({
            totalSeconds:this.state.totalSeconds-1
        })
    }

    //checks type of countdown
    timeType(){
        if(this.state.totalSeconds<=0){     //if seconds are 0 play sound
            $("#beep")[0].play();
        }
        if(this.state.totalSeconds<0){  //if seconds are 0 change type of time
            if(this.state.countType=="Session"){
            this.changeTimeType("Break");
            }else if(this.state.countType=="Break"){
                this.changeTimeType("Session");
            }

        }
    }

    //changes type of time 
    changeTimeType(type){
        clearInterval(this.state.secondsLeft); //remove interval  
        this.startCountDown();  //restart interval
        if(type=="Break"){  //check current type of time
            this.setState({
                countType:type,
                totalSeconds:this.state.breakVal*60 
            })
        }
        if(type=="Session"){
            this.setState({
                countType:type,
                totalSeconds:this.state.sessionVal*60
            })
        }
    }

    //shows time in proper format
    TimeConverter(){
            let mins=Math.floor(this.state.totalSeconds/60);    
            let seconds=this.state.totalSeconds%60;

                if(this.state.totalSeconds<=0){
                    return(`00:00`)
                }
                if(mins<10 && seconds<10){
                    return(`0${mins}:0${seconds}`);
                }else if(mins<10){
                    return(`0${mins}:${seconds}`);
                }else if(seconds<10){ 
                    return(`${mins}:0${seconds}`);
                }else{
                    return(`${mins}:${seconds}`);
                }   
                
    }

    //renders JSX components and child components
    render(){
        return(
            <div id="main">
                <div id="timer-label">
                    <h3 className="text-center">{this.state.countType}</h3>
                    <p className="text-center" id="time-left">{this.TimeConverter()}</p>
                </div>
                    <div id="break-label">
                        <h3 className="text-center">Break Length</h3>
                        <div className="row" id="break-container">
                            <button id="break-increment" onClick={this.handleBreakIncrement}><i className="fas fa-caret-square-up"></i></button>
                            <p id="break-length">{this.state.breakVal}</p>
                            <button id="break-decrement" onClick={this.handleBreakDecrement}><i className="fas fa-caret-square-down"></i></button>
                        </div>
                    </div>
                    <div  id="session-label">
                        <h3 className="text-center" >Session Length</h3>
                        <div className="row" id="session-container">
                            <button id="session-increment" onClick={this.handleSessionIncrement}><i className="fas fa-caret-square-up"></i></button>
                            <p  id="session-length">{this.state.sessionVal}</p>
                            <button id="session-decrement" onClick={this.handleSessionDecrement}><i className="fas fa-caret-square-down"></i></button>
                        </div>
                    </div>
                <div className="text-center" id="control-button-container">
                    <StartStop handleStartStop={this.handleStartStop}/>
                    <Reset handleReset={this.handleReset}/>
                    <audio id="beep" src="https://od.lk/s/NTNfMTU1Nzk5OTFf/445457__tec-studio__alarm-sound-003.wav"></audio>
                </div>
                
            </div>
        );
    }

}

ReactDOM.render(<MainComponent />,document.getElementById("container"));