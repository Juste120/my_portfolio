// =============================================================================
// certifications.component.ts
// =============================================================================
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificationsService } from '../../core/services/certifications.service';
import { Certification, CertificationFilter } from '../../shared/models/certification.model';

@Component({
    selector: 'app-certifications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './certifications.component.html',
    styleUrl: './certifications.component.scss'
})
export class CertificationsComponent implements OnInit {
    private readonly certsService = inject(CertificationsService);

    allCerts: Certification[] = [];
    filteredCerts: Certification[] = [];
    loading = true;
    stats = { total: 0, active: 0, expired: 0, thisYear: 0, issuers: {} as Record<string, number> };

    filter: CertificationFilter = {
        search: '', issuer: 'all', category: 'all', status: 'all'
    };
    issuers: string[] = [];

    ngOnInit(): void {
        this.certsService.loadCertifications().subscribe(certs => {
            this.allCerts = certs;
            this.stats = this.certsService.getStats(certs);
            this.issuers = ['all', ...Object.keys(this.stats.issuers)];
            this.applyFilters();
            this.loading = false;
        });
    }

    applyFilters(): void {
        this.filteredCerts = this.certsService.filterCertifications(this.allCerts, this.filter);
    }

    setStatus(status: 'all' | 'active' | 'expired'): void {
        this.filter.status = status;
        this.applyFilters();
    }

    onSearch(): void { this.applyFilters(); }

    refresh(): void { this.certsService.refresh(); }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}
