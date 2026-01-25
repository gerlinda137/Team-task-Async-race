import { getWinner, createWinner, updateWinner } from "../api/winners";

const ERROR_NUMBER = 500;

export const updateWinnerAfterRace = async (
  id: number,
  time: number
): Promise<void> => {
  try {
    const existingWinner = await getWinner(id);

    if (existingWinner) {
      await updateWinner(id, {
        wins: existingWinner.wins + 1,
        time: Math.min(existingWinner.time, time),
      });
    } else {
      const response = await createWinner({ id, wins: 1, time });

      if (response.status === ERROR_NUMBER) {
        throw new Error("Duplicate ID");
      }
    }
  } catch (error) {
    const latestData = await getWinner(id);
    console.log(error);
    if (latestData) {
      await updateWinner(id, {
        wins: latestData.wins + 1,
        time: Math.min(latestData.time, time),
      });
    }
  }
};
