# Web Scraping

## Description

An API that scrapes information from a website and saves it in a structured format into 
mysql database. For web scraping used Puppeteer library. 

## Configuration

| Variable    | Default | Explanation                         | Type   | Required |
|-------------|---------|-------------------------------------|--------|----------|
| PORT        | 0       | Port where server will run          | number | yes      |
| USER_AGENT  | ""      | User agent for open websites        | string | yes      |
| DB_HOST     | ""      | Host for connecting to database     | string | yes      |
| DB_PORT     | ""      | Port for connecting to database     | number | yes      |
| DB_USERNAME | ""      | Username for connecting to database | string | yes      |
| DB_PASSWORD | ""      | Password for connecting to database | string | yes      |
| DB_DATABASE | ""      | Database name                       | string | yes      |

## Local development

To install all required dependencies run

```bash
$ npm install
```

To run project run

```bash
$ npm run dev
```

To show all items run

```
http://localhost:{PORT}/
```

### Rozetka

For start web scraping from Rozetka run

```
http://localhost:{PORT}/rozetka/scrape
```

For show all items from Rozetka run

```
http://localhost:{PORT}/rozetka/
```

### Telemart

For start web scraping from Telemart run

```
http://localhost:{PORT}/telemart/scrape
```

For show all items from Telemart run

```
http://localhost:{PORT}/telemart/
```


### Database

To create database run this command

```bash
$ docker compose up
```