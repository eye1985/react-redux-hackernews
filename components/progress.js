import React,{Component} from 'react';
import {connect} from 'react-redux';

export default class ProgressBar extends Component {
    // let progressBar = (isFetching)?<ProgressBar />:undefined;
    render() {
        const {isFetching,isFailed,isComplete} = this.props.fetchStatus;
        const classStr = (isComplete)?'progress no-margin alwaysOnTop hide':'progress no-margin alwaysOnTop';

        return(
            <div className={classStr}>
                <div className="indeterminate"></div>
            </div>
        )
    }
}


function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps)(ProgressBar);
