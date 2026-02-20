// =============================================================================
// contact.component.ts
// =============================================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    private readonly fb = new FormBuilder();
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', [Validators.required, Validators.minLength(5)]],
        message: ['', [Validators.required, Validators.minLength(20)]]
    });

    status: FormStatus = 'idle';

    socialLinks = [
        { label: 'GitHub', url: 'https://github.com/Juste120', icon: '⭐', color: '#24292e' },
        { label: 'GitLab', url: 'https://gitlab.com/Juste120', icon: '🦊', color: '#fc6d26' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pakou-komi-juste-941536314/', icon: '💼', color: '#0077b5' },
        { label: 'Credly', url: 'https://www.credly.com/users/pakou-komi-juste/badges', icon: '🏆', color: '#ff6b35' },
        { label: 'Email', url: 'mailto:pakoujuste2019@gmail.com', icon: '📧', color: '#4A9B8E' }
    ];

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && (ctrl?.dirty || ctrl?.touched));
    }

    async onSubmit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.status = 'sending';
        const formData = this.form.value;

        // Using Formspree — replace YOUR_FORM_ID with your actual Formspree form ID
        this.http.post('https://formspree.io/f/YOUR_FORM_ID', formData, {
            headers: { Accept: 'application/json' }
        }).subscribe({
            next: () => {
                this.status = 'success';
                this.form.reset();
            },
            error: () => {
                this.status = 'error';
            }
        });
    }

    resetStatus(): void { this.status = 'idle'; }
}
