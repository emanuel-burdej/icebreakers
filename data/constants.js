const ICONS = {
    wheel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.9"><circle cx="10" cy="12" r="8"/><path d="M14 12L22 9V15Z" fill="currentColor" stroke="none"/></svg>`,
    quickQuestions: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.9"><path d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v8A2.5 2.5 0 0 1 17 17.5H10.7L7 20v-2.5A2.5 2.5 0 0 1 4.5 15V7A2.5 2.5 0 0 1 7 4.5Z"/><path d="M10.2 9.2a2 2 0 1 1 3.6 1.15c-.45.6-1.08.92-1.48 1.28-.32.29-.47.55-.47 1.02"/><circle cx="12" cy="14.7" r="0.78" fill="currentColor" stroke="none"/></svg>`,
    pickCards: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1.15" y="6" width="6.2" height="12" rx="1.45"/><rect x="8.9" y="6" width="6.2" height="12" rx="1.45"/><rect x="16.65" y="6" width="6.2" height="12" rx="1.45"/></svg>`,
    pexeso: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="8.9" y="3.8" width="6.2" height="6.2" rx="1.2"/><rect x="16.8" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="1" y="13.8" width="6.2" height="6.2" rx="1.2"/><rect x="8.9" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="16.8" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/></svg>`
};

const HAVKACI_LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg9X5CXnwFodjlJPerbWgtb00e0_pE_aqCBQ&s";
const GEEGEE_LOGO_URL = "https://uuapp.plus4u.net/uu-webkit-maing02/46f70125a73742878c6c853db30cfaaf/getProductLogo?type=1x1&slot=prod2";
const SVOBODA_ZVIRAT_LOGO_URL = "https://scontent.fbts4-1.fna.fbcdn.net/v/t39.30808-6/352808523_809307677011844_7284170391260971483_n.png?_nc_cat=111&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=jr3iGrVh--QQ7kNvwF263kY&_nc_oc=Adrt0XhiOFH_pvA2QZ7l_DoUv67jcP-ocNJ25301WisF0W3djQ4vCGG346JPrnODkdo&_nc_zt=23&_nc_ht=scontent.fbts4-1.fna&_nc_gid=VgiUIb4FkjcuLkevVuWvVQ&_nc_ss=7b289&oh=00_Af4uO6E7KmSywMhRvvNuZBDKgfq1tgM80la93aRuO_hstQ&oe=69FEC5D7";
const WWF_LOGO_URL = "https://scontent.cdninstagram.com/v/t51.2885-19/431325439_751480023713703_7991689382220454627_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4zMjAuQzMifQ%3D%3D&_nc_ohc=A5ZVipIotEUQ7kNvwGN4Xn6&_nc_oc=AdrBK6HVgqAEgzzs7S7yBfeZpPu8_YAEyd1HjTl1atHAVzWYhnsFW87si3mCwwbVvDk&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_ss=7ba8c&oh=00_Af5L7INu-1IrEmGvUpiGnMCW0m4KEzQxojg0r-EbKsdKwQ&oe=69FEAD21";
const NORMAL_WHEEL_POINTER = `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="wheel-pointer-icon"><path d="M4 17 30 6 24 17l6 11Z" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.4" stroke-linejoin="round"/><circle cx="18" cy="17" r="3.2" fill="#475569"/></svg>`;

const APP_STYLE_CONFIG = {
    normal: {
        orgName: 'Prešovskí havkáči',
        orgNames: {
            sk: 'Prešovskí havkáči',
            cz: 'Svoboda zvířat',
            en: 'World Wildlife Fund (WWF)'
        },
        logoUrls: {
            sk: HAVKACI_LOGO_URL,
            cz: SVOBODA_ZVIRAT_LOGO_URL,
            en: WWF_LOGO_URL
        },
        logoUrl: HAVKACI_LOGO_URL,
        wheelPointer: NORMAL_WHEEL_POINTER,
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
        orgNames: {
            sk: 'GeeGee',
            cz: 'GeeGee',
            en: 'GeeGee'
        },
        logoUrls: {
            sk: GEEGEE_LOGO_URL,
            cz: GEEGEE_LOGO_URL,
            en: GEEGEE_LOGO_URL
        },
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
