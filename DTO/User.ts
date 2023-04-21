export class User {
  id: string;
  accountType: string;
  username: string;
  password: string;
  name: string;
  companyName: string;

  constructor(
    id: string,
    accountType: string,
    username: string,
    password: string,
    name: string,
    companyName: string
  ) {
    this.id = id;
    this.accountType = accountType;
    this.username = username;
    this.password = password;
    this.name = name;
    if(companyName == 'Company Name (Optional)'){
      companyName = 'Personal'
    }
    this.companyName = companyName ?? "personal";
  }
}
