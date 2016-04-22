import {combineReducers} from 'redux';
import {
    FETCH_REQUEST_START,
    FETCH_REQUEST_SUCCESS,
    FETCH_REQUEST_FAILED,
    PREPARE_POST_CONTAINERS,
    RENDER_POST
} from '../actions/asyncFetch';

const fetchState = {
    isFetching:false,
    isCompleted:false,
    isFailed:false
};

const newsState = {
    newsList : [],
    unfetchedList:[]
}

function postByHnews(state=fetchState,action){
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
            action.postByHnews.map((id)=>{
                listOfPost.push({
                    id:id,
                    isComplete:false
                })
            });

            return Object.assign({},state,{
                newsList:listOfPost,
                unfetchedList:action.unfetchedList
            })
        case RENDER_POST:
            let copyOfNewList = state.newsList.slice(0);
            let posOfPost = copyOfNewList.findIndex((item)=>{
                return item.id === action.newsList[0].id
            });

            copyOfNewList[posOfPost] = action.newsList[0];
            return Object.assign({},state,{
                newsList:copyOfNewList
            })
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    postByHnews,
    viewPost
});

export default rootReducer;
