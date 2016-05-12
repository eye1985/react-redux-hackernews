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

export function bulkFetchSingle(arrayOfIds,callback){
    const fetchPromise = new Promise((res,rej)=>{
        arrayOfIds.forEach((id,pos)=>{
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


export function bulkFetch(arrayOfIds) {
    let fetchTool = (maxNum,res)=>{
        let stories = {};
        let counter = 0;

        return {
            addStory:(id,story)=>{
                stories[id] = story;
                counter++;

                if(counter === maxNum){
                    res(stories);
                }
            },
            getStoriesCount:()=>counter
        }
    };

    const fetchPromise = new Promise((res,rej)=>{
        const storyCounter = fetchTool(arrayOfIds.length,res);

        arrayOfIds.forEach((id,pos)=>{
            let fetchUrl = 'https://hacker-news.firebaseio.com/v0/item/'+ id +'.json?print=pretty';
            fetch(fetchUrl)
                .then(response => response.json())
                .then(json =>{
                    storyCounter.addStory(id,json);
                });
        });
    });

    return fetchPromise;
}
