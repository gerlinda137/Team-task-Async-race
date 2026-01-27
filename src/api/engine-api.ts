const BASE_URL = "http://127.0.0.1:3000";
const ENGINE_ENDPOINT = `${BASE_URL}/engine`;

const STATUS_STARTED = "started";
const STATUS_DRIVE = "drive";
const STATUS_STOPPED = "stopped";

const HTTP_METHOD_PATCH = "PATCH";

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export const startEngine = async (carId: number): Promise<EngineResponse> => {
  const response = await fetch(
    `${ENGINE_ENDPOINT}?id=${carId}&status=${STATUS_STARTED}`,
    {
      method: HTTP_METHOD_PATCH,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to start engine for car ${carId}`);
  }

  return response.json();
};

export const driveEngine = async (carId: number): Promise<void> => {
  const response = await fetch(
    `${ENGINE_ENDPOINT}?id=${carId}&status=${STATUS_DRIVE}`,
    {
      method: HTTP_METHOD_PATCH,
    },
  );
  if (!response.ok) {
    throw new Error(`Engine broken for car ${carId} (${response.status})`);
  }
};

export const stopEngine = async (carId: number): Promise<void> => {
  const response = await fetch(
    `${ENGINE_ENDPOINT}?id=${carId}&status=${STATUS_STOPPED}`,
    {
      method: HTTP_METHOD_PATCH,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to stop engine for car ${carId}`);
  }
};
