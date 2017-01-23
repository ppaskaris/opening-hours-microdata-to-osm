'use strict';

const test = require('ava');
const stringify = require('./index').stringify;

test('handles null', (t) => {
  const result = stringify(null);
  t.is(result, '');
});

test('handles single day', (t) => {
  const result = stringify({
    '@type': 'OpeningHoursSpecification',
    closes: '17:00:00',
    dayOfWeek: 'http://schema.org/Monday',
    opens: '09:00:00'
  });
  t.is(result, 'Mo 09:00-17:00');
});

test('ignores unknown dayOfWeek', (t) => {
  const result = stringify({
    '@type': 'OpeningHoursSpecification',
    closes: '17:00:00',
    dayOfWeek: 'http://schema.org/Morndas',
    opens: '09:00:00'
  });
  t.is(result, '');
});

test('ignores unbounded hours', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Tuesday',
    }
  ]);
  t.is(result, '');
});

test('handles single day (as array)', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    }
  ]);
  t.is(result, 'Mo 09:00-17:00');
});

test('handles empty array', (t) => {
  const result = stringify([]);
  t.is(result, '');
});

test('handles two days with same hours', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Tuesday',
      opens: '09:00:00'
    }
  ]);
  t.is(result, 'Mo,Tu 09:00-17:00');
});


test('handles three days, two with same hours', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Tuesday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '18:30:00',
      dayOfWeek: 'Wednesday',
      opens: '09:00:00'
    }
  ]);
  t.is(result, 'Mo,Tu 09:00-17:00; We 09:00-18:30');
});

test('handles three days, two with same hours (out of order)', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '18:30:00',
      dayOfWeek: 'Wednesday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Tuesday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    }
  ]);
  t.is(result, 'Mo,Tu 09:00-17:00; We 09:00-18:30');
});

test('handles one day with different hours', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '23:59:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '20:00:00'
    }
  ]);
  t.is(result, 'Mo 09:00-17:00,20:00-23:59');
});

test('handles one day with different hours (out of order)', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      closes: '23:59:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '20:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      closes: '17:00:00',
      dayOfWeek: 'http://schema.org/Monday',
      opens: '09:00:00'
    }
  ]);
  t.is(result, 'Mo 09:00-17:00,20:00-23:59');
});

test('handles several days with same hours', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': 'http://schema.org/Thursday',
      'opens': '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': 'http://schema.org/Tuesday',
      'opens': '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': 'http://schema.org/Friday',
      'opens': '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': 'http://schema.org/Monday',
      'opens': '09:00:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': 'http://schema.org/Wednesday',
      'opens': '09:00:00'
    }
  ]);
  t.is(result, 'Mo-Fr 09:00-17:00');
});

test('handles dayOfWeek as an array', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': [
        'http://schema.org/Thursday',
        'http://schema.org/Tuesday',
        'http://schema.org/Friday',
        'http://schema.org/Monday',
        'http://schema.org/Wednesday'
      ],
      'opens': '09:00:00'
    }
  ]);
  t.is(result, 'Mo-Fr 09:00-17:00');
});

test('handles dayOfWeek as an array (aliases)', (t) => {
  const result = stringify([
    {
      '@type': 'OpeningHoursSpecification',
      'closes': '17:00:00',
      'dayOfWeek': [
        'Thursday',
        'Tuesday',
        'Friday',
        'Monday',
        'Wednesday'
      ],
      'opens': '09:00:00'
    }
  ]);
  t.is(result, 'Mo-Fr 09:00-17:00');
});
