const BASE_URL = "https://backend-qroh.onrender.com";
const CARS_PER_PAGE = 7;

export interface GarageResponse {
  cars: Array<{ name: string; color: string; id: number }>;
  totalCount: string;
}

interface CarResponse {
  name: string;
  color: string;
  id: number;
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

export const createCar = async (
  name: string,
  color: string,
): Promise<CarResponse> => {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: "POST",
    body: JSON.stringify({
      name,
      color,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to create car (${response.status})`);
  }

  return response.json();
};

export const editCar = async (
  name: string,
  color: string,
  id: number,
): Promise<CarResponse> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      color,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to update car (${response.status})`);
  }

  return response.json();
};

export const deleteCar = async (id: number) => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete car (${response.status})`);
  }
};

export const getCar = async (id: number): Promise<{ name: string; color: string; id: number }> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  return response.json();
};
