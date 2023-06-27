import { UserInterface } from 'interfaces/user';
import { EventInterface } from 'interfaces/event';
import { GetQueryInterface } from 'interfaces';

export interface CheckInInterface {
  id?: string;
  user_id?: string;
  event_id?: string;
  drink_coupons?: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  event?: EventInterface;
  _count?: {};
}

export interface CheckInGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  event_id?: string;
}
