// =============================================================================
// home.component.ts
// =============================================================================
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AntigravityCanvasComponent } from '../../shared/components/antigravity-canvas/antigravity-canvas.component';
import { ProjectsService } from '../../core/services/projects.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, AntigravityCanvasComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);

    totalProjects = 10;
    totalYears = 2;
    featuredProjects = 2;

    skillCategories = [
        {
            name: 'Backend',
            skills: [
                { name: 'Java 17 / 21', icon: '☕', color: '#f89820' },
                { name: 'Spring Boot 3', icon: '🍃', color: '#6db33f' },
                { name: 'Spring WebFlux', icon: '🌊', color: '#6db33f' },
                { name: 'Spring AI', icon: '🤖', color: '#00a67e' }
            ]
        },
        {
            name: 'Frontend',
            skills: [
                { name: 'HTML', icon: '📄', color: '#e34f26' },
                { name: 'CSS', icon: '🎨', color: '#1572b6' },
                { name: 'Bootstrap', icon: '🅱️', color: '#7952b3' },
                { name: 'Angular', icon: '🅰️', color: '#dd0031' },
                { name: 'TypeScript', icon: 'TS', color: '#3178c6' }
            ]
        },
        {
            name: 'Base de données',
            skills: [
                { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
                { name: 'MongoDB', icon: '🍃', color: '#47a248' },
                { name: 'Neo4j', icon: '🌿', color: '#008cc1' },
                { name: 'MinIO', icon: '📦', color: '#c72e49' }
            ]
        },
        {
            name: 'DevOps',
            skills: [
                { name: 'Docker', icon: '🐳', color: '#2496ed' },
                { name: 'GitHub Actions', icon: '🐙', color: '#2088ff' },
                { name: 'Kubernetes', icon: '☸️', color: '#326ce5' }
            ]
        }
    ];

    // For the floating background or simplified list
    get allSkills() {
        return this.skillCategories.flatMap(c => c.skills);
    }

    ngOnInit(): void {
        this.projectsService.loadProjects().subscribe(projects => {
            this.totalProjects = projects.length;
        });
    }

    hexToRgb(hex: string): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }
}
