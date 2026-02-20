// =============================================================================
// footer.component.ts
// =============================================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    currentYear = new Date().getFullYear();

    socialLinks = [
        { label: 'GitHub', url: 'https://github.com/Juste120', icon: 'github' },
        { label: 'GitLab', url: 'https://gitlab.com/Juste120', icon: 'gitlab' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pakou-komi-juste-941536314/', icon: 'linkedin' },
        { label: 'Credly', url: 'https://www.credly.com/users/pakou-komi-juste/badges', icon: 'credly' }
    ];

    quickLinks = [
        { label: 'Accueil', route: '/' },
        { label: 'À Propos', route: '/about' },
        { label: 'Projets', route: '/projects' },
        { label: 'Certifications', route: '/certifications' },
        { label: 'Contact', route: '/contact' }
    ];

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
