import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  form;
  message;
  messageClass;
  processing = false;
  emailValid = true;
  emailMessage;
  usernameValid = true;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        email: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30),
            this.validateEmail
          ])
        ],
        username: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15)
          ])
        ],
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15)
          ])
        ],
        confirm: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15)
          ])
        ]
      },
      { validator: this.matchingPasswords("password", "confirm") }
    );
  }

  disableForm() {
    this.form.controls["email"].disable();
    this.form.controls["username"].disable();
    this.form.controls["password"].disable();
    this.form.controls["confirm"].disable();
  }

  enableForm() {
    this.form.controls["email"].enable();
    this.form.controls["username"].enable();
    this.form.controls["password"].enable();
    this.form.controls["confirm"].enable();
  }

  validateEmail(controls) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { matchingPasswords: true };
      }
    };
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get("email").value,
      username: this.form.get("username").value,
      password: this.form.get("password").value
    };

    this.authService.registerUser(user).subscribe(data => {
      if ((data as any).success) {
        this.messageClass = "alert alert-success";
        this.message = (data as any).message;
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      } else {
        this.messageClass = "alert alert-danger";
        this.message = (data as any).message;
        this.processing = false;
        this.enableForm();
      }
    });
  }

  ngOnInit() {}
}
