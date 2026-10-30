import { Component } from '@angular/core';

@Component({
  selector: 'app-logo-mark',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="44" height="44" rx="15" fill="#42C96F" />
      <path
        d="M12.25 20.25a7 7 0 0 1 7-7h9.5a7 7 0 0 1 7 7v5.5a7 7 0 0 1-7 7h-5.3l-6.2 4.1v-5.5a7 7 0 0 1-5-6.7v-4.4Z"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
      />
      <path
        d="m24 17.5 1.65 4.85 4.85 1.65-4.85 1.65L24 30.5l-1.65-4.85L17.5 24l4.85-1.65L24 17.5Z"
        fill="white"
      />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      flex: none;
      line-height: 0;
    }
  `,
})
export class LogoMarkComponent {}
