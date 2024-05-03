import { colors } from "../styles/themes/base";

const titleTypeValues = {
    lineHeight: 1.2,
    letterSpacing: '0.375px',
    fontWeight: 700 
};

const bodyOrLinkTypeValues = {
    lineHeight: 1.4,
    letterSpacing: '0.5px',
    fontWeight: 400
};

const bodyOrLinkHeavyTypeValues = {
    lineHeight: 1.4,
    letterSpacing: '0.375px',
    fontWeight: 700
};

const titleRamp = [
    {
        name: 'title-sans-2xl',
        fontSize: '68px'
    },
    {
        name: 'title-sans-xl',
        fontSize: '56px'
    },
    {
        name: 'title-sans',
        fontSize: '44px'
    },
    {
        name: 'title-sans-md',
        fontSize: '32px'
    },
    {
        name: 'title-sans-sm',
        fontSize: '20px'
    },
];

const bodyRamp = [
    {
        name: 'body-sans-xl',
        fontSize: '18px',
    },
    {
        name: 'body-sans-heavy-xl',
        fontSize: '18px'
    },
    {
        name: 'body-sans',
        fontSize: '16px'
    },
    {
        name: 'body-sans-heavy',
        fontSize: '16px'
    },
    {
        name: 'body-sans-sm',
        fontSize: '12px'
    },
    {
        name: 'body-sans-heavy-sm',
        fontSize: '12px'
    },
];

const linkRamp = [
    {
        name: 'link-sans-lg',
        fontSize: '18px'
    },
    {
        name: 'link-sans-heavy-lg',
        fontSize: '18px'
    },
    {
        name: 'link-sans',
        fontSize: '16px'
    },
    {
        name: 'link-sans-heavy',
        fontSize: '16px'
    },
    {
        name: 'link-sans-sm',
        fontSize: '12px'
    },
    {
        name: 'link-sans-sm',
        fontSize: '12px'
    },
];

const sansTypeValues = (typeArr: object[], typeConstObj: object) => typeArr.map(item => Object.assign(item, typeConstObj));

const serifTypeValues = (typeArr:{[key:string]: string}[], typeConstObj: object) => typeArr.map( item => {
    const serifTitle = (name: string) => (name).replace('sans', 'serif');
    return Object.assign({name: serifTitle, fontSize: item.fontSize}, typeConstObj)
});

const sansSerifTitles = sansTypeValues(titleRamp, titleTypeValues);
const serifTitles = serifTypeValues(titleRamp, titleTypeValues);
const bodyRamps = Object.assign(sansTypeValues(bodyRamp, bodyOrLinkTypeValues), serifTypeValues(bodyRamp, bodyOrLinkTypeValues));
const linkRamps = Object.assign(sansTypeValues(linkRamp, bodyOrLinkTypeValues), serifTypeValues(linkRamp, bodyOrLinkTypeValues));


export const styleguideData = {
    typography: {
        titleSans: sansSerifTitles,
        titleSerif: serifTitles,
        body: bodyRamps,
        link: linkRamps
    },
    colors: colors
};