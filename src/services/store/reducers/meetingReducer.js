import {
    DELETE_MEETING,
    CREATE_MEETING,
    UPDATE_MEETING,
    SET_MEETING
  } from '../actions/meetingAction';
  import Meeting from '../../models/Meeting';
  
  const initialState = {
    availableMeeting: [],
    userMeeting: []
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_MEETING:
        return {
          availableMeeting: action.meeting,
        };
      case CREATE_MEETING:
        const newMeeting = action.meetingData
        return {
          ...state,
          currentMeetings: state.availableMeeting.concat(newMeeting),
        };
      case UPDATE_MEETING:
        const meetingIndex = state.userMeeting.findIndex(
          meeting => meeting.meetingId === action.meetingId
        );
        const updatedMeeting = action.meetingData
        const updatedUserMeeting = [...state.userMeeting];
        updatedUserMeeting[meetingIndex] = updatedMeeting;
        const availableProductIndex = state.availableMeeting.findIndex(
          meeting => meeting.meetingId === action.meetingId
        );
        const updatedAvailableMeeting = [...state.availableMeeting];
        updatedAvailableMeeting[availableProductIndex] = updatedMeeting;
        return {
          ...state,
          currentMeetings: updatedAvailableMeeting,
        };
      case DELETE_MEETING:
        return {
          ...state,
          
          currentMeetings: state.availableMeeting.filter(
            meeting => meeting.meetingId !== action.meetingId
          )
        };
    }
    return state;
  };
  