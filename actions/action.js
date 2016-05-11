import fetch from 'isomorphic-fetch';
import {fetchTopStories} from './fetchActions';
//Async Actions for fetching
export const FETCH_REQUEST_START = 'FETCH_REQUEST_START';
export const FETCH_REQUEST_SUCCESS = 'FETCH_REQUEST_SUCCESS';
export const FETCH_REQUEST_FAILED = 'FETCH_REQUEST_FAILED';
export const PREPARE_POST_CONTAINERS = 'PREPARE_POST_CONTAINERS';

export const UPDATE_POSTS = 'UPDATE_POSTS';
export const RENDER_POST = 'RENDER_POST';
export const RESET_PAGE = 'RESET_PAGE';

export const AUTO_UPDATE_OFF = 'AUTO_UPDATE_OFF';
export const AUTO_UPDATE_ON = 'AUTO_UPDATE_ON';

export function updatePosts(newsList){
    return {
        type:UPDATE_POSTS,
        newsList
    }
}

export function renderPost(newsList){
    return {
        type:RENDER_POST,
        newsList
    }
}

function fetchStart(fetchStatus){
    return {
        type:FETCH_REQUEST_START,
        fetchStatus
    }
}

function fetchFinish(){
    return {
        type:FETCH_REQUEST_SUCCESS
    }
}

function preparePostContainers(fetchedList,unfetchedList){
    return {
        type:PREPARE_POST_CONTAINERS,
        fetchedList,
        unfetchedList
    }
}

function resetPage(fetchedList,unfetchedList){
    return {
        type:RESET_PAGE,
        fetchedList,
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
export function fetchPosts(state,numberOfFetch){
    return (dispatch)=>{
        dispatch(fetchStart(state))
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(response => response.json())
            .then(json => {
                const topTenNewsIds = json.slice(0,numberOfFetch);
                const unfetchedList = json.slice(numberOfFetch);

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

export function reRenderPage(fetchState,newsState){
    return (dispatch)=>{
        dispatch(fetchStart(fetchState));
        fetchTopStories(10)
            .then((listOfFetchedStories)=>{
                dispatch(resetPage(listOfFetchedStories.fetched,listOfFetchedStories.unfetched));
                fetchInBulk(listOfFetchedStories.fetched,(fetchedStory)=>{
                    dispatch(renderPost([fetchedStory]));
                }).then(()=>{
                    dispatch(fetchFinish());
                })
            })
    }
}

export function updateEvery(bool,interval){
    const updateTrigger = (bool)=>{
        return bool?AUTO_UPDATE_ON:AUTO_UPDATE_OFF
    };

    return {
        type:updateTrigger(bool),
        interval
    }
}
