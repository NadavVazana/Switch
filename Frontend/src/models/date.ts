export class Date {
  date: string;
  switches: Date[];

  isTake: boolean;
  startHour: string;
  endHour: string;
  _id: string;
  flexible: boolean;
  owner: Owner;
  comment: string;
  constructor(
    date: string,
    switches: Date[],
    _id: string,
    owner: Owner,
    startHour: string,
    endHour: string,
    flexible: boolean,
    isTake: boolean,
    comment: string
  ) {
    this.comment = comment;
    this.date = date;

    this.switches = switches;
    this._id = _id;
    this.owner = owner;
    this.startHour = startHour;
    this.endHour = endHour;
    this.flexible = flexible;
    this.isTake = isTake;
  }
}

export interface Owner {
  _id: string;
  fullName: string;
  phone: string;
}
