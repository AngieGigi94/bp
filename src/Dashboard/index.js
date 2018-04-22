import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import DashBoardStatusContainer from './Status';
import DashBoardNotification from './Notification';
import DashBoardMenu from './Menu';
import MenuGroups from './Menu/MenuGroups.jsx';
import MenuSetting from './Menu/Setting';
import openSocket from 'socket.io-client';
import AuthService from '../utils/authService';
import withAuth from '../utils/withAuth';
import './dashboard.css';


const DashBoardTimeOut = ({validation, history}) => {
    return (
        <div>
        { validation.code === 401 ? 
                <div className="dashboard-timeout">
                    <div className="dashboard-timeout-content">
                            <h1> {validation.message} </h1>
                            <button onClick={() => history.push('/')}> Login to continue </button>
                    </div>
                </div> : null }  
        </div>
    );
};

const DashBoardDataChange = ({isActiveClass}) => {
    return (
        <div className="dashboard-change-notificaiton">
            <div className={`dashboard-change-content ${isActiveClass}`}>
            <FontAwesomeIcon className="change-icon" icon="save"/>
                    <h1>Account updated!</h1>
            </div>
        </div> 
    );    
};



class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            validation: {
                message: null,
                type: null,
                code: null
            },
            isActiveClass: 'nonactive-class'
        };
        this.authUtil = new AuthService();
        this.timeOut;
    }
    

    
    initLogout = () => {
         this.authUtil.logout();
    }
    
    
    validate = (res) => {
        if(res.code === 401) {
            this.setState({
                validation: {
                    message: res.message,
                    type: res.type,
                    code: res.code
                }
            }, this.initLogout());
            
            return;
        } 
    }
    
    removeChageNotification = () => {
        this.setState({
            isActiveClass: 'nonactive-class'
        });
        clearTimeout(this.timeOut);
    }
    
    dataChange = (newData, originalData) => {
        this.setState({
            isActiveClass: 'active-class'
        });
        
        this.timeOut = setTimeout(() => {
          this.removeChageNotification();
        }, 3000);
    }
    
    render(){
        const { validation,  isActiveClass } = this.state;
        return(
            <div className="dashboard-wrapper">
            <DashBoardTimeOut validation={validation} {...this.props}/>
            <DashBoardDataChange isActiveClass={isActiveClass}/>
                <div className="dashboard-main-content">
                    <DashBoardMenu props={this.props}/>
                    <DashBoardNotification/>
                       <Route path="/dashboard/setting" render={(props) => <MenuSetting dataChange={this.dataChange} {...this.props}/>}/>
                       <Route path="/dashboard/feed" render={(props) =>  <DashBoardStatusContainer validate={this.validate} {...this.props}/>}/>
                </div>
            </div>
        );
    }
    
}
export default withAuth(DashBoard);