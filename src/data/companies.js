const UNICORN_COMPANIES = [
    { companyCode: "arc", companyName: "Arcorn s.r.o." },
    { companyCode: "cas", companyName: "Café Čas s.r.o." },
    { companyCode: "che", companyName: "ChargeUp Engineering a.s." },
    { companyCode: "dap", companyName: "Deckard & Penfield s.r.o." },
    { companyCode: "dds", companyName: "DD SYSTEM CZ, s.r.o." },
    { companyCode: "ebc", companyName: "EBC Services s.r.o." },
    { companyCode: "edk", companyName: "EDOOKIT s.r.o." },
    { companyCode: "eem", companyName: "Elexim eMobility, s.r.o." },
    { companyCode: "fpa", companyName: "Plus4U Fair Pay a.s." },
    { companyCode: "gal", companyName: "Galley s.r.o." },
    { companyCode: "gth", companyName: "Good To Have s.r.o." },
    { companyCode: "hah", companyName: "Harris Hawk s.r.o." },
    { companyCode: "maj", companyName: "Fox Majordomus s.r.o." },
    { companyCode: "mkt", companyName: "Marketing Zone s.r.o." },
    { companyCode: "sbc", companyName: "Synergy Business Club s.r.o." },
    { companyCode: "sns", companyName: "Synserv s.r.o." },
    { companyCode: "soe", companyName: "Solution Exchange s.r.o." },
    { companyCode: "sym", companyName: "Synergy Market s.r.o." },
    { companyCode: "urc", companyName: "Unicorn Research Centre, z.ú." },
    { companyCode: "vif", companyName: "VIG Fashion s.r.o." },
    { companyCode: "vip", companyName: "VIG Production s.r.o." },
    { companyCode: "vit", companyName: "VIG Travel s.r.o." },
    { companyCode: "vpr", companyName: "VIG Property s.r.o." },
    { companyCode: "xds", companyName: "Experience Design Studio s.r.o." },
    { companyCode: "vig", companyName: "Vigour a.s." }
];

const PHILOSOPHERS_STONE_LOGOS_CARDS = UNICORN_COMPANIES.map((company) => ({
    cardType: 'philosophersStone',
    topic: 'logos',
    companyCode: company.companyCode,
    companyName: company.companyName
}));
