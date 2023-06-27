import axios from 'axios';
import queryString from 'query-string';
import { CheckInInterface, CheckInGetQueryInterface } from 'interfaces/check-in';
import { GetQueryInterface } from '../../interfaces';

export const getCheckIns = async (query?: CheckInGetQueryInterface) => {
  const response = await axios.get(`/api/check-ins${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCheckIn = async (checkIn: CheckInInterface) => {
  const response = await axios.post('/api/check-ins', checkIn);
  return response.data;
};

export const updateCheckInById = async (id: string, checkIn: CheckInInterface) => {
  const response = await axios.put(`/api/check-ins/${id}`, checkIn);
  return response.data;
};

export const getCheckInById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/check-ins/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCheckInById = async (id: string) => {
  const response = await axios.delete(`/api/check-ins/${id}`);
  return response.data;
};
