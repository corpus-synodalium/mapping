# About

Scripts to create json files that store metadata information of dioceses and provinces. Used in cosyn.app web application.

# Setup

Use node version 12.14.0 or later. (You can check node version using `node -v`)

```
npm i
```

# Commands

Create `diocese_data.json`

```
npm run diocese
```

Create `province_data.json`

```
npm run province
```

Create `shapefile_data.json`

```
npm run shape
```

Create `ids-in-database.json`

```
npm run get-ids
```

# More details

-   See config options in `script/config.js`
-   See `create-json-for-cosyn-map` for more details about the script.
