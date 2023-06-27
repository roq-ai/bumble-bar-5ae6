import * as yup from 'yup';

export const checkInValidationSchema = yup.object().shape({
  drink_coupons: yup.number().integer().required(),
  user_id: yup.string().nullable(),
  event_id: yup.string().nullable(),
});
