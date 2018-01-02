import { SUBMIT_FORM, CLICK, TIMEUP } from './actions';

const screenList = ['timeup', 'none', 'name', 'subject', 'slide'];

const defaultState = {
  screen: 'none',
  timeLimit: 5,
  presenters: [],
  presenterIndexs: [],
  subjects: [],
  subjectIndexs: [],
  slides: [],
  displayingSlide: 0,
  nowPresenting: 0,
};

export const reducer = (state = defaultState, action) => {
  console.log(state, action);
  switch (action.type) {
    case SUBMIT_FORM:
      return { ...state, ...action.payload };
    case CLICK: {
      // go to next screen (next to 'slide' is also 'slide')
      const screen = screenList[screenList.indexOf(state.screen) + 1] || 'slide';
      if (screen === 'slide') {
        return {
          ...state,
          screen,
          displayingSlide: (state.displayingSlide + 1) % state.slides.length,
        };
      }
      if (screen === 'none') {
        return { ...state, screen, nowPresenting: state.nowPresenting + 1 };
      }
      return { ...state, screen };
    }
    case TIMEUP:
      return { ...state, screen: 'timeup' };
    default:
      return state;
  }
};

export default reducer;
