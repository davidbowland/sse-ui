/* eslint-disable sort-keys */
import { ConfidenceLevel } from '@types'

export const confidenceLevels: ConfidenceLevel[] = [
  'absolutely disagree',
  'strongly disagree',
  'disagree',
  'slightly disagree',
  'neutral',
  'slightly agree',
  'agree',
  'strongly agree',
  'absolutely agree',
]

export const confidenceLabels = {
  'absolutely disagree': 'Absolutely disagree',
  'strongly disagree': 'Strongly disagree',
  disagree: 'Disagree',
  'slightly disagree': 'Slightly disagree',
  neutral: 'Neutral',
  'slightly agree': 'Slightly agree',
  agree: 'Agree',
  'strongly agree': 'Strongly agree',
  'absolutely agree': 'Absolutely agree',
} as { [key in ConfidenceLevel]: string }

export const getLabelFromConfidence = (confidence: ConfidenceLevel): string => {
  return confidenceLabels[confidence]
}
