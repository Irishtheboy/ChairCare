import { css, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import emotionNormalize from 'emotion-normalize';

export const globalStyles = (
	<>
		<Global
			styles={css`
				/* https://meyerweb.com/eric/tools/css/reset/ */
				${emotionReset}
				/* https://github.com/necolas/normalize.css/blob/master/normalize.css */
				/* normalizer is setting Y-axis margins on <h1> only. Don't be confused */
				${emotionNormalize}

				/* Import modern fonts */
				@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

				/* Root variables for black & green theme with dotted pattern */
				:root {
					--bg-primary: #000000;
					--bg-secondary: #0a0a0a;
					--bg-tertiary: #1a1a1a;
					--bg-pattern: radial-gradient(rgba(255, 255, 255, 0.1) 10%, transparent 1%);
					--bg-pattern-size: 11px 11px;
					--text-primary: #f8fafc;
					--text-secondary: #cbd5e1;
					--text-tertiary: #94a3b8;
					--border-primary: rgba(64, 64, 64, 0.6);
					--accent-primary: #4ade80;
					--accent-secondary: #22d3ee;
				}

				/* Light theme variables */
				:root.light {
					--bg-primary: #ffffff;
					--bg-secondary: #f8fafc;
					--bg-tertiary: #f1f5f9;
					--bg-pattern: radial-gradient(rgba(0, 0, 0, 0.03) 10%, transparent 1%);
					--bg-pattern-size: 11px 11px;
					--text-primary: #0f172a;
					--text-secondary: #475569;
					--text-tertiary: #64748b;
					--border-primary: #e2e8f0;
					--accent-primary: #4ade80;
					--accent-secondary: #22d3ee;
				}

				/* Base styles */
				* {
					box-sizing: border-box;
				}

				html {
					scroll-behavior: smooth;
				}

				html,
				body {
					background: var(--bg-primary);
					background-image: var(--bg-pattern);
					background-size: var(--bg-pattern-size);
					color: var(--text-primary);
					font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					font-size: 16px;
					line-height: 1.6;
					transition: background-color 0.3s ease, color 0.3s ease;
					overflow-x: hidden;
				}

				/* Modern typography scale */
				h1 {
					font-family: 'Inter', sans-serif;
					font-weight: 900;
					font-size: clamp(2.5rem, 5vw, 4rem);
					line-height: 1.1;
					letter-spacing: -0.025em;
					color: var(--text-primary);
					margin: 0;
				}

				h2 {
					font-family: 'Inter', sans-serif;
					font-weight: 800;
					font-size: clamp(2rem, 4vw, 3rem);
					line-height: 1.2;
					letter-spacing: -0.025em;
					color: var(--text-primary);
					margin: 0;
				}

				h3 {
					font-family: 'Inter', sans-serif;
					font-weight: 700;
					font-size: clamp(1.5rem, 3vw, 2rem);
					line-height: 1.3;
					color: var(--text-primary);
					margin: 0;
				}

				h4 {
					font-family: 'Inter', sans-serif;
					font-weight: 600;
					font-size: 1.25rem;
					line-height: 1.4;
					color: var(--text-primary);
					margin: 0;
				}

				h5 {
					font-family: 'Inter', sans-serif;
					font-weight: 600;
					font-size: 1.125rem;
					line-height: 1.4;
					color: var(--text-primary);
					margin: 0;
				}

				h6 {
					font-family: 'Inter', sans-serif;
					font-weight: 600;
					font-size: 1rem;
					line-height: 1.5;
					color: var(--text-secondary);
					margin: 0;
				}

				p {
					color: var(--text-secondary);
					line-height: 1.7;
					margin: 0;
				}

				a {
					color: var(--accent-secondary);
					text-decoration: none;
					transition: color 0.2s ease;
				}

				a:hover {
					color: var(--accent-primary);
				}

				/* Custom scrollbar for dark theme */
				::-webkit-scrollbar {
					width: 8px;
				}

				::-webkit-scrollbar-track {
					background: var(--bg-secondary);
				}

				::-webkit-scrollbar-thumb {
					background: var(--border-primary);
					border-radius: 4px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: var(--text-tertiary);
				}

				/* Selection styles */
				::selection {
					background: var(--accent-secondary);
					color: var(--bg-primary);
				}

				::-moz-selection {
					background: var(--accent-secondary);
					color: var(--bg-primary);
				}

				/* Focus styles */
				:focus-visible {
					outline: 2px solid var(--accent-secondary);
					outline-offset: 2px;
				}

				/* Smooth animations */
				* {
					transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
				}

				/* Remove default button styles */
				button {
					border: none;
					background: none;
					font-family: inherit;
					cursor: pointer;
				}

				/* Remove default input styles */
				input, textarea, select {
					font-family: inherit;
					font-size: inherit;
				}

				/* Ensure images are responsive */
				img {
					max-width: 100%;
					height: auto;
				}
			`}
		/>
	</>
);
