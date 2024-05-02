const titleTypeValues = {
    lineHeight: 1.2,
    letterSpacing: '0.375px',
    fontWeight: 700 
};

// const bodyTypeValues = {
//     lineHeight: 1.4,
//     letterSpacing: isHeavy ? '0.5px' : '0.375px';
// };

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


const sansSerifTitles = titleRamp.map(item => Object.assign(item, titleTypeValues));

const serifTitles = titleRamp.map(item => {
    const serifTitle = (item.name).replace('sans', 'serif');
    return Object.assign({name: serifTitle, fontSize: item.fontSize}, titleTypeValues)
});

const styleguideData = {
    typography: {
        titleSans: sansSerifTitles,
        titleSerif: serifTitles
        }
    }
};