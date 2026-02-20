// =============================================================================
// antigravity-canvas.component.ts
// =============================================================================
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntigravityService } from '../../../core/services/antigravity.service';

@Component({
    selector: 'app-antigravity-canvas',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="antigravity-wrapper" [style.height]="height">
      <div id="tsparticles-{{ instanceId }}" class="particles-container"></div>
      <div class="canvas-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styleUrl: './antigravity-canvas.component.scss'
})
export class AntigravityCanvasComponent implements OnInit, OnDestroy {
    @Input() variant: 'hero' | 'subtle' = 'hero';
    @Input() height = '100vh';

    readonly instanceId = Math.random().toString(36).slice(2, 8);
    private readonly antigravity = inject(AntigravityService);
    private particlesInstance: unknown;

    async ngOnInit(): Promise<void> {
        try {
            // Dynamic import to support SSR and code-splitting
            const { tsParticles } = await import('@tsparticles/engine');
            const { loadSlim } = await import('@tsparticles/slim');
            await loadSlim(tsParticles);

            const config =
                this.variant === 'hero'
                    ? this.antigravity.getHeroConfig()
                    : this.antigravity.getSubtleConfig();

            this.particlesInstance = await tsParticles.load({
                id: `tsparticles-${this.instanceId}`,
                options: config as any
            });
        } catch (err) {
            console.warn('tsParticles could not be loaded:', err);
        }
    }

    ngOnDestroy(): void {
        if (this.particlesInstance && typeof (this.particlesInstance as any)['destroy'] === 'function') {
            (this.particlesInstance as any)['destroy']();
        }
    }
}
