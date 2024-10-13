# tp2json - a TrustPilot to JSON scraper

### Installation

```shell
npm install tp2json
```

### Usage

```javascript
import tp2json from 'tp2json'

const config = {
  country:  'uk',
  profile:  'trustpilot.com',
  limit:  100,
}

const reviews = await tp2json(config)
const fiveStarsOnly = reviews.filter((reviews) => reviews.rating === 5)
console.log(JSON.stringify(fiveStarsOnly))

/*
returns [{
  author: string;
  date: number;
  title: string;
  rating: number;
  summary: string;
  url: string;
  location: string;
}]
*/

```

#### Config

Config object to be passed to tp2json

| Parameter | Value |
|--|--|
| country | TrustPilot country code** |
| profile | TrustPilot profile name** |
| limit | Number of reviews to return |

** These can be found in the profile URL

#### Benchmarks

Taken from GH Actions as a rough figure

| Reviews | ms |
|--|--|
| 10 | 4029 |
| 50 | 5915 |
| 100 | 8816 |

#### Dev

Linting and tests can be ran using `npm run lint` and `npm test` respectively.
