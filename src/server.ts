import './db/connection';
import 'dotenv/config';

import express, {Request, Response} from 'express';
import path from 'path';

import {scrapeDataFromRozetka, scrapeDataFromTelemart} from './services/scrape';
import {ItemRepository} from './db/repository';
import {Item} from './entities/item.entity';
import {SourceEnum} from './enum/SourceEnum';

const app = express();
const PORT = process.env.PORT;

const itemRepository = ItemRepository.getInstance();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/rozetka/scrape', async (req: Request, res: Response) => {
    try {
        // delete all laptops
        await itemRepository.getRepository().delete({
            type: 'laptop',
            source: SourceEnum.ROZETKA
        });

        const data = await scrapeDataFromRozetka('https://rozetka.com.ua/ua/notebooks/c80004/');

        data.map(async (item) => {
            const good = new Item();
            good.title = item.titleWithSpecifications.split('/')[0].toString();
            good.price = parseFloat(item.price.replace(/[^0-9.]+/g,''));
            good.description = item.description || '';
            good.image = item.image;
            good.source = SourceEnum.ROZETKA;
            good.specifications = item.titleWithSpecifications.slice(item.titleWithSpecifications.indexOf('/')).toString();
            good.type = 'laptop';
            good.storePage = item.storePage;

            await itemRepository.getRepository().save(good);
        });
        res.redirect('/rozetka');
    } catch (error: any) {
        console.error('Error scraping and saving data from rozetka:', error);
        res.render('error', { message: `Error scraping and saving data from rozetka: ${error.message}`, error })
    }
});

app.get('/telemart/scrape', async (req: Request, res: Response) => {
    try {
        // delete all laptops
        await itemRepository.getRepository().delete({
            type: 'laptop',
            source: SourceEnum.TELEMART
        });

        const data = await scrapeDataFromTelemart('https://telemart.ua/ua/laptops/');

        data.map(async (item) => {
            const good = new Item();
            good.title = item.title.toString();
            good.price = parseFloat(item.price.replace(/[^0-9.]+/g,''));
            good.description = '';
            good.image = item.image;
            good.source = SourceEnum.TELEMART;
            good.specifications = item.specifications;
            good.type = 'laptop';
            good.storePage = item.storePage;

            console.log({ good });

            await itemRepository.getRepository().save(good);
        });
        res.redirect('/telemart');
    } catch (error: any) {
        console.error('Error scraping and saving data from telemart:', error);
        res.render('error', { message: `Error scraping and saving data from telemart: ${error.message}`, error })
    }
});

app.get('/rozetka', async (req: Request, res: Response) => {
    const data = await itemRepository.getRepository().find({
        where: {
            source: SourceEnum.ROZETKA,
            type: 'laptop',
        }
    });
    res.render('data', { data, title: `Rozetka's laptops:` });
});

app.get('/telemart', async (req: Request, res: Response) => {
    const data = await itemRepository.getRepository().find({
        where: {
            source: SourceEnum.TELEMART,
            type: 'laptop',
        },
    });

    res.render('data', { data, title: `Telemart's laptops:` })
});

app.get('/laptops', async (req: Request, res: Response) => {
    const data = await itemRepository.getRepository().find();

    res.render('data', { data, title: 'All laptops' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
