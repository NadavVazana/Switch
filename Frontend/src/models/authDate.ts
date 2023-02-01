export class AuthDate {
  comment: string;
  date: string;
  endHour: string;
  startHour: string;
  flexible: boolean;
  isTake: boolean;
  owner: {
    _id: string;
    phone: string;
    fullName: string;
  };

  constructor(
    comment: string,
    date: string,
    endHour: string,
    startHour: string,
    flexible: boolean,
    isTake: boolean,
    owner: { _id: string; fullName: string; phone: string }
  ) {
    this.comment = comment;
    this.date = date;
    this.endHour = endHour;
    this.startHour = startHour;
    this.flexible = flexible;
    this.isTake = isTake;
    this.owner = owner;
  }
}
