import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import { tokenNotExpired } from "angular2-jwt";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  // domain = "http://localhost:5000/";
  domain = "";
  authToken;
  user;
  options;

  constructor(private http: HttpClient) {}

  loadToken() {
    const token = localStorage.getItem("token");
    this.authToken = token;
  }

  registerUser(user) {
    let headers = new HttpHeaders();
    headers.append("Content-type", "applications/json");
    return this.http.post(this.domain + "auth/signup", user, {
      headers
    });
  }

  login(user) {
    let headers = new HttpHeaders();
    headers.append("Content-type", "applications/json");
    return this.http.post(this.domain + "auth/login", user, {
      headers
    });
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // localstorage
  storeUserData(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
}
