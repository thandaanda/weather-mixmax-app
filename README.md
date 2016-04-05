# Weather Slash Command for Mixmax

This is an open source Mixmax Slash Command. This integration helps embeding weather details of any city to your MixMax mail.

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl http://localhost:3000/typeahead?city=Ahmedabad
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:3000/resolver?city=Ahmedabad
```
