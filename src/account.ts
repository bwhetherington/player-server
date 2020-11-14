export interface Account {
  username: string;
  className: string;
  xp: number;

  // Permission levels:
  // 0: normal user
  // 1: in-game admin commands
  // 2: db access
  permissionLevel: number;
}

export function isAccount(x: any): x is Partial<Account> {
  if (x) {
    const { username, className, xp, permissionLevel } = x;
    return (
      (username === undefined || typeof username === 'string') &&
      (className === undefined || typeof className === 'string') &&
      (xp === undefined || typeof xp === 'number') &&
      (permissionLevel === undefined || typeof permissionLevel === 'number')
    );
  } else {
    return false;
  }
}