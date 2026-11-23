import { TextStyle } from 'react-native';

export const typography = {
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.7,
  } as TextStyle,

  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.55,
    lineHeight: 30,
  } as TextStyle,

  h3: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.425,
  } as TextStyle,

  h4: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.085,
  } as TextStyle,

  // Body
  bodyLarge: {
    fontSize: 15,
    fontWeight: '400',
  } as TextStyle,

  body: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // Labels
  labelMedium: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.24,
  } as TextStyle,

  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.33,
  } as TextStyle,

  labelXS: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.25,
  } as TextStyle,

  // Nav
  navActive: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.275,
  } as TextStyle,

  navInactive: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: -0.275,
  } as TextStyle,
};
