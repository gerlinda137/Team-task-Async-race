interface AppState {
  garagePage: number;
  winnersPage: number;
}

const state: AppState = {
  garagePage: 1,
  winnersPage: 1,
};

export default state;

export const setGaragePage = (page: number) => {
  state.garagePage = page;
};

export const getGaragePage = () => state.garagePage;
