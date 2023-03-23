let CURRENT_USER_ID: string = '';

export function setCurrentUserId(userId: string): void {
    CURRENT_USER_ID = userId;
}

export function getCurrentUserId(): string {
  return CURRENT_USER_ID;
}