import fetch from 'isomorphic-fetch';
//Async Actions for fetching
export const FETCH_REQUEST_START = 'FETCH_REQUEST_START';
export const FETCH_REQUEST_SUCCESS = 'FETCH_REQUEST_SUCCESS';
export const FETCH_REQUEST_FAILED = 'FETCH_REQUEST_FAILED';
export const PREPARE_POST_CONTAINERS = 'PREPARE_POST_CONTAINERS';

export const RENDER_POST = 'RENDER_POST';

export function renderPost(newsList){
    return {
        type:RENDER_POST,
        newsList
    }
}

function fetchStart(postByHnews){
    return {
        type:FETCH_REQUEST_START,
        postByHnews
    }
}

function fetchFinish(){
    return {
        type:FETCH_REQUEST_SUCCESS
    }
}

function preparePostContainers(postByHnews,unfetchedList){
    return {
        type:PREPARE_POST_CONTAINERS,
        postByHnews,
        unfetchedList
    }
}

function fetchInBulk(arrayOfIds,callback){
    const fetchPromise = new Promise((res,rej)=>{
        arrayOfIds.map((id,pos)=>{
            let fetchUrl = 'https://hacker-news.firebaseio.com/v0/item/'+ id +'.json?print=pretty';
            fetch(fetchUrl)
                .then(response => response.json())
                .then(json =>{
                    callback(json);
                    if(pos+1 === arrayOfIds.length){
                        res('finished');
                    }
                })
        });
    });

    return fetchPromise;
}

export function showMorePosts(state){
    return (dispatch)=>{
        const nextWaveOfNewsList = state.viewPost.unfetchedList.slice(0,10);
        const unfetchedList = state.viewPost.unfetchedList.slice(10);

        dispatch(fetchStart(state));
        dispatch(preparePostContainers(nextWaveOfNewsList,unfetchedList));

        fetchInBulk(nextWaveOfNewsList,(json)=>{
            dispatch(renderPost([json]))
        }).then(()=>{
            dispatch(fetchFinish());
        })
    }
}

//thunk action creator
export function fetchPosts(state){
    return function(dispatch){
        dispatch(fetchStart(state))
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(response => response.json())
            .then(json => {
                const topTenNewsIds = json.slice(0,10);
                const unfetchedList = json.slice(10);

                dispatch(preparePostContainers(topTenNewsIds,unfetchedList));
                return topTenNewsIds;
            })
            .then((topTenNewsIds)=>{
                fetchInBulk(topTenNewsIds,(json)=>{
                    dispatch(renderPost([json]));
                }).then(()=>{
                    dispatch(fetchFinish());
                })
            });
    }
}
