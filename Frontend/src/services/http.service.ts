import Axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACK_URL + "/api/"
    : "//localhost:3030/api/";

var axios = Axios.create({
  withCredentials: true,
});

export const httpService = {
  get<T, R>(endpoint: string, data?: T): Promise<R> {
    return ajax(endpoint, "GET", data);
  },
  post<T, R>(endpoint: string, data?: T): Promise<R> {
    return ajax(endpoint, "POST", data);
  },
  put<T, R>(endpoint: string, data?: T): Promise<R> {
    return ajax(endpoint, "PUT", data);
  },
  delete<T, R>(endpoint: string, data?: T): Promise<R> {
    return ajax(endpoint, "DELETE", data);
  },
};

async function ajax<T, R>(
  endpoint: string,
  method: string = "GET",
  data: T | null = null
): Promise<R> {
  try {
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === "GET" ? data : null,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}
