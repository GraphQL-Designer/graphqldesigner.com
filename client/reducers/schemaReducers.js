import * as types from '../constants/actionTypes';

const initialState = {
  totalMarkets: 0,
  totalCards: 0,
  marketList: [],
  lastMarketId: 10000,
  newLocation: ''
};

const marketsReducer = (state = initialState, action) => {
  let marketList = state.marketList.slice();;
  let totalMarkets = state.totalMarkets;
  let totalCards = state.totalCards;
  let lastMarketId = state.lastMarketId;
  let newLocation = state.newLocation;


  switch(action.type) {
    case types.ADD_MARKET:
      lastMarketId++
      totalMarkets++
      const newMarket = {
          'lastMarketId': state.lastMarketId,
          'location': action.payload,
          'cards': 0,
          'percent': 0,
      }
      marketList.push(newMarket);
      return {
        ...state,
        marketList,
        lastMarketId,
        totalMarkets,
        newLocation: ''
      };

    case types.SET_NEW_LOCATION:
    return {
      ...state,
      marketList,
      lastMarketId,
      totalMarkets,
      newLocation: action.payload
    };

    case types.ADD_CARD:
    totalCards++
    marketList[action.payload].cards++
    // for (let i = 0; i< marketList.length; i++) {
    //   marketList[i].percent = ((marketList[i].cards / totalCards) * 100).toFixed(2)
    // }



    return {
      ...state,
      newLocation: '',
      totalCards,
      marketList,
      lastMarketId,
      totalMarkets,
      newLocation,
    };

    case types.DELETE_CARD:
    if (marketList[action.payload].cards > 0) {
       totalCards--
       marketList[action.payload].cards--
      //  for (let i = 0; i< marketList.length; i++) {
      //   marketList[i].percent = ((marketList[i].cards / totalCards) * 100).toFixed(2)
      // }
    }

    return {
      ...state,
      totalCards,
      marketList,
      lastMarketId,
      totalMarkets,
      newLocation,
    };

    default:
      return state;
  }
};

export default marketsReducer;