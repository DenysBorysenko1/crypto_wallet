export class WalletMiddleware {
  public static isCorrectAddress(address: string): boolean | Error {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    const isCorrect = address.match(regex);

    if (!isCorrect) {
      throw new Error('Address incorrect.');
    }

    return true;
  }
}
