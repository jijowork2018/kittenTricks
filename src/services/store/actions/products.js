import Product from '../../models/product';
import NewsFeed from '../../models/NewsFeed';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';



export const fetchProducts = () => {
  console.log("fetching products============")
  return async (dispatch, getState) => {
    console.log("fetching products============")
    // any async code you want!
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    console.log("token=====",token)
    try {
      let data = {
        method: 'GET',
        
       
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+token,
        }
      }
      const response = await fetch(
        'https://mtc-cmys-app.herokuapp.com/api/v1/members',data              
        
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();

      
      const loadedProducts = [];
      loadedProducts=resData;
      for (const key in resData) {
        console.log("kery====",key)
        loadedProducts.push(
          new Product(
            resData[key].newsFeedId,
            resData[key].newsHeading,
            resData[key].newsSubHeading,
            resData[key].newsInfo,
            resData[key].newsDate,
            resData[key].eventDate
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts
      });
    } catch (err) {
      console.log("error in dispatch method===========",err)
      // send to custom analytics server
      throw err;
    }
  };
};


export const fetchNews = () => {
  
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
        }
      }
      const response = await fetch(
        'https://mtc-cmys-app.herokuapp.com/api/v1/newsFeeds',data              
        
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();

      
      const loadedProducts = [];
     
      for (const key in resData) {
        
        
        loadedProducts.push(
          new NewsFeed(
            
            resData[key].newsFeedId,
            resData[key].newsHeading,
            resData[key].newsSubHeading,
            resData[key].newsInfo,
            resData[key].newsDate,
            resData[key].eventDate
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};



export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide.firebaseio.com/products/${id}.json?auth=${token}`,
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
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
