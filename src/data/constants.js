const ICONS = {
    wheel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.9"><circle cx="10" cy="12" r="8"/><path d="M14 12L22 9V15Z" fill="currentColor" stroke="none"/></svg>`,
    quickQuestions: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.9"><path d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v8A2.5 2.5 0 0 1 17 17.5H10.7L7 20v-2.5A2.5 2.5 0 0 1 4.5 15V7A2.5 2.5 0 0 1 7 4.5Z"/><path d="M10.2 9.2a2 2 0 1 1 3.6 1.15c-.45.6-1.08.92-1.48 1.28-.32.29-.47.55-.47 1.02"/><circle cx="12" cy="14.7" r="0.78" fill="currentColor" stroke="none"/></svg>`,
    pickCards: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1.15" y="6" width="6.2" height="12" rx="1.45"/><rect x="8.9" y="6" width="6.2" height="12" rx="1.45"/><rect x="16.65" y="6" width="6.2" height="12" rx="1.45"/></svg>`,
    pexeso: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="8.9" y="3.8" width="6.2" height="6.2" rx="1.2"/><rect x="16.8" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="1" y="13.8" width="6.2" height="6.2" rx="1.2"/><rect x="8.9" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="16.8" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/></svg>`
};

const HAVKACI_LOGO_URL = "https://scontent.fbts4-1.fna.fbcdn.net/v/t39.30808-1/327389294_661316942350064_882370383185051840_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-nc_sid=2d3e12&_nc_ohc=exo1sC99mo4Q7kNvwGKVweA&_nc_oc=AdpSXZXUtMFef2VG4ThdokUWpiJparQ5EBZn5PUXoqsB7WjoBrid0a4L8Q3EV3ohACo&_nc_zt=24&_nc_ht=scontent.fbts4-1.fna&_nc_gid=P13gbiNn-SKQCv5EXWw6Iw&_nc_ss=7b289&oh=00_Af2pbq6D8SbJDUnKwMj-oHnVHGJ7U4y3VV7uv2hMZzidPA&oe=69F58905";
const GEEGEE_LOGO_URL = "https://uuapp.plus4u.net/uu-webkit-maing02/46f70125a73742878c6c853db30cfaaf/getProductLogo?type=1x1&slot=prod2";
const APP_STYLE_CONFIG = {
    normal: {
        orgName: 'Prešovskí havkáči',
        logoUrl: HAVKACI_LOGO_URL,
        wheelPointer: '🏒',
        cardStyles: [
            { type: 'numbers' },
            { type: 'color', items: ['#0057d9', '#c4007a', '#008a4a'] },
            { type: 'text', items: ['🍍', '🍓', '🍉'] },
            { type: 'text', items: ['🐶', '🐲', '💎'] },
            { type: 'text', items: ['☕', '🎲', '🎯'] }
        ],
        pexesoItems: [
            { type: 'text', value: '🦴' },
            { type: 'text', value: '🧭' },
            { type: 'text', value: '🧩' }
        ]
    },
    unicorn: {
        orgName: 'GeeGee',
        logoUrl: GEEGEE_LOGO_URL,
        wheelPointer: '🦄',
        cardStyles: [
            { type: 'numbers' },
            { type: 'text', items: ['🦄', '🪄', '🌈'] },
            { type: 'text', items: ['🎨', '🚀', '🎭'] },
            { type: 'text', items: ['🍀', '🧚', '🎸'] },
            { type: 'color', items: ['#6d28d9', '#d97706', '#007c89'] }
        ],
        pexesoItems: [
            { type: 'text', value: '💎' },
            { type: 'text', value: '🎁' },
            { type: 'text', value: '🪐' }
        ]
    }
};
