# gelbeseiten-parser
Parser für gelbeseiten.de

# how to run:
```bash
npm install
npm run-script run
```

# how to configure:
- goto index.js and add or remove the links to the city you need. because of a small memory leak somewhere I would suggest to not put to many links into there. better make multiple smaller runs.
- In case you only need a selection of starting letters you can remove the unwanted ones in Catalog.js