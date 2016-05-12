import {combineReducers} from 'redux';
import {
    FETCH_REQUEST_START,
    FETCH_REQUEST_SUCCESS,
    FETCH_REQUEST_FAILED,
    PREPARE_POST_CONTAINERS,
    RENDER_POST,
    UPDATE_POSTS,
    RESET_PAGE,
    AUTO_UPDATE_ON,
    AUTO_UPDATE_OFF
} from '../actions/action';

const fetchState = {
    isFetching:false,
    isCompleted:false,
    isFailed:false
};

const updateFrequencyState = {
    interval:null
}

const newsState = {
    newsList : [],
    unfetchedList:[]
}

function updateFrequency(state=updateFrequencyState,action){
    switch(action.type){
        case AUTO_UPDATE_ON:
            return {
                interval: action.interval
            };
        case AUTO_UPDATE_OFF:
            clearInterval(state.interval);
            return {
                interval:null
            };
        default:
            return state;
    }
}

function fetchStatus(state=fetchState,action){
    switch(action.type){
        case FETCH_REQUEST_START:
            return Object.assign({},state,{
                isFetching:true,
                isComplete:false,
                isFailed:false
            });
        case FETCH_REQUEST_SUCCESS:
        return Object.assign({},state,{
            isFetching:false,
            isComplete:true,
            isFailed:false
        });
        case FETCH_REQUEST_FAILED:
            return state;
        default:
            return state;
    }
}

function viewPost(state=newsState,action){
    switch(action.type){
        case PREPARE_POST_CONTAINERS:
            let listOfPost = state.newsList.slice(0);
            action.fetchedList.map((id)=>{
                listOfPost.push({
                    id:id,
                    isComplete:false
                })
            });

            return Object.assign({},state,{
                newsList:listOfPost,
                unfetchedList:action.unfetchedList
            });
        case RESET_PAGE:
            let emptyNewsList = [];
            action.fetchedList.map((id)=>{
                emptyNewsList.push({
                    id:id,
                    isComplete:false
                })
            });

            return {
               newsList : emptyNewsList,
               unfetchedList:action.unfetchedList
            };
        case RENDER_POST:
            let copyOfNewList = state.newsList.slice(0);
            let posOfPost = copyOfNewList.findIndex((item)=>{
                return item.id === action.newsList[0].id
            });

            copyOfNewList[posOfPost] = action.newsList[0];
            return Object.assign({},state,{
                newsList:copyOfNewList
            })
        case UPDATE_POSTS:
            return Object.assign({},state,action.viewPost);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    fetchStatus,
    viewPost,
    updateFrequency
});

export default rootReducer;
