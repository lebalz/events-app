const fs = require('fs');
fs.readdirSync('./i18n').forEach((locale) => {
    const dir = `./i18n/${locale}`;
    if (fs.lstatSync(dir).isDirectory()) {
        const fFooter = `${dir}/docusaurus-theme-classic/footer.json`;
        if (fs.existsSync(fFooter)) {
            const footer = JSON.parse(fs.readFileSync(fFooter));
            if ('copyright' in footer) {
                delete footer['copyright'];
                console.log(`[i18n/${locale}] removed 'copyright' from footer.json`);
            }
            fs.writeFileSync(fFooter, JSON.stringify(footer, null, 2));
        }
    }
});
