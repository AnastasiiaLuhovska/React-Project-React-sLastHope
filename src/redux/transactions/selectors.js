export const selectTransactions = (state) => state.transactions.items;
export const selectIsLoading = (state) => state.transactions.isLoading;
export const selectIsError = (state) => state.transactions.isError;

//
//TrasactionsHistoryPage
//

export const selectAuthToken = (state) => state.auth.token;
export const selectIsRefreshing = (state) => state.auth.isLoading;
export const selectIsToken = (state) => Boolean(state.auth.token);
export const selectFilteredTransactions = (state) =>
  state.transactions.filteredItems;
export const selectUserCurrecy = (state) => state.user.currency;
