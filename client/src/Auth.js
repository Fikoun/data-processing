import api from './api';

class Auth {

  constructor ([user, setUser]) {
    this.user = user;
    this.setUser = setUser;
    this.logged = false;
  }

  async isLogged () {
    if (this.logged === true)
      return true;

    let token = this.user.token || localStorage.getItem('token');
    if (token=="")
      token = localStorage.getItem('token');
    
    try {
      const response = await api.post('users/auth', {}, token);
      this.set(response.data);
            
      console.log("Authorized...")
      this.logged = true;
      return this.logged;
    } catch (error) {
      console.log(error);
      this.logged = false;
      return this.logged;
    }
  }

  set(update) {
      //console.log({update});
      
      if (update.token)
        localStorage.setItem('token', update.token);

      this.user = { ...update.user, token: update.token };
      this.setUser(this.user);
  }

  unset() {
    localStorage.setItem('token', '');
    this.setUser({ username: '', id: '', token: '' });
    window.location = '/login';
  }
}


export default Auth;

