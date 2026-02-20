// =============================================================================
// projects.component.ts
// =============================================================================
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../core/services/projects.service';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { Project, ProjectFilter } from '../../shared/models/project.model';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, FormsModule, ProjectCardComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
    private readonly projectsService = inject(ProjectsService);

    allProjects: Project[] = [];
    filteredProjects: Project[] = [];
    loading = true;
    selectedProject: Project | null = null;
    showModal = false;

    filter: ProjectFilter = {
        search: '',
        category: 'all',
        language: 'all',
        source: 'all',
        featured: null
    };

    categories: string[] = [];
    languages: string[] = [];

    ngOnInit(): void {
        this.projectsService.loadProjects().subscribe(projects => {
            this.allProjects = [...projects].sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return (a.order ?? 99) - (b.order ?? 99);
            });
            this.extractFilters();
            this.applyFilters();
            this.loading = false;
        });
    }

    applyFilters(): void {
        this.filteredProjects = this.projectsService.filterProjects(this.allProjects, this.filter);
    }

    setCategory(cat: string): void {
        this.filter.category = cat;
        this.applyFilters();
    }

    setSource(source: string): void {
        this.filter.source = source;
        this.applyFilters();
    }

    onSearch(): void { this.applyFilters(); }

    resetFilters(): void {
        this.filter = { search: '', category: 'all', language: 'all', source: 'all', featured: null };
        this.applyFilters();
    }

    openModal(project: Project): void {
        this.selectedProject = project;
        this.showModal = true;
        document.body.style.overflow = 'hidden';
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedProject = null;
        document.body.style.overflow = '';
    }

    refresh(): void { this.projectsService.refresh(); }

    private extractFilters(): void {
        const cats = new Set<string>();
        const langs = new Set<string>();
        this.allProjects.forEach(p => {
            if (p.category) cats.add(p.category);
            if (p.language) langs.add(p.language);
        });
        this.categories = ['all', ...Array.from(cats)];
        this.languages = ['all', ...Array.from(langs)];
    }
}
