import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Services } from './features/services/services';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { Turnos } from './features/dashboard/turnos/turnos';
import { SolicitarTurno } from './features/dashboard/solicitar-turno/solicitar-turno';
import { Moto } from './features/dashboard/moto/moto';
import { Historial } from './features/dashboard/historial/historial';
import { Config } from './features/dashboard/config/config';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'servicios', component: Services },
    { path: 'nosotros', component: About },
    { path: 'contacto', component: Contact },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'dashboard',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'turnos', pathMatch: 'full' },
            { path: 'turnos', component: Turnos },
            { path: 'solicitar-turno', component: SolicitarTurno },
            { path: 'moto', component: Moto },
            { path: 'historial', component: Historial },
            { path: 'config', component: Config }
        ]
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard], // authGuard ensures login, adminGuard checks role
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
