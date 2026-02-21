// =============================================================================
// about.component.ts
// =============================================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Skill { name: string; level: number; category: string; }
interface Experience {
    period: string;
    role: string;
    company: string;
    location: string;
    description: string;
    techs: string[];
}

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    skills: Skill[] = [
        { name: 'Java 17 / 21', level: 92, category: 'Backend' },
        { name: 'Spring Boot 3', level: 90, category: 'Backend' },
        { name: 'Spring WebFlux', level: 85, category: 'Backend' },
        { name: 'Spring AI', level: 82, category: 'Backend' },
        { name: 'Angular', level: 88, category: 'Frontend' },
        { name: 'TypeScript', level: 85, category: 'Frontend' },
        { name: 'PostgreSQL', level: 90, category: 'Database' },
        { name: 'MongoDB', level: 85, category: 'Database' },
        { name: 'Neo4j', level: 75, category: 'Database' },
        { name: 'MinIO', level: 80, category: 'Database' },
        { name: 'Docker', level: 88, category: 'DevOps' },
        { name: 'Kubernetes', level: 80, category: 'DevOps' },
        { name: 'GitHub Actions', level: 85, category: 'DevOps' },
    ];

    cvLink = 'https://docs.google.com/document/d/18tGZv406cPIquhzMJKVtDM5caHGiG5zSwwZnfmW1gYU/edit?usp=sharing';

    experiences: Experience[] = [
        {
            period: '2024 — Présent',
            role: 'Backend Developer & Team Lead',
            company: 'NITCH-CORP',
            location: 'Lomé, Togo',
            description: 'Développement du Titan Marketplace avec Spring Modulith, 4 modules indépendants. Architecture microservices, chat temps réel, déploiement Docker.',
            techs: ['Java', 'Spring Modulith', 'Angular', 'PostgreSQL', 'Docker']
        },
        {
            period: '2024',
            role: 'Full-Stack Developer',
            company: 'Odda Technology SARL',
            location: 'Lomé, Togo',
            description: 'Développement de Togo Explore — plateforme de gestion du tourisme national. UI PrimeNG, Spring Boot REST API, authentification JWT.',
            techs: ['Spring Boot', 'Angular', 'PrimeNG', 'PostgreSQL']
        },
        {
            period: '2023',
            role: 'Full-Stack Developer',
            company: 'KOF Corporation',
            location: 'Lomé, Togo',
            description: 'Réseau social mobile avec Flutter et Spring Boot. Auth JWT, messages temps réel, fil d\'actualité, notifications push.',
            techs: ['Spring Boot', 'Flutter', 'MySQL', 'WebSocket']
        }
    ];

    categories = ['Tous', 'Backend', 'Frontend', 'Database', 'DevOps'];
    activeCategory = 'Tous';

    get filteredSkills(): Skill[] {
        if (this.activeCategory === 'Tous') return this.skills;
        return this.skills.filter(s => s.category === this.activeCategory);
    }

    setCategory(cat: string): void { this.activeCategory = cat; }
}
