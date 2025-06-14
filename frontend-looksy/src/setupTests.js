// vitest-dom adds custom vitest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock console methods to avoid noise in tests
globalThis.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
};

// Mock window.URL.createObjectURL
Object.defineProperty(globalThis.URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'mocked-url'),
});

Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});