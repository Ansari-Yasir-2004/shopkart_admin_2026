const initialState = {
  userAuth: false,
  user: {}
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_AUTH":
      return {
        ...state,
        userAuth: action.payload,
      };
      case "USER_LOGIN":
        return{
          ...state,
          user:action.payload
        }
         case "LOGOUT_USER":
      return {
        ...state,
        userAuth: false,
        user: {}
      };
      
    default:
      return state;
  }
};

export default myReducer;
