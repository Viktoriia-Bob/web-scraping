import { getRepository, Repository } from 'typeorm';

import { Item } from '../entities/item.entity';

export class ItemRepository {
    private static instance: ItemRepository;
    private repository: Repository<Item>;

    private constructor() {
        this.repository = getRepository(Item);
    }

    public static getInstance(): ItemRepository {
        if (!ItemRepository.instance) {
            ItemRepository.instance = new ItemRepository();
        }
        return ItemRepository.instance;
    }

    public getRepository(): Repository<Item> {
        return this.repository;
    }
}
