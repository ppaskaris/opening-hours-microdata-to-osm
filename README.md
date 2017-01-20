# opening-hours-microdata-to-osm

Conversion between schema.org's openingHoursSpecification and OSM's
opening_hours.

```js
const OpeningHoursSpecification = require('opening-hours-microdata-to-osm');

const opening_hours = OpeningHoursSpecification.stringify([
  {
    "@type": "OpeningHoursSpecification",
    "closes": "17:00:00",
    "dayOfWeek": "http://schema.org/Thursday",
    "opens": "09:00:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "closes": "17:00:00",
    "dayOfWeek": "http://schema.org/Tuesday",
    "opens": "09:00:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "closes": "17:00:00",
    "dayOfWeek": "http://schema.org/Friday",
    "opens": "09:00:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "closes": "17:00:00",
    "dayOfWeek": "http://schema.org/Monday",
    "opens": "09:00:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "closes": "17:00:00",
    "dayOfWeek": "http://schema.org/Wednesday",
    "opens": "09:00:00"
  }
]);

// opening_hours = 'Mo-Fr 09:00-17:00'
```
