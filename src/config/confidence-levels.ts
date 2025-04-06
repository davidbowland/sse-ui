/* eslint-disable sort-keys */
import { ConfidenceLevel } from '@types'

export const confidenceLevels: ConfidenceLevel[] = [
  'absolutely agree',
  'strongly agree',
  'agree',
  'slightly agree',
  'neutral',
  'slightly disagree',
  'disagree',
  'strongly disagree',
  'absolutely disagree',
]

export const confidenceLabels = {
  'absolutely agree': 'Absolutely agree',
  'strongly agree': 'Strongly agree',
  agree: 'Agree',
  'slightly agree': 'Slightly agree',
  neutral: 'Neutral',
  'slightly disagree': 'Slightly disagree',
  disagree: 'Disagree',
  'strongly disagree': 'Strongly disagree',
  'absolutely disagree': 'Absolutely disagree',
} as { [key in ConfidenceLevel]: string }

export const getLabelFromConfidence = (confidence: ConfidenceLevel): string => {
  return confidenceLabels[confidence]
}
