import fetch from 'isomorphic-fetch';

export function fetchTopStories(numberOfStories){
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then(response => response.json())
        .then(json => {
            const stories = {
                fetched:json.slice(0,numberOfStories),
                unfetched: json.slice(numberOfStories)
            }

            return stories;
        })
}
