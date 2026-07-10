import { describe, it, expect } from 'vitest';
import type { Box } from '@/lib/api';

describe('Boxes Search & Sort Logic', () => {
  const mockBoxes: Box[] = [
    { id: '1', name: 'Zebra Box', targetValue: "1000", balance: 500, accumulatedGains: -10, createdAt: '2023-01-01' },
    { id: '2', name: 'Alpha Box', targetValue: "2000", balance: 1000, accumulatedGains: 50, createdAt: '2023-01-02' },
    { id: '3', name: 'Beta Box', description: 'Very good', targetValue: "500", balance: 100, accumulatedGains: 100, createdAt: '2023-01-03' }
  ];

  it('CT-01: Filters correctly by search query', () => {
    const search = 'very';
    const result = mockBoxes.filter(b => 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.description?.toLowerCase().includes(search.toLowerCase())
    );
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('3');
  });

  it('CT-01: Sorts correctly by Maior Ganho', () => {
    const sorted = [...mockBoxes].sort((a, b) => (b.accumulatedGains || 0) - (a.accumulatedGains || 0));
    expect(sorted[0].name).toBe('Beta Box'); // 100
    expect(sorted[1].name).toBe('Alpha Box'); // 50
    expect(sorted[2].name).toBe('Zebra Box'); // -10
  });

  it('CT-01: Sorts correctly by Ordem Alfabética', () => {
    const sorted = [...mockBoxes].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name).toBe('Alpha Box');
    expect(sorted[1].name).toBe('Beta Box');
    expect(sorted[2].name).toBe('Zebra Box');
  });
});
