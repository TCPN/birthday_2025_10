// get / post data to AppScript API

const API_URL = 'https://script.google.com/macros/s/AKfycbxcOj_Nao45mzvuaep8ng-Ey45lszWKL4y73xuAyHK-_TvN0swfwsvq0ivelRR1Ycw87w/exec';

export async function fetchData<RetType, ParamType extends Record<string, string>>(params: ParamType): Promise<RetType> {
  const url = new URL(API_URL);
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key])
    }
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(`API error! message: ${result.message}`);
  }
  return result.data;
}

export async function postData<RetType, DataType = unknown | null>(data: DataType): Promise<RetType> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data ?? '')
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(`API error! message: ${result.message}`);
  }
  return result.data;
}

export interface ResponseData<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserData {
  userId: string;
  name: string;
  points: number;
  loginToken: string;
}

export type RegisterData = Pick<UserData, 'userId' | 'name'>;
export type LoginData = Pick<UserData, 'userId' | 'loginToken'>;

export function registerUser(userData: RegisterData): Promise<UserData> {
  return postData({ action: 'register', ...userData });
}

export function loginUser(userData: LoginData): Promise<UserData> {
  return fetchData({ action: 'login', ...userData });
}

export interface StuffRatings {
  name: string;
  rating: number;
  ratingCount: number;
}

export function getStuffs(): Promise<StuffRatings[]> {
  return fetchData({ action: 'items' });
}

export interface RatingAnswer {
  name: string;
  rating: number;
}

export interface UserRatingAnswers {
  userId: string;
  ratings: RatingAnswer[];
}

export function rateStuffs(data: UserRatingAnswers) {
  return postData({ action: 'rating', ...data });
}

export interface TransferAction {
  from: string;
  to: string;
  amount: number;
}

export function transferPoints(data: TransferAction) {
  return postData({ action: 'transfer', ...data });
}
