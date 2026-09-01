import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BedDouble,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  ConciergeBell,
  Dumbbell,
  Globe,
  HeartPulse,
  Info,
  Instagram,
  MapPin,
  Phone,
  PhoneCall,
  Play,
  Send,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRoundPlus,
  Utensils,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react'

export type CaseId = 'restaurant' | 'hotel' | 'doctor' | 'gym' | 'business'
export type FeatureKind = 'tile' | 'wifi' | 'video' | 'contact'

export interface UseCaseDef {
  id: CaseId
  num: string
  tabIcon: LucideIcon
  feature: FeatureKind
  featureIcon: LucideIcon
  rows: LucideIcon[]
}

export const USE_CASES: UseCaseDef[] = [
  {
    id: 'restaurant',
    num: '01',
    tabIcon: Utensils,
    feature: 'tile',
    featureIcon: UtensilsCrossed,
    rows: [Wifi, Instagram, MapPin, Star],
  },
  {
    id: 'hotel',
    num: '02',
    tabIcon: BedDouble,
    feature: 'wifi',
    featureIcon: Wifi,
    rows: [PhoneCall, ConciergeBell, Utensils, Info],
  },
  {
    id: 'doctor',
    num: '03',
    tabIcon: HeartPulse,
    feature: 'tile',
    featureIcon: CalendarCheck,
    rows: [Stethoscope, Award, Phone, MapPin],
  },
  {
    id: 'gym',
    num: '04',
    tabIcon: Dumbbell,
    feature: 'video',
    featureIcon: Play,
    rows: [ClipboardList, ShieldCheck],
  },
  {
    id: 'business',
    num: '05',
    tabIcon: Briefcase,
    feature: 'contact',
    featureIcon: UserRoundPlus,
    rows: [Phone, Send, Instagram, Globe],
  },
]
