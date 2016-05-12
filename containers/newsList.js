import React,{Component} from 'react';
import {connect} from 'react-redux';
import {showMorePosts,updatePosts,reRenderPage} from '../actions/action';
import NewsItem from '../components/newsItem';

class NewsList extends Component{
    componentDidMount (){
        this.props.dispatch(reRenderPage(this.props.fetchStatus,this.props.viewPost));
    }
    render(){
        return(
            <div>
                <div className="container">
                    <div className="collection">
                        {
                            this.props.viewPost.newsList.map((item,i)=>{
                                const {id,title,type,url,score,by,time} = item;
                                let target;
                                if(url){
                                    target = '_BLANK';
                                }

                                return (
                                    <NewsItem key={i}
                                        pos={i}
                                        href={url || '#!'}
                                        title={title || 'Loading...'}
                                        target={target}
                                        score={score}
                                        by={by}
                                        time={time}
                                        type={type} />
                                )
                            })
                        }
                    </div>

                    <button className="waves-effect waves-light btn orange darken-4 right" type="button" onClick={()=>{
                        this.props.dispatch(showMorePosts(this.props));
                    }}>
                        More
                        <i className="material-icons right">forward_10</i>
                    </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps)(NewsList);
