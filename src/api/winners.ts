const BASE_URL = "http://127.0.0.1:3000";
export const WINNERS_PER_PAGE = 10;

export interface WinnersResponse {
  winners: Array<{ id: number; wins: number; time: number }>;
  totalCount: string;
}

export const getWinners = async (
  page: number,
  limit: number = WINNERS_PER_PAGE,
  sort: string = "id",
  order: string = "ASC"
): Promise<WinnersResponse> => {
  const response = await fetch(
    `${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
  );

  return {
    winners: await response.json(),
    totalCount: response.headers.get("X-Total-Count") || "0",
  };
};
