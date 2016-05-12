import fetch from 'isomorphic-fetch';
import {fetchTopStories,bulkFetch,bulkFetchSingle} from './fetchActions';

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

export function updatePosts(viewPost){
    return {
        type:UPDATE_POSTS,
        viewPost
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

function sortStories(storiesArr,fetchedStories){
    let result=[];
    storiesArr.forEach((id,pos)=>{
        result.push(fetchedStories[id]);
    });

    return result;
}

export function showMorePosts(state){
    return (dispatch)=>{
        const nextWaveOfNewsList = state.viewPost.unfetchedList.slice(0,10);
        const unfetchedList = state.viewPost.unfetchedList.slice(10);

        dispatch(fetchStart(state));
        dispatch(preparePostContainers(nextWaveOfNewsList,unfetchedList));

        bulkFetchSingle(nextWaveOfNewsList,(json)=>{
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
                bulkFetchSingle(topTenNewsIds,(json)=>{
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
                // dispatch(resetPage(listOfFetchedStories.fetched,listOfFetchedStories.unfetched));
                bulkFetch(listOfFetchedStories.fetched)
                    .then((data)=>{
                        const result = {
                            newsList:sortStories(listOfFetchedStories.fetched,data),
                            unfetchedList:listOfFetchedStories.unfetched
                        }

                        dispatch(updatePosts(result))
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
