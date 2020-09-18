import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

// COMPONENTS
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";

// GUARDS
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  { path: "login", component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: "**", component: HomeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
