const BASE_URL = "http://127.0.0.1:3000";
const CARS_PER_PAGE = 7;

export interface GarageResponse {
  cars: Array<{ name: string; color: string; id: number }>;
  totalCount: string;
}

export const getCars = async (
  page: number,
  limit: number = CARS_PER_PAGE,
): Promise<GarageResponse> => {
  const response = await fetch(
    `${BASE_URL}/garage?_page=${page}&_limit=${limit}`,
  );

  return {
    cars: await response.json(),
    totalCount: response.headers.get("X-Total-Count") || "0",
  };
};
