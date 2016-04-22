import React from 'react';

const NewsItem = (props)=>{
    const date = new Date(props.time * 1000);
    const hours = date.getHours();

    return(
        <a className="collection-item row amber lighten-5 black-text" href={props.href} target={props.target}>
            <div className="col s1">{props.pos+1}.</div>
            <div className="col s11">
                <strong>
                    {props.title}
                </strong>
                <div className="grey-text text-darken-1">
                    {props.score} points by {props.by} {hours} hours ago
                </div>
            </div>
        </a>
    )
}

export default NewsItem;
