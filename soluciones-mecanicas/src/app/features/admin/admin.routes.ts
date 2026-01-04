import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout.component';
import { AdminTurnos } from './admin-turnos/admin-turnos.component';
import { AdminClients } from './admin-clients/admin-clients.component';
import { AdminMotos } from './admin-motos/admin-motos.component';
import { AdminHome } from './admin-home/admin-home.component';
import { AdminHistory } from './admin-history/admin-history.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayout,
        children: [
            { path: '', component: AdminHome },
            { path: 'turnos', component: AdminTurnos },
            { path: 'clientes', component: AdminClients },
            { path: 'motos', component: AdminMotos },
            { path: 'historial', component: AdminHistory }
        ]
    }
];
