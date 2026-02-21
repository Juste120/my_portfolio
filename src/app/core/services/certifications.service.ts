// =============================================================================
// certifications.service.ts — Loads and caches Credly badge data
// =============================================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Certification, CertificationFilter, CertificationStats } from '../../shared/models/certification.model';

const CREDLY_USER_ID = 'b9db7bea-e2e8-4ccb-ade7-a7a4d2379c90';
const CACHE_KEY = 'portfolio_certifications';
const CACHE_TTL = 30 * 60 * 1000;

interface AllOriginsResponse {
    contents: string;
    status: {
        http_code: number;
    };
}

interface CredlyBadge {
    id: string;
    issued_at: string;
    expires_at: string | null;
    state: string;
    badge_template: {
        name: string;
        description: string;
        image_url: string;
        issuer_id: string;
    };
    issuer: {
        entities: Array<{
            entity: {
                name: string;
            };
        }>;
    };
}

interface CredlyResponse {
    data: CredlyBadge[];
}

@Injectable({ providedIn: 'root' })
export class CertificationsService {
    private readonly http = inject(HttpClient);
    private readonly _certs$ = new BehaviorSubject<Certification[]>([]);
    private readonly _loading$ = new BehaviorSubject<boolean>(false);

    readonly certifications$ = this._certs$.asObservable();
    readonly loading$ = this._loading$.asObservable();

    loadCertifications(): Observable<Certification[]> {
        const cached = this.getCached();
        if (cached) {
            this._certs$.next(cached);
            return of(cached);
        }

        this._loading$.next(true);

        const targetUrl = `https://www.credly.com/users/${CREDLY_USER_ID}/badges.json`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;

        return this.http.get<AllOriginsResponse>(proxyUrl).pipe(
            map(response => {
                const parsed: CredlyResponse = JSON.parse(response.contents);
                return this.mapCredlyResponse(parsed.data);
            }),
            tap(certs => {
                const sorted = [...certs].sort((a, b) =>
                    new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
                );
                this._certs$.next(sorted);
                this.setCache(sorted);
                this._loading$.next(false);
            }),
            catchError(err => {
                console.warn('Could not fetch Credly badges dynamicially', err);
                // Fallback to local assets if proxy fails
                return this.loadFromAssets();
            })
        );
    }

    private loadFromAssets(): Observable<Certification[]> {
        return this.http.get<Certification[]>('assets/data/credly-badges.json').pipe(
            tap(certs => {
                this._certs$.next(certs);
                this._loading$.next(false);
            }),
            catchError(() => {
                this._loading$.next(false);
                this._certs$.next([]);
                return of([]);
            })
        );
    }

    private mapCredlyResponse(data: CredlyBadge[]): Certification[] {
        return data.map(item => ({
            id: item.id,
            name: item.badge_template.name,
            description: item.badge_template.description,
            issuer: item.issuer.entities[0]?.entity?.name || 'Inconnu',
            imageUrl: item.badge_template.image_url,
            badgeUrl: `https://www.credly.com/badges/${item.id}/public_url`,
            verifyUrl: `https://www.credly.com/badges/${item.id}/public_url`,
            issuedAt: item.issued_at,
            expiresAt: item.expires_at || undefined,
            isActive: item.state === 'active',
            category: 'Tech' // Default category
        }));
    }

    filterCertifications(certs: Certification[], filter: CertificationFilter): Certification[] {
        return certs.filter(c => {
            const matchSearch = !filter.search ||
                c.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                c.issuer.toLowerCase().includes(filter.search.toLowerCase());

            const matchIssuer = !filter.issuer || filter.issuer === 'all' || c.issuer === filter.issuer;

            const matchCategory = !filter.category || filter.category === 'all' || c.category === filter.category;

            const matchStatus =
                filter.status === 'all' ||
                (filter.status === 'active' && c.isActive) ||
                (filter.status === 'expired' && !c.isActive);

            return matchSearch && matchIssuer && matchCategory && matchStatus;
        });
    }

    getStats(certs: Certification[]): CertificationStats {
        const thisYear = new Date().getFullYear();
        const issuers: Record<string, number> = {};
        certs.forEach(c => {
            issuers[c.issuer] = (issuers[c.issuer] || 0) + 1;
        });
        return {
            total: certs.length,
            active: certs.filter(c => c.isActive).length,
            expired: certs.filter(c => !c.isActive).length,
            thisYear: certs.filter(c => new Date(c.issuedAt).getFullYear() === thisYear).length,
            issuers
        };
    }

    refresh(): void {
        localStorage.removeItem(CACHE_KEY);
        this.loadCertifications().subscribe();
    }

    private getCached(): Certification[] | null {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { data, timestamp } = JSON.parse(raw);
            if (Date.now() - timestamp > CACHE_TTL) return null;
            return data;
        } catch { return null; }
    }

    private setCache(data: Certification[]): void {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch { }
    }
}
