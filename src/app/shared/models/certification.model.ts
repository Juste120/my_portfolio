// =============================================================================
// certification.model.ts — Credly certification models
// =============================================================================

export interface Certification {
    id: string;
    name: string;
    description?: string;
    issuer: string;
    imageUrl?: string;
    badgeUrl: string;
    verifyUrl?: string;
    issuedAt: string;
    expiresAt?: string | null;
    isActive: boolean;
    category: string;
    skills?: string[];
    earnedCount?: number;
}

export interface CredlyBadge {
    id: string;
    badge: {
        name: string;
        description: string;
        image_url: string;
        badge_url: string;
        issuer?: {
            name: string;
            entity_id: string;
        };
        skills?: { name: string }[];
    };
    issued_at: string;
    expires_at: string | null;
    public_url: string;
    state: string;
    earned_count?: number;
}

export interface CertificationFilter {
    search: string;
    issuer: string;
    category: string;
    status: 'all' | 'active' | 'expired';
}

export interface CertificationStats {
    total: number;
    active: number;
    expired: number;
    thisYear: number;
    issuers: Record<string, number>;
}
