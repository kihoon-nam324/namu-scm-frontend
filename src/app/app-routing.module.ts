import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from './scm-main/main-dashboard/main-dashboard.component';
import { PageNotFoundComponent } from './scm-main/page-not-found/page-not-found.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { SessionAuthGuardService } from './shared/session-auth-guard.service';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';

const routes: Routes = [
    { path: 'total-summary', component: MainDashboardComponent, canActivate: [SessionAuthGuardService]  },
    // { path: '', redirectTo: 'total-summary', pathMatch: 'full' },
    //{ path: '', component: MainDashboardComponent, pathMatch: 'full' },
    { path: 'dashboard', component: MainDashboardComponent, pathMatch: 'full', canActivate: [SessionAuthGuardService] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component : LoginComponent },
    { path: 'verify-email', component : VerifyEmailComponent },
     {path: 'forgot-password', component : ForgotPasswordComponent },
    { path: 'register', component : RegisterComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    //imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
