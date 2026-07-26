const fs = require('fs');
const DB_FILE = 'users.json';

class User {
  static getUsers(){
    if(!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
  }

  static saveUsers(users){
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  }

  static findByPhone(phone){
    return this.getUsers().find(u => u.phone === phone);
  }

  static create({name, phone, password}){
    const users = this.getUsers();
    const newUser = {
      id: Date.now(), 
      name, phone, password, 
      balance: 0, invested: 0, earned: 0, active: 0,
      createdAt: new Date()
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }
}

module.exports = User;
