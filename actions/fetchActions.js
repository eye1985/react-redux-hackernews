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
    let stories = {};

    const fetchPromise = new Promise((res,rej)=>{

        arrayOfIds[0]

        arrayOfIds.forEach((id,pos)=>{
            let fetchUrl = 'https://hacker-news.firebaseio.com/v0/item/'+ id +'.json?print=pretty';
            fetch(fetchUrl)
                .then(response => response.json())
                .then(json =>{

                    if(json === undefined){
                        console.warn(id,'undefined here');
                    }
                    stories[id]=json;

                    if(pos+1 === arrayOfIds.length){
                        return stories;
                    }
                })
                .then((preparedStories)=>{

                    let counter=0;
                    for(var key in preparedStories){
                        counter++;
                    }
                    console.log(counter);
                })
        });
    });

    return fetchPromise;
}
