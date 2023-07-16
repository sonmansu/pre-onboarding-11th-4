import axios, { AxiosResponse } from 'axios';
import { Sick } from '../utils/types';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/',
});

export const searchAPI = async (
  keyword: string,
): Promise<AxiosResponse<Sick[]>> => {
  const result = await axiosInstance.get('/sick', {
    params: { q: keyword },
  });

  return result;
};
