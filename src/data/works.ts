import type { CaseId } from './usecases'

import woodTab from '../assets/works/wood-tab.webp'
import jiyda from '../assets/works/jiyda.webp'
import oromee from '../assets/works/oromee.webp'
import sadaf from '../assets/works/sadaf.webp'
import space from '../assets/works/space.webp'
import omnia from '../assets/works/omnia.webp'
import beshqozon from '../assets/works/beshqozon.webp'
import gruzin from '../assets/works/gruzin.webp'
import bero from '../assets/works/bero.webp'
import chayxana from '../assets/works/chayxana.webp'
import caravan from '../assets/works/caravan.webp'
import nyCoffee from '../assets/works/ny-coffee.webp'
import homewithakashDark from '../assets/works/homewithakash-dark.webp'
import shaxzod from '../assets/works/shaxzod.webp'
import bellissimo from '../assets/works/bellissimo.webp'
import forel from '../assets/works/forel.webp'
import homewithakashLight from '../assets/works/homewithakash-light.webp'
import edya from '../assets/works/edya.webp'
import oqtepa from '../assets/works/oqtepa.webp'
import kattaqorgon from '../assets/works/kattaqorgon.webp'
import umarov from '../assets/works/umarov.webp'
import alec from '../assets/works/alec.webp'
import uzCargo from '../assets/works/uz-cargo.webp'
import banket from '../assets/works/banket.webp'
import boy from '../assets/works/boy.webp'
import shaxlo from '../assets/works/shaxlo.webp'
import moose from '../assets/works/moose.webp'

export interface WorkImage {
  img: string
  w: number
  h: number
  name: string
}

/** Hero + wood product photograph (unbranded wooden NFC + QR tab). */
export const WOOD_TAB: WorkImage = { img: woodTab, w: 1440, h: 1080, name: 'Fenix' }

/** Product-section photography. */
export const PRODUCT_PHOTOS = {
  wood: WOOD_TAB,
  acrylic: { img: beshqozon, w: 1200, h: 1200, name: 'Beshqozon' } as WorkImage,
  card: { img: omnia, w: 1200, h: 1200, name: 'Omnia' } as WorkImage,
  customA: { img: gruzin, w: 900, h: 900, name: 'Gruzin' } as WorkImage,
  customB: { img: chayxana, w: 900, h: 900, name: 'Чайхана Халяль' } as WorkImage,
  customC: { img: bero, w: 900, h: 900, name: 'Bero Mood' } as WorkImage,
}

/** Real client product per use-case scene. */
export const SCENE_PHOTOS: Record<CaseId, WorkImage> = {
  restaurant: { img: jiyda, w: 1200, h: 1200, name: 'Jiyda' },
  hotel: { img: oromee, w: 1200, h: 1200, name: 'Oromee' },
  doctor: { img: sadaf, w: 1200, h: 1200, name: 'Sadaf' },
  gym: { img: space, w: 1200, h: 1200, name: 'Space' },
  business: { img: omnia, w: 1200, h: 1200, name: 'Omnia' },
}

export type FeaturedKey = 'caravan' | 'personal' | 'guest' | 'pizza' | 'forel' | 'coffee'

export interface FeaturedWork extends WorkImage {
  key: FeaturedKey
  num: string
  cls: string
}

/** Selected work — editorial grid, varied scales. Square photos shown in the
 *  wide cells keep their studio ground (`pj--contain`) instead of being
 *  crop-zoomed past their own edges. */
export const FEATURED: FeaturedWork[] = [
  { key: 'caravan', num: '01', cls: 'pjf--a', img: caravan, w: 1200, h: 1200, name: 'Caravan House' },
  { key: 'personal', num: '02', cls: 'pjf--b', img: shaxzod, w: 1200, h: 1200, name: 'Shaxzod Tulayev' },
  { key: 'guest', num: '03', cls: 'pjf--c', img: homewithakashDark, w: 1200, h: 1200, name: 'Homewithakash' },
  { key: 'pizza', num: '04', cls: 'pjf--d pj--contain', img: bellissimo, w: 1200, h: 1200, name: 'Bellissimo Pizza' },
  { key: 'forel', num: '05', cls: 'pjf--e pj--contain', img: forel, w: 1200, h: 1200, name: 'Restoran Forel' },
  { key: 'coffee', num: '06', cls: 'pjf--f', img: nyCoffee, w: 1200, h: 1200, name: 'N.Y Coffee' },
]

/** Complete work index — every remaining piece, name as printed on the product. */
export const ARCHIVE: WorkImage[] = [
  { img: jiyda, w: 1200, h: 1200, name: 'Jiyda' },
  { img: oromee, w: 1200, h: 1200, name: 'Oromee' },
  { img: sadaf, w: 1200, h: 1200, name: 'Sadaf Clinic' },
  { img: beshqozon, w: 1200, h: 1200, name: 'Beshqozon' },
  { img: omnia, w: 1200, h: 1200, name: 'Omnia' },
  { img: space, w: 1200, h: 1200, name: 'Space by Stark' },
  { img: gruzin, w: 900, h: 900, name: 'Gruzin' },
  { img: chayxana, w: 900, h: 900, name: 'Чайхана Халяль' },
  { img: bero, w: 900, h: 900, name: 'Bero Mood' },
  { img: moose, w: 640, h: 640, name: 'Moose Coffee' },
  { img: oqtepa, w: 640, h: 640, name: 'Oqtepa Lavash' },
  { img: edya, w: 640, h: 640, name: 'Edya №1' },
  { img: homewithakashLight, w: 640, h: 640, name: 'Homewithakash' },
  { img: kattaqorgon, w: 640, h: 640, name: 'Kattaqo‘rg‘onda Bugun' },
  { img: umarov, w: 640, h: 640, name: 'Umarov Muhammad' },
  { img: alec, w: 640, h: 640, name: 'Alec Computers' },
  { img: uzCargo, w: 640, h: 640, name: 'UZ Partner Cargo' },
  { img: banket, w: 640, h: 640, name: 'Banket Xizmati' },
  { img: boy, w: 640, h: 640, name: 'Boy Santehnika' },
  { img: shaxlo, w: 640, h: 640, name: 'Shaxlo Avia Tour' },
]
