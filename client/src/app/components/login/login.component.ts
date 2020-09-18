import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authGuard: AuthGuard,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  disableForm() {
    this.form.controls["username"].disable();
    this.form.controls["password"].disable();
  }

  enableForm() {
    this.form.controls["username"].enable();
    this.form.controls["password"].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();

    const user = {
      username: this.form.get("username").value,
      password: this.form.get("password").value
    };

    this.authService.login(user).subscribe(data => {
      if ((data as any).success === true) {
        this.messageClass = "alert alert-success";
        this.message = (data as any).message;
        this.authService.storeUserData((data as any).token, (data as any).user);
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(["/todo"]);
          }
        }, 2000);
      } else {
        this.messageClass = "alert alert-danger";
        this.message = (data as any).message;
        this.processing = false;
        this.enableForm();
      }
    });
  }

  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.messageClass = "alert alert-danger";
      this.message = "Access denied. Please Log-in";
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }
}
