const ICONS = {
    wheel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.9"><circle cx="10" cy="12" r="8"/><path d="M14 12L22 9V15Z" fill="currentColor" stroke="none"/></svg>`,
    quickQuestions: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.9"><path d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v8A2.5 2.5 0 0 1 17 17.5H10.7L7 20v-2.5A2.5 2.5 0 0 1 4.5 15V7A2.5 2.5 0 0 1 7 4.5Z"/><path d="M10.2 9.2a2 2 0 1 1 3.6 1.15c-.45.6-1.08.92-1.48 1.28-.32.29-.47.55-.47 1.02"/><circle cx="12" cy="14.7" r="0.78" fill="currentColor" stroke="none"/></svg>`,
    pickCards: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1.15" y="6" width="6.2" height="12" rx="1.45"/><rect x="8.9" y="6" width="6.2" height="12" rx="1.45"/><rect x="16.65" y="6" width="6.2" height="12" rx="1.45"/></svg>`,
    pexeso: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.92"><rect x="1" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="8.9" y="3.8" width="6.2" height="6.2" rx="1.2"/><rect x="16.8" y="3.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="1" y="13.8" width="6.2" height="6.2" rx="1.2"/><rect x="8.9" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/><rect x="16.8" y="13.8" width="6.2" height="6.2" rx="1.2" opacity="0.42"/></svg>`,
    flags: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:0.9"><path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    proverbs: `<svg width="22" height="22" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:0.92"><path d="M114.59 96.18h-5.18s.04-63.41.04-74.11s-7.61-15.55-10.42-15.55h-76.9s10.1 1.21 10.23 15.55c.09 10.21 0 62.8 0 79.61s6.37 19.79 6.37 19.79h75.38c.07 0 .14-.01.21-.02c.09 0 .18.02.27.02c5.2 0 9.41-5.66 9.41-12.65c0-6.97-4.21-12.64-9.41-12.64z" fill="currentColor" fill-opacity="0.32"/><ellipse cx="114.59" cy="108.83" rx="9.41" ry="12.65" fill="currentColor" fill-opacity="0.55"/><ellipse cx="38.73" cy="108.83" rx="9.41" ry="12.65" fill="currentColor" fill-opacity="0.55"/><ellipse cx="22.34" cy="20.09" rx="10.09" ry="13.57" fill="currentColor" fill-opacity="0.55"/><path d="M38.25 96.18v6.17h84.41c-1.64-3.69-4.64-6.17-8.07-6.17H38.25z" fill="currentColor" fill-opacity="0.45"/><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-opacity="0.8"><path d="M45.52 30.1c1.17 0 2.35-.02 3.52 0c.89.02 1.72.14 2.63.05c.98-.1 1.96-.29 2.96-.26c1.22.04 2.39.41 3.62.41c.6 0 1.14-.17 1.73-.2c.68-.03 1.36 0 2.04 0h4.3"/><path d="M79.01 30.1c.73 0 1.49.06 2.21-.05c1.12-.17 2.19-.63 3.36-.53c1.25.11 2.31.84 3.54 1.03c1.99.29 3.86-.9 5.87-1.09c.64-.06 1.28-.02 1.92.03c1.45.12 2.88.3 4.31.53"/><path d="M45.52 53.51c1 0 2.04.1 3.03 0c1.39-.14 2.73-.63 4.16-.56c1.44.07 2.76.7 4.17.95c1.94.33 3.89-.08 5.81-.33c2.05-.27 4-.05 6.06-.05h7.7"/><path d="M45.52 65.26c.96 0 1.89.04 2.83.11c1.68.12 3.24-.64 4.87-.81c2.05-.21 4.07.45 6.1.75c2.01.3 4.05.12 6.07 0c.92-.06 1.88-.14 2.8-.12c.99.02 1.93.33 2.92.32c1.27-.01 2.44-.57 3.69-.76c2.78-.43 5.55.97 8.36.78c.92-.06 1.81-.29 2.72-.38c1.12-.11 2.25-.01 3.37.09l4.98.45"/><path d="M68.56 76.96c1.34 0 2.74-.09 4.05.09c2.27.32 4.18-.39 6.41-.62c2.09-.22 4.18.2 6.28.37c2.18.18 4.37.1 6.56.02c2.27-.08 4.54.13 6.83.13"/></g></svg>`
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
