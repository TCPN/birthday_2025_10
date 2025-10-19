// get / post data to AppScript API

let instance: ReturnType<typeof createUseApi> | null = null;

export function useApi() {
  if (!instance) {
    instance = createUseApi();
  }
  return instance;
}

export interface UserData {
  userId: string;
  name: string;
  points: number;
  loginToken: string;
}

export type RegisterData = Pick<UserData, 'userId' | 'name'>;
export type LoginData = Pick<UserData, 'userId' | 'loginToken'>;

export interface StuffRatings {
  name: string;
  rating: number;
  ratingCount: number;
}

export interface RatingAnswer {
  name: string;
  rating: number;
}

export interface UserRatingAnswers {
  userId: string;
  ratings: RatingAnswer[];
}

export interface TransferAction {
  from: string;
  to: string;
  amount: number;
}

export interface ResponseData<T> {
  success: boolean;
  message: string;
  data: T;
}

export class APIError extends Error { }
export type ErrorHandler = (error: Error) => void;

export function createUseApi(errorHandler?: ErrorHandler) {
  const API_URL = 'https://script.google.com/macros/s/AKfycbwh42jNeXaeg4JyBmCc1TCjl36-RTkNHLkFrsrCFbDzxZh2SIaQ34wBLX4k3m0iYZ5vAw/exec';

  function setErrorHandler(handler: ErrorHandler) {
    errorHandler = handler;
  }

  async function handleFetchResponse<RetType>(response: Response) {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.statusText}`);
    }
    const result: ResponseData<RetType> = await response.json();
    if (!result.success) {
      throw new APIError(`APIError: ${result.message}`);
    }
    return result.data;
  }

  async function fetchData<RetType, ParamType extends Record<string, string>>(params: ParamType): Promise<RetType> {
    const url = new URL(API_URL);
    for (const key of Object.keys(params)) {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key])
      }
    }

    const response = await fetch(url.toString());
    return handleFetchResponse<RetType>(response);
  }

  async function postData<RetType, DataType = unknown | null>(data: DataType): Promise<RetType> {
    const hasData = !!data && Object.keys(data as object).length > 0;
    const response = await fetch(API_URL, {
      method: 'POST',
      body: hasData ? JSON.stringify(data) : undefined,
    });

    return handleFetchResponse<RetType>(response);
  }

  function registerUser(userData: RegisterData): Promise<UserData> {
    return postData({ action: 'register', ...userData });
  }

  function loginUser(userData: LoginData): Promise<UserData> {
    return fetchData({ action: 'login', ...userData });
  }

  function getStuffs(): Promise<StuffRatings[]> {
    return fetchData({ action: 'items' });
  }

  function rateStuffs(data: UserRatingAnswers) {
    return postData<{ points: number }>({ action: 'rating', ...data });
  }

  function transferPoints(data: TransferAction) {
    return postData<{ points: number }>({ action: 'transfer', ...data });
  }

  return {
    registerUser,
    loginUser,
    getStuffs,
    rateStuffs,
    transferPoints,
    // general
    fetchData,
    postData,
    setErrorHandler,
  };
}