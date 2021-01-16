import NewsFeed from '../../models/NewsFeed';

export const DELETE_NEWS = 'DELETE_NEWS';
export const CREATE_NEWS = 'CREATE_NEWS';
export const UPDATE_NEWS = 'UPDATE_NEWS';
export const SET_NEWS = 'SET_NEWS';

export const fetchNews = () => {
  
  return async (dispatch, getState) => {
    
    // any async code you want!
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    if(!token){
      throw new Error("loginFailed")
    }
    try {
      let data = {
        method: 'GET',
        
       
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+token,
        },
      }
      const response = await fetch(
        'https://mtc-cmys-app.herokuapp.com/api/v1/newsFeeds',data              
        
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();

      
      const loadedNews = [];
     
      for (const key in resData) {
        
        
        loadedNews.push(
          new NewsFeed(
            resData[key].newsFeedId,
            resData[key].newsHeading,
            resData[key].newsSubHeading,
            resData[key].newsInfo,
            resData[key].newsDate,
            resData[key].eventDate,
            resData[key].edited,
            resData[key].lastEditedDate,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].church,
            resData[key].cloudFile,
          )
        );
      }

      dispatch({
        type: SET_NEWS,
        newsFeed: loadedNews,
        
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteNews = newsId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/new/${newsId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_NEWS, pid: newsId });
  };
};



export const createNews = ( newsFeedDto) => {
  return async (dispatch, getState) => {
    // any async code you want!
    console.log("dto===========",newsFeedDto)
    
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    
    try {
      let data = {
        method: 'POST',
        
       
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+token,
        },
        body: JSON.stringify({
          newsHeading:newsFeedDto.newsHeading,
          newsSubHeading:newsFeedDto.newsSubHeading,
          newsInfo:newsFeedDto.newsInfo,
          
         })
      }
      const response = await fetch(
        'https://mtc-cmys-app.herokuapp.com/api/v1/newsFeeds',data              
        
      );


    const resData = await response.json();
    console.log("in res data await",resData)

    dispatch({
      type: CREATE_NEWS,
      newsData: {
        resData
      }
    });    
  }
  catch (err) {
    // send to custom analytics server
    throw err;
  };
};
}


export const updateNews = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/new/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_NEWS,
      pid: id,
      newsData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
