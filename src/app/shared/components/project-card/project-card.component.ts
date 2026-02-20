// =============================================================================
// project-card.component.ts
// =============================================================================
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
    @Input({ required: true }) project!: Project;
    @Output() viewDetails = new EventEmitter<Project>();

    get sourceBadgeClass(): string {
        return `badge-${this.project.source}`;
    }

    get sourceBadgeLabel(): string {
        const map: Record<string, string> = {
            github: '⭐ GitHub',
            gitlab: '🦊 GitLab',
            both: '⭐🦊 GitHub + GitLab',
            manual: '📌 Featured'
        };
        return map[this.project.source] ?? 'Projet';
    }

    get displayTechs(): string[] {
        return this.project.technologies.slice(0, 5);
    }

    get remainingTechs(): number {
        return Math.max(0, this.project.technologies.length - 5);
    }

    openDetails(): void {
        this.viewDetails.emit(this.project);
    }

    openRepo(event: MouseEvent): void {
        event.stopPropagation();
        const url = this.project.githubUrl || this.project.gitlabUrl || this.project.repoUrl;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }

    openDemo(event: MouseEvent): void {
        event.stopPropagation();
        if (this.project.demoUrl) window.open(this.project.demoUrl, '_blank', 'noopener,noreferrer');
    }
}
