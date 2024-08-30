export class Session {
  public selected: number = 0;
  public uniqueId?: string;
  public originalAvailability?: number;

  constructor(public date: string, public availability: string) {
    this.availability = availability;
  }
}
