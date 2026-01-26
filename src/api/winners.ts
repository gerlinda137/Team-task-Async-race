const BASE_URL = "https://backend-qroh.onrender.com";
export const WINNERS_PER_PAGE = 10;

export interface WinnersResponse {
  winners: Array<{ id: number; wins: number; time: number }>;
  totalCount: string;
}

export const getWinners = async (
  page: number,
  limit: number = WINNERS_PER_PAGE,
  sort: string = "id",
  order: string = "ASC",
): Promise<WinnersResponse> => {
  const response = await fetch(
    `${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
  );

  return {
    winners: await response.json(),
    totalCount: response.headers.get("X-Total-Count") || "0",
  };
};

export const getWinner = async (id: number) => {
  const response = await fetch(`${BASE_URL}/winners/${id}`);
  return response.ok ? await response.json() : undefined;
};

export const createWinner = async (winner: {
  id: number;
  wins: number;
  time: number;
}) => {
  const response = await fetch(`${BASE_URL}/winners`, {
    method: "POST",
    body: JSON.stringify(winner),
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

export const updateWinner = async (
  id: number,
  winner: { wins: number; time: number },
) => {
  const response = await fetch(`${BASE_URL}/winners/${id}`, {
    method: "PUT",
    body: JSON.stringify(winner),
    headers: { "Content-Type": "application/json" },
  });
  return response;
};
