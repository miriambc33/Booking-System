export class Session {
  public selected: number = 0;
  public referenceId?: string;
  public initialAvailability?: number;

  constructor(public date: string, public availability: string) {
    this.availability = availability;
  }
}
