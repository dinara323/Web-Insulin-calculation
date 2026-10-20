export interface CurrentUser {
  id: number;
}

const currentUser: CurrentUser = {
  id: 1,
};

export function getCurrentUser(): CurrentUser {
  return currentUser;
}