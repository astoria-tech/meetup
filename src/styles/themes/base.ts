import {baseColors, primaryGradient, secondaryGradient, tertiaryGradient} from './config/themeVariables'

// todo: gradients
export const colors = {
  black: baseColors.black,
  success: baseColors.success,
  warning: baseColors.warning,
  error: baseColors.error,
  'link-base': baseColors.link.base,
  'link-light': baseColors.link.light,
  'link-dark': baseColors.link.dark,
  primary: primaryGradient.base,
  'primary-100': primaryGradient[100],
  'primary-200': primaryGradient[200],
  'primary-300': primaryGradient[300],
  'primary-400': primaryGradient[400],
  'primary-500': primaryGradient[500],
  secondary: secondaryGradient.base,
  'secondary-100': secondaryGradient[100],
  'secondary-200': secondaryGradient[200],
  'secondary-300': secondaryGradient[300],
  'secondary-400': secondaryGradient[400],
  'secondary-500': secondaryGradient[500],
  tertiary: tertiaryGradient.base,
  'tertiary-100': tertiaryGradient[100],
  'tertiary-200': tertiaryGradient[200],
  'tertiary-300': tertiaryGradient[300],
  'tertiary-400': tertiaryGradient[400],
  'tertiary-500': tertiaryGradient[500],
}

export const fontFamily = {
  sans: ['NotoSans', 'Arial', 'Helvetica', 'sans-serif'],
  'sans-bold': ['NotoSans-bold', 'Arial', 'Helvetica', 'sans-serif'],
  serif: ['PlayFair', 'Times New Roman', 'serif'],
  'serif-bold': ['PlayFair-Bold', 'Times New Roman', 'serif'],
}
