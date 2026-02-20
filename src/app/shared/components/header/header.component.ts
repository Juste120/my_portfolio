// =============================================================================
// header.component.ts
// =============================================================================
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
    label: string;
    route: string;
    fragment?: string;
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    private readonly router = inject(Router);

    isScrolled = false;
    isMenuOpen = false;

    navItems: NavItem[] = [
        { label: 'Accueil', route: '/' },
        { label: 'À Propos', route: '/about' },
        { label: 'Projets', route: '/projects' },
        { label: 'Certifications', route: '/certifications' },
        { label: 'Contact', route: '/contact' }
    ];

    ngOnInit(): void { }

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled = window.scrollY > 20;
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(): void {
        this.isMenuOpen = false;
    }

    isActive(route: string): boolean {
        return this.router.url === route ||
            (route !== '/' && this.router.url.startsWith(route));
    }
}
