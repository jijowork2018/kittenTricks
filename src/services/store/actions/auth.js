import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const USERDATA = 'USERDATA';

let timer;

export const authenticate = (churchId, token,roles) => {
  return dispatch => {
    
    dispatch({ type: AUTHENTICATE, churchId: churchId, token: token,roles: roles});
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBY8UJq_xLD0nEe1HZHuvEOUfYIS9gg4pA',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (username, password) => {
  console.log("in login  method================",username,password)
  return async dispatch => {
    let data = {
      method: 'POST',
      
      body: JSON.stringify({
        username: username,
        password:password
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        
      }
    }
    const response = await fetch(
      'https://mtc-cmys-app.herokuapp.com/api/v1/authenticate',data              
      
    );
      console.log("response",response)
    
    if (!response.ok) {
      const errorResData = await response.json();
      console.log("erorr response=======",errorResData)
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log("response===========",resData);
    dispatch(
      authenticate(
        resData.churchId,
        resData.jwtToken,
        resData.roles,
        
      )
    );
    
    saveDataToStorage(resData.jwtToken , resData.churchId, resData.roles);
  };
};

export const logout = () => {

  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};


const saveDataToStorage = (token, churchId, roles) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      churchId: churchId,
      roles: roles
    })
  );
};

export const  getUserDataFromStorage=()=> {
  return async (dispatch, getState) => {
  
    const userData="";
  AsyncStorage.getItem('userData')
  dispatch({
    type: USERDATA,
    token: AsyncStorage.getItem('userData'),
  });
   
  }
}
  
