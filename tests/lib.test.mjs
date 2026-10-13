import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const Lib = createRequire(import.meta.url)('../src/lib.js');

test('zonedToUtc: Paris summer is UTC+2', () => {
  assert.equal(new Date(Lib.zonedToUtc('2027-06-19T16:00', 'Europe/Paris')).toISOString(), '2027-06-19T14:00:00.000Z');
});
test('zonedToUtc: Paris winter is UTC+1', () => {
  assert.equal(new Date(Lib.zonedToUtc('2027-01-19T16:00', 'Europe/Paris')).toISOString(), '2027-01-19T15:00:00.000Z');
});
test('zonedToUtc: Asia/Almaty and New York', () => {
  assert.equal(new Date(Lib.zonedToUtc('2027-06-19T16:00', 'Asia/Almaty')).toISOString(), '2027-06-19T11:00:00.000Z');
  assert.equal(new Date(Lib.zonedToUtc('2027-06-19T16:00', 'America/New_York')).toISOString(), '2027-06-19T20:00:00.000Z');
});
test('zonedToUtc: day of a DST change keeps the wall time', () => {
  // Paris clocks go forward 2027-03-28 at 02:00; 16:00 that day is already UTC+2
  assert.equal(new Date(Lib.zonedToUtc('2027-03-28T16:00', 'Europe/Paris')).toISOString(), '2027-03-28T14:00:00.000Z');
});
test('countdown splits time and reports done', () => {
  const t = 10 * 86400e3 + 3 * 3600e3 + 4 * 60e3 + 5e3;
  assert.deepEqual(Lib.countdown(t, 0), { done: false, days: 10, hours: 3, minutes: 4, seconds: 5 });
  assert.equal(Lib.countdown(1000, 1000).done, true);
  assert.equal(Lib.countdown(1000, 5000).days, 0);
});
test('plural: Russian forms', () => {
  const f = { one: 'день', few: 'дня', many: 'дней', other: 'дня' };
  assert.equal(Lib.plural('ru-RU', 1, f), 'день');
  assert.equal(Lib.plural('ru-RU', 3, f), 'дня');
  assert.equal(Lib.plural('ru-RU', 248, f), 'дней');
});
test('RSVP validation', () => {
  const cfg = { maxGuests: 4 };
  assert.deepEqual(Lib.validateRsvp({ fullName: '', attendance: '' }, cfg), { fullName: 'required', attendance: 'required' });
  assert.deepEqual(Lib.validateRsvp({ fullName: 'Al', attendance: 'no' }, cfg), {});
  assert.equal(Lib.validateRsvp({ fullName: 'Anna', attendance: 'yes', guests: '9' }, cfg).guests, 'range');
  assert.equal(Lib.validateRsvp({ fullName: 'Anna', attendance: 'yes', guests: '2' }, cfg).guests, undefined);
});
test('submitRsvp never reports success without an endpoint or 2xx', async () => {
  const v = { fullName: 'Anna', attendance: 'yes', guests: '2', dietary: '', message: '', website: '' };
  assert.equal((await Lib.submitRsvp(v, { endpoint: '' }, null)).status, 'not-configured');
  assert.equal((await Lib.submitRsvp(v, { endpoint: 'x' }, async () => ({ ok: false, status: 500 }))).status, 'error');
  assert.equal((await Lib.submitRsvp(v, { endpoint: 'x' }, async () => { throw new Error('offline'); })).status, 'error');
  assert.equal((await Lib.submitRsvp(v, { endpoint: 'x' }, async () => ({ ok: true }))).status, 'ok');
});
