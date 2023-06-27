import { CheckInInterface } from 'interfaces/check-in';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface EventInterface {
  id?: string;
  name: string;
  date: any;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  check_in?: CheckInInterface[];
  organization?: OrganizationInterface;
  _count?: {
    check_in?: number;
  };
}

export interface EventGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}
