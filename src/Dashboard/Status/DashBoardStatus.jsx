import React from 'react';
import DashBoardPostLayout from './DashBoardPostLayout.jsx';
import DashBoardStatusWrapper from './DashBoardStatusWrapper.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('/');


class DashBoardStatus extends React.Component{
    
    state = {
        getStatus: [],
        recentUpdates: [],
        error: null
    }
    
    
    componentDidMount(){
      this.props.util.fetch('/status', { 
         method: 'GET', 
         credentials: 'same-origin',
      })
      .then(res => {
        if(res.code === 401){
            this.props.timeOut(res);
            return;
        }
        this.setState({
          getStatus: res.data
        })
      })
      .catch(err => console.log(err));
        
        socket.on('statusInit', (data) => {
          const newStatuses = [data, ...this.state.getStatus];
          this.setState({
              recentUpdates: this.state.recentUpdates.concat(data),
              getStatus: newStatuses
          });
        });
        
        socket.on('statusDelete', (data) => {
            const state = this.state.getStatus;
            const filtered = state.filter(obj => obj._id !== data[0]._id);
            this.setState({
                getStatus: filtered
            });
        });
        
        socket.on('statusComment', (data) => {
            let mutator = [...this.state.getStatus];
            mutator = JSON.parse(JSON.stringify(mutator));
            const index =  mutator.findIndex(i => i._id === data._id);
            mutator[index].post_comments = data.post_comments;
            this.setState({
                getStatus: mutator
            })
        });
    }
    
    render(){
        const { getStatus, recentUpdates } = this.state;
        const { util, validate } = this.props;
        const updates = getStatus && getStatus.length || recentUpdates && recentUpdates.length ? 
            getStatus.map((cStatus, index) => {
                return (
                    <DashBoardStatusWrapper key={cStatus._id} {...this.props} validate={validate} util={util} cStatus={cStatus} user={this.props.user}/>  
                );
            }) : <DashBoardPostLayout/>;
        return (
           <div>
            {updates} 
           </div>
        );
    }
}


export default DashBoardStatus;