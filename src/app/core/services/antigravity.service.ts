// =============================================================================
// antigravity.service.ts — tsParticles v3 configuration provider
// =============================================================================
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AntigravityService {

    /** Full Antigravity config for hero/home section */
    getHeroConfig(): Record<string, unknown> {
        return {
            fpsLimit: 60,
            background: { color: { value: 'transparent' } },
            particles: {
                number: {
                    value: 80,
                    density: { enable: true, value: 800 }
                },
                color: { value: ['#4A9B8E', '#E8998D', '#7CA5B8', '#A8D5BA', '#E8DCC8'] },
                shape: { type: ['circle', 'triangle'] },
                opacity: {
                    value: { min: 0.1, max: 0.5 },
                    animation: { enable: true, speed: 1, sync: false }
                },
                size: {
                    value: { min: 0.3, max: 3 },
                    animation: { enable: true, speed: 2, sync: false }
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'top',
                    random: true,
                    straight: false,
                    outModes: { default: 'out' },
                    attract: { enable: true, rotate: { x: 600, y: 1200 } }
                },
                links: {
                    enable: true,
                    distance: 130,
                    color: '#4A9B8E',
                    opacity: 0.15,
                    width: 1
                }
            },
            interactivity: {
                detectsOn: 'canvas',
                events: {
                    onHover: { enable: true, mode: 'repulse' },
                    onClick: { enable: true, mode: 'push' },
                    resize: { enable: true }
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { quantity: 4 }
                }
            },
            detectRetina: true
        };
    }

    /** Lighter config for secondary sections */
    getSubtleConfig(): Record<string, unknown> {
        return {
            fpsLimit: 60,
            background: { color: { value: 'transparent' } },
            particles: {
                number: {
                    value: 30,
                    density: { enable: true, value: 900 }
                },
                color: { value: ['#4A9B8E', '#A8D5BA', '#7CA5B8'] },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.1, max: 0.25 } },
                size: { value: { min: 1, max: 2.5 } },
                move: {
                    enable: true,
                    speed: 0.6,
                    direction: 'top',
                    random: true,
                    outModes: { default: 'out' }
                }
            },
            interactivity: {
                events: { onHover: { enable: true, mode: 'bubble' } },
                modes: { bubble: { distance: 80, size: 4, duration: 2 } }
            },
            detectRetina: true
        };
    }
}
