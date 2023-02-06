export class LoggedInUser {
  firstName: string;
  lastName: string;
  _id: string;
  email: string;
  phone: string;
  img: string;
  role: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    _id: string,
    phone: string,
    img: string,
    role: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this._id = _id;
    this.email = email;
    this.phone = phone;
    this.img = img;
    this.role = role;
  }
}
