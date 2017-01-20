'use strict';

const test = require('ava');
const stringify = require('./index').stringify;

test('null', (t) => {
  const result = stringify(null);
  t.is(result, '');
});

test('one day', (t) => {
  const result = stringify({
    '@type': 'OpeningHoursSpecification',
    closes: '17:00:00',
    dayOfWeek: 'http://schema.org/Monday',
    opens: '09:00:00'
  });
  t.is(result, 'Mo 09:00-17:00');
});

test('one day as array', (t) => {
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

test('two days, same timespan', (t) => {
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


test('three days, two timespans', (t) => {
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

test('three days, two timespans (out of order)', (t) => {
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

test('one day, two timespans', (t) => {
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

test('one day, two timespans (out of order)', (t) => {
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
