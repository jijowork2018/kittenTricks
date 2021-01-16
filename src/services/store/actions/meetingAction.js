import Meeting from '../../models/Meeting';

export const DELETE_MEETING = 'DELETE_MEETING';
export const CREATE_MEETING = 'CREATE_MEETING';
export const UPDATE_MEETING = 'UPDATE_MEETING';
export const SET_MEETING = 'SET_MEETING';

export const fetchMeeting = () => {
  
  return async (dispatch, getState) => {
    
    // any async code you want!
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    
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
        'https://mtc-cmys-app.herokuapp.com/api/v1/meetings/  ',data              
        
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      console.log("initial meeting data====",resData)
      
      const loadedMeeting = [];
     
      for (const key in resData) {
        
        loadedMeeting.push(
          new Meeting(
            resData[key].meetingId,
            resData[key].meetingAddress,
            resData[key].meetingArea,
            resData[key].meetingDate,
            resData[key].meetingInfo,
            resData[key].onlineLink,
            resData[key].onlineMeeting,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].parent,
          )
        );
      }

      dispatch({
        type: SET_MEETING,
        meeting: loadedMeeting,
        
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteMeeting = meetingId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/new/${meetingId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_MEETING, pid: meetingId });
  };
};



export const createMeeting = ( meetingDto) => {
  return async (dispatch, getState) => {
    // any async code you want!
    console.log("dto===========",meetingDto)
    
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
          meetingId:meetingDto.meetingId,
          meetingAddress:meetingDto.meetingAddress,
          meetingDate:meetingDto.meetingDate,
          meetingInfo:meetingDto.meetingInfo,
          meetingDate:meetingDto.meetingDate,
          onlineLink:meetingDto.onlineLink,
          onlineMeeting:meetingDto.onlineMeeting,
          latitude:meetingDto.latitude,
          longitude:meetingDto.longitude,
          parent:meetingDto.parent,          
         })
      }
      const response = await fetch(
        'https://mtc-cmys-app.herokuapp.com/api/v1/meetings',data              
        
      );


    const resData = await response.json();
    console.log("in res data await",resData)

    dispatch({
      type: CREATE_MEETING,
      meetingData: {
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


export const updateMeeting = (meetingId, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/new/${meetingId}.json?auth=${token}`,
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
      type: UPDATE_MEETING,
      meetingId: meetingId,
      meetingData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
