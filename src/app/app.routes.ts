// =============================================================================
// app.routes.ts — Lazy-loaded routes
// =============================================================================
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'PAKOU Juste — Portfolio'
    },
    {
        path: 'about',
        loadComponent: () =>
            import('./features/about/about.component').then(m => m.AboutComponent),
        title: 'À Propos — PAKOU Juste'
    },
    {
        path: 'projects',
        loadComponent: () =>
            import('./features/projects/projects.component').then(m => m.ProjectsComponent),
        title: 'Projets — PAKOU Juste'
    },
    {
        path: 'certifications',
        loadComponent: () =>
            import('./features/certifications/certifications.component').then(m => m.CertificationsComponent),
        title: 'Certifications — PAKOU Juste'
    },
    {
        path: 'contact',
        loadComponent: () =>
            import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contact — PAKOU Juste'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
