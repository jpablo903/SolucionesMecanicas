import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Services } from './features/services/services';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'servicios', component: Services },
    { path: 'nosotros', component: About },
    { path: 'contacto', component: Contact },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard },
    { path: '**', redirectTo: '' }
];
