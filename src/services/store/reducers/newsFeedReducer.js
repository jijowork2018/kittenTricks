import {
  DELETE_NEWS,
  CREATE_NEWS,
  UPDATE_NEWS,
  SET_NEWS
} from '../actions/newsFeedAction';
import NewsFeed from '../../models/NewsFeed';

const initialState = {
  availableNews: [],
  userNews: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        availableNews: action.newsFeed,
      };
    case CREATE_NEWS:
      const newNews = new NewsFeed(
        action.newsData.id,
        action.newsData.ownerId,
        action.newsData.title,
        action.newsData.imageUrl,
        action.newsData.description,
        action.newsData.price
      );
      return {
        ...state,
        availableProducts: state.availableNews.concat(newNews),
        userProducts: state.userNews.concat(newNews)
      };
    case UPDATE_NEWS:
      const productIndex = state.userNews.findIndex(
        prod => prod.id === action.pid
      );
      const updatedNews = new NewsFeed(
        action.pid,
        state.userNews[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userNews[productIndex].price
      );
      const updatedUserNews = [...state.userNews];
      updatedUserNews[productIndex] = updatedNews;
      const availableProductIndex = state.availableNews.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableNews = [...state.availableNews];
      updatedAvailableNews[availableProductIndex] = updatedNews;
      return {
        ...state,
        availableProducts: updatedAvailableNews,
        userProducts: updatedUserNews
      };
    case DELETE_NEWS:
      return {
        ...state,
        userProducts: state.userNews.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.availableNews.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};
