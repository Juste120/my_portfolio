// =============================================================================
// projects.service.ts — Loads and caches project data
// =============================================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Project, ProjectFilter, ProjectStats } from '../../shared/models/project.model';

const CACHE_KEY = 'portfolio_projects';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
    data: Project[];
    timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private readonly http = inject(HttpClient);
    private readonly _projects$ = new BehaviorSubject<Project[]>([]);
    private readonly _loading$ = new BehaviorSubject<boolean>(false);

    readonly projects$ = this._projects$.asObservable();
    readonly loading$ = this._loading$.asObservable();

    /** Load projects from JSON asset (with LocalStorage cache) */
    loadProjects(): Observable<Project[]> {
        const cached = this.getCached();
        if (cached) {
            this._projects$.next(cached);
            return of(cached);
        }

        this._loading$.next(true);
        return this.http.get<Project[]>('assets/data/all-projects.json').pipe(
            tap(projects => {
                this._projects$.next(projects);
                this.setCache(projects);
                this._loading$.next(false);
            }),
            catchError(err => {
                console.warn('Could not load all-projects.json — trying pinned-projects fallback', err);
                this._loading$.next(false);
                return this.loadPinnedFallback();
            })
        );
    }

    /** Load only pinned / featured projects */
    loadPinnedFallback(): Observable<Project[]> {
        return this.http.get<any[]>('assets/data/pinned-projects.json').pipe(
            map(pinned => pinned.map(p => this.mapPinnedToProject(p))),
            tap(projects => this._projects$.next(projects)),
            catchError(() => {
                this._loading$.next(false);
                return of([]);
            })
        );
    }

    /** Force cache refresh */
    refresh(): void {
        localStorage.removeItem(CACHE_KEY);
        this.loadProjects().subscribe();
    }

    /** Filter projects based on given criteria */
    filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
        return projects.filter(p => {
            const matchSearch = !filter.search ||
                p.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                p.description.toLowerCase().includes(filter.search.toLowerCase()) ||
                p.technologies.some(t => t.toLowerCase().includes(filter.search.toLowerCase()));

            const matchCategory = !filter.category || filter.category === 'all' ||
                p.category === filter.category;

            const matchLanguage = !filter.language || filter.language === 'all' ||
                (p.language && p.language.toLowerCase() === filter.language.toLowerCase()) ||
                p.technologies.some(t => t.toLowerCase() === filter.language.toLowerCase());

            const matchSource = !filter.source || filter.source === 'all' ||
                p.source === filter.source;

            const matchFeatured = filter.featured === null || p.featured === filter.featured;

            return matchSearch && matchCategory && matchLanguage && matchSource && matchFeatured;
        });
    }

    /** Compute stats from project list */
    getStats(projects: Project[]): ProjectStats {
        const stats: ProjectStats = {
            total: projects.length,
            github: projects.filter(p => p.source === 'github').length,
            gitlab: projects.filter(p => p.source === 'gitlab').length,
            featured: projects.filter(p => p.featured).length,
            categories: {},
            languages: {}
        };
        projects.forEach(p => {
            stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
            if (p.language) {
                stats.languages[p.language] = (stats.languages[p.language] || 0) + 1;
            }
        });
        return stats;
    }

    // ---------------------------------------------------------------------------
    private getCached(): Project[] | null {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const entry: CacheEntry = JSON.parse(raw);
            if (Date.now() - entry.timestamp > CACHE_TTL) return null;
            return entry.data;
        } catch { return null; }
    }

    private setCache(data: Project[]): void {
        try {
            const entry: CacheEntry = { data, timestamp: Date.now() };
            localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        } catch { /* quota exceeded — ignore */ }
    }

    private mapPinnedToProject(p: any): Project {
        return {
            id: p.name.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            description: p.description,
            repoUrl: p.repoUrl,
            demoUrl: p.demoUrl,
            technologies: p.technologies || [],
            category: p.category || 'Full-Stack',
            language: p.technologies?.[0],
            stars: 0,
            forks: 0,
            source: 'manual',
            githubUrl: p.repoUrl,
            featured: p.featured ?? true,
            pinned: p.pinned ?? true,
            order: p.order,
            year: p.year,
            role: p.role,
            company: p.company,
            highlights: p.highlights || [],
            hasDemo: !!p.demoUrl
        };
    }
}
