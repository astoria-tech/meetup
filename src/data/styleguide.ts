import {colors} from '../styles/themes/base'

const titleTypeValues = {
  lineHeight: 1.2,
  letterSpacing: '0.375px',
  fontWeight: 700,
}

const bodyOrLinkTypeValues = {
  lineHeight: 1.4,
  letterSpacing: '0.5px',
}

const titleRamp = [
  {
    className: 'title-sans-2xl',
    fontSize: '68px',
  },
  {
    className: 'title-sans-xl',
    fontSize: '56px',
  },
  {
    className: 'title-sans',
    fontSize: '44px',
  },
  {
    className: 'title-sans-md',
    fontSize: '32px',
  },
  {
    className: 'title-sans-sm',
    fontSize: '20px',
  },
]

const bodyRamp = [
  {
    className: 'body-sans-xl',
    fontSize: '18px',
    fontWeight: 400,
  },
  {
    className: 'body-sans-heavy-xl',
    fontSize: '18px',
    fontWeight: 700,
  },
  {
    className: 'body-sans',
    fontSize: '16px',
    fontWeight: 400,
  },
  {
    className: 'body-sans-heavy',
    fontSize: '16px',
    fontWeight: 700,
  },
  {
    className: 'body-sans-sm',
    fontSize: '12px',
    fontWeight: 400,
  },
  {
    className: 'body-sans-heavy-sm',
    fontSize: '12px',
    fontWeight: 700,
  },
]

const linkRamp = [
  {
    className: 'link-sans-lg',
    fontSize: '18px',
    fontWeight: 400,
  },
  {
    className: 'link-sans-heavy-lg',
    fontSize: '18px',
    fontWeight: 700,
  },
  {
    className: 'link-sans',
    fontSize: '16px',
    fontWeight: 400,
  },
  {
    className: 'link-sans-heavy',
    fontSize: '16px',
    fontWeight: 700,
  },
  {
    className: 'link-sans-sm',
    fontSize: '12px',
    fontWeight: 400,
  },
  {
    className: 'link-sans-heavy-sm',
    fontSize: '12px',
    fontWeight: 700,
  },
]

const sansTypeValues = (typeArr: {[key: string]: string | number}[], typeConstObj: object) =>
  typeArr.map(item => Object.assign(item, typeConstObj))

const serifTypeValues = (typeArr: {[key: string]: string | number}[], typeConstObj: object) =>
  typeArr.map(item => {
    const serifTitle = (className: string) => className.replace('sans', 'serif')
    return Object.assign(
      {className: serifTitle(item.className as string), fontSize: item.fontSize, fontWeight: item.fontWeight},
      typeConstObj,
    )
  })

const sansSerifTitles = sansTypeValues(titleRamp, titleTypeValues)
const serifTitles = serifTypeValues(titleRamp, titleTypeValues)
const sansSerifBody = sansTypeValues(bodyRamp, bodyOrLinkTypeValues)
const serifBody = serifTypeValues(bodyRamp, bodyOrLinkTypeValues)
const linkRamps = Object.assign(
  sansTypeValues(linkRamp, bodyOrLinkTypeValues),
  serifTypeValues(linkRamp, bodyOrLinkTypeValues),
)

export const styleguideData = {
  typography: {
    titleSans: sansSerifTitles,
    titleSerif: serifTitles,
    bodySans: sansSerifBody,
    bodySerif: serifBody,
    link: linkRamps,
  },
  colors: colors,
}
