export const SUBMIT_FORM = 'SUBMIT_FORM';
export const CLICK = 'CLICK';
export const TIMEUP = 'TIMEUP';

export const submitForm = payload => ({
  type: SUBMIT_FORM,
  payload,
});

export const click = () => ({
  type: CLICK,
});

export const timeup = () => ({
  type: TIMEUP,
});
