import React,{Component} from 'react';
import {connect} from 'react-redux';
import {reRenderPage,updateEvery} from '../actions/action';

class Header extends Component{
    render(){
        return(
            <header>
                <nav className="orange darken-1">
                    <div className="container">
                        <div className="nav-wrapper">
                            <a href="/" className="brand-logo">
                                <div className='hnLogo left'>
                                    Y
                                </div>
                                Hacker news
                            </a>
                            <ul className="right hide-on-med-and-down">
                                <li>
                                    <div className="switch">
                                        <label className="white-text">
                                            Off
                                            <input type="checkbox" onChange={(event)=>{
                                                const isChecked = event.target.checked;
                                                let intervalUpdater;
                                                if(isChecked){
                                                    intervalUpdater = setInterval(()=>{
                                                        this.props.dispatch(reRenderPage(this.props.fetchStatus,this.props.viewPost));
                                                    },30000);
                                                }

                                                this.props.dispatch(updateEvery(isChecked,intervalUpdater))
                                            }} />
                                            <span className="lever"></span>
                                            Update every 30 seconds
                                        </label>
                                    </div>
                                </li>
                                <li><a className="waves-effect waves-light btn" onClick={()=>{
                                    this.props.dispatch(reRenderPage(this.props.fetchStatus,this.props.viewPost));
                                }}>Update</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps)(Header);
