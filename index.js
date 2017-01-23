'use strict';

const assert = require('assert');

const WEEKDAY = new Map([
  ['Monday', 'Mo'],
  ['Tuesday', 'Tu'],
  ['Wednesday', 'We'],
  ['Thursday', 'Th'],
  ['Friday', 'Fr'],
  ['Saturday', 'Sa'],
  ['Sunday', 'Su'],

  ['http://schema.org/Monday', 'Mo'],
  ['http://schema.org/Tuesday', 'Tu'],
  ['http://schema.org/Wednesday', 'We'],
  ['http://schema.org/Thursday', 'Th'],
  ['http://schema.org/Friday', 'Fr'],
  ['http://schema.org/Saturday', 'Sa'],
  ['http://schema.org/Sunday', 'Su'],
]);

const WEEKDAY_ORDER = new Map([
  ['Mo', 0],
  ['Tu', 1],
  ['We', 2],
  ['Th', 3],
  ['Fr', 4],
  ['Sa', 5],
  ['Su', 6]
]);

function compareWeekdayOrder(a, b) {
  return WEEKDAY_ORDER.get(a) - WEEKDAY_ORDER.get(b);
}

function stringifyWeekdays(wws) {
  return wws
    .reduce((ranges, next, i, array) => {
      const prev = i > 0 ? array[i - 1] : next;
      const diff = WEEKDAY_ORDER.get(next) - WEEKDAY_ORDER.get(prev);
      assert(diff >= 0, 'diff >= 0');
      let range;
      if (diff <= 1 && ranges.length > 0) {
        range = ranges[ranges.length - 1];
      } else {
        range = ranges[ranges.length] = [];
      }
      range.push(next);
      return ranges;
    }, [])
    .map((range) => {
      if (range.length > 2) {
        return `${range[0]}-${range[range.length - 1]}`;
      } else if (range.length > 1) {
        return `${range[0]},${range[1]}`;
      } else {
        return range[0];
      }
    })
    .join(',');
}

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function stringify(ohss) {
  if (ohss == null) {
    return '';
  }

  if (!Array.isArray(ohss)) {
    ohss = [ohss];
  }

  const grouping1 = new Map();
  for (const ohs of ohss) {
    const dayOfWeeks = ensureArray(ohs.dayOfWeek);
    for (const dayOfWeek of dayOfWeeks) {
      const weekday = WEEKDAY.get(dayOfWeek);
      if (weekday == null) {
        continue;
      }

      const { opens, closes } = ohs;
      if (opens == null || closes == null) {
        continue;
      }

      const open = opens.slice(0, 5);
      const close = closes.slice(0, 5);
      if (open === close) {
        continue;
      }

      const timespan = `${open}-${close}`;

      let timespans = grouping1.get(weekday);
      if (timespans == null) {
        grouping1.set(weekday, timespans = []);
      }

      timespans.push(timespan);
    }
  }

  const grouping2 = new Map();
  for (const [weekday, timespans] of grouping1) {
    const timespan = timespans.sort().join(',');
    let weekdays = grouping2.get(timespan);
    if (weekdays == null) {
      grouping2.set(timespan, weekdays = []);
    }
    weekdays.push(weekday);
  }

  for (const weekdays of grouping2.values()) {
    weekdays.sort(compareWeekdayOrder);
  }

  const rules = Array
    .from(grouping2)
    .sort((a, b) => compareWeekdayOrder(a[1][0], b[1][0]))
    .map(([timespan, wws]) => {
      const range = stringifyWeekdays(wws);
      return `${range} ${timespan}`;
    });

  return rules.join('; ');
}

exports.stringify = stringify;
