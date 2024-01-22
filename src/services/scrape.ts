import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(stealthPlugin());

export const scrapeDataFromRozetka = async (url: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.setUserAgent(process.env.USER_AGENT || '');
    await page.goto(url, {waitUntil: 'networkidle2'});

    for (let j = 1; j <= 10; j++) {
        for (let i = 0; i < 6; i++) {
            await page.evaluate('window.scrollBy(0, 1000)');
            await page.waitForTimeout(3000);
        }

        await page.$eval('a.show-more', link => link.click());
        console.log(`Page #${j}`);
    }

    const pageContent = await page.evaluate(async () => {
        const itemList = Array.from(document.querySelectorAll(".goods-tile__content"));

        return await Promise.all(itemList.map(async (item) => {
            const titleWithSpecifications = (item?.querySelector(".goods-tile__title") as HTMLElement)?.innerText;
            const price = (item?.querySelector(".goods-tile__price-value") as HTMLElement)?.innerText;
            const description = (item?.querySelector(".goods-tile__description") as HTMLElement)?.innerText;
            const image = (item?.querySelector(".ng-lazyloaded") as HTMLImageElement)?.src;
            const storePage = (item?.querySelector(".goods-tile__picture") as HTMLLinkElement)?.href;

            return {titleWithSpecifications, price, description, image, storePage};
        }));
    });

    await browser.close();

    return pageContent;
};


export const scrapeDataFromTelemart = async (url: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.setUserAgent(process.env.USER_AGENT || '');
    await page.goto(url, {waitUntil: 'networkidle2'});

    for (let i = 0; i < 10; i++) {
        await page.evaluate('window.scrollBy(0, 4000)');
        await page.waitForTimeout(1000);

        await page.$eval('button.box-load-more__btn', button => button.click());
        console.log(`Page #${i + 1}`);
    }

    const pageContent = await page.evaluate(async () => {
        const itemList = Array.from(document.querySelectorAll(".product-item"));

        return await Promise.all(itemList.map(async (item) => {
            const title = (item?.querySelector('.product-item__title')?.querySelector('a') as HTMLElement)?.innerText;
            const image = (item?.querySelector('img') as HTMLImageElement)?.src;
            const storePage = (item?.querySelector('a.product-item__pic__img') as HTMLLinkElement)?.href;

            const specifications = Array.from(item?.querySelectorAll('.product-short-char__item'));

            let specificationsStr = '';

            specifications.forEach(element => {
                const label = (element.querySelector('.product-short-char__item__label') as HTMLElement)?.innerText;
                const value = (element.querySelector('.product-short-char__item__value') as HTMLElement)?.innerText;

                specificationsStr += `${label} ${value}; `;
            });

            let price = (item?.querySelector('.product-cost_new') as HTMLElement)?.innerText;

            if (!price) {
                price = (item?.querySelector('.product-cost') as HTMLElement)?.innerText;
            }

            return {title, price, specifications: specificationsStr, image, storePage};
        }));
    });

    await browser.close();

    return pageContent;
}