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

    totalProjects = 0;
    totalYears = new Date().getFullYear() - 2021;

    skills = [
        { name: 'Java', icon: '☕', color: '#f89820' },
        { name: 'Spring Boot', icon: '🍃', color: '#6db33f' },
        { name: 'Angular', icon: '🅰', color: '#dd0031' },
        { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
        { name: 'Docker', icon: '🐳', color: '#2496ed' },
        { name: 'GitLab CI', icon: '🦊', color: '#fc6d26' }
    ];

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
