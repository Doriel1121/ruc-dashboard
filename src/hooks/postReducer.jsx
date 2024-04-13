export const INITIAL_STATE = {
  loading: undefined,
  post: undefined,
  error: false,
};

export const postReducer = (state, action) => {
  switch (action.type) {
    case "START":
      return {
        loading: true,
        post: {},
        error: false,
      };
    case "SUCCESS":
      return {
        loading: false,
        post: action.payload,
        error: false,
      };
    case "ERROR":
      return {
        loading: false,
        post: {},
        error: true,
      };

    default:
      return {
        loading: false,
        post: {},
        error: false,
      };
  }
};
