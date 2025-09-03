export const typography = {
  // Font sizes
  sizes: {
    small: 12,
    body: 16,
    title: 20,
    largeTitle: 28,
    caption: 12,
  },

  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    loose: 1.6,
  },
} as const;
