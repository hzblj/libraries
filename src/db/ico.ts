import type {Ico} from './types'

/**
 * Public registry data of the sole proprietorship, as published by ARES
 * (Administrative Register of Economic Subjects, ares.gov.cz).
 */
export const ico: Ico = {
  headline: 'Self-employed · Prague, Czechia',
  ico: '08453489',
  location: 'Prague, Czechia',
  name: 'Jan Blažej',
  records: [
    {
      hint: 'Právní forma',
      label: 'Legal form',
      value: 'Fyzická osoba podnikající dle živnostenského zákona',
    },
    {
      hint: 'Živnostenský rejstřík',
      label: 'Register',
      url: 'https://rzp.gov.cz/verejne-udaje/cs/udaje/vyber-subjektu?ico=08453489',
      value: 'Czech Trade Register',
    },
    {
      hint: 'Finanční úřad',
      label: 'Tax office',
      value: 'Finanční úřad pro hlavní město Prahu',
    },
    {
      hint: 'Datum vzniku',
      label: 'Established',
      value: '26 August 2019',
    },
  ],
  since: '08 / 2019',
  source: {
    name: 'ARES · Ministry of Finance',
    updatedAt: '23 July 2026',
    url: 'https://ares.gov.cz/ekonomicke-subjekty?ico=08453489',
  },
  vat: 'Neplátce DPH',
}
