import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const cases = JSON.parse(readFileSync(new URL('./composition-cases.json', import.meta.url), 'utf8'));
const appliesToTicket = (capability, ticket) =>
  capability.scope.project === ticket.project &&
  capability.scope.ticket === ticket.id &&
  ticket.completed === false;
const isSecurityCompatible = (candidate, contract) =>
  candidate.independent === true &&
  candidate.readOnly === true &&
  JSON.stringify(candidate.assessedScope) === JSON.stringify(contract.requiredScope) &&
  candidate.inputRevision === contract.requiredRevision &&
  candidate.evidenceRefs.length > 0 &&
  candidate.limitations.length > 0 &&
  contract.requiredFields.every(field => Object.hasOwn(candidate, field));
const omissionIsAllowed = omission =>
  omission.reason === 'not-applicable' ||
  (omission.reason === 'owner-explicitly-omitted' && omission.ownerDecision === true);
const projectGateState = gate =>
  gate.corporateCi === gate.requiredCiStatus ? 'passed' : 'blocked';

test('ticket capability applies only to its open, matching ticket', () => {
  const [capability] = cases.scope.ticketCapabilities;
  const [frontend, backend, nextFrontend] = cases.scope.tickets;
  assert.equal(appliesToTicket(capability, frontend), true);
  assert.equal(appliesToTicket(capability, backend), false);
  assert.equal(appliesToTicket(capability, nextFrontend), false);
  assert.equal(appliesToTicket(capability, {...frontend, completed: true}), false);
  assert.equal(capability.expires, 'ticket-completion');
});

test('explicit omission does not waive approval or independent authority', () => {
  const [notApplicable, explicit, unsupported] = cases.scope.omissions;
  assert.equal(omissionIsAllowed(notApplicable), true);
  assert.equal(omissionIsAllowed(explicit), true);
  assert.equal(omissionIsAllowed(unsupported), false);
});

test('security replacement requires complete, read-only, independent evidence', () => {
  const [compatible, incompatible] = cases.securityReplacement.candidates;
  assert.equal(isSecurityCompatible(compatible, cases.securityReplacement), true);
  assert.equal(isSecurityCompatible(incompatible, cases.securityReplacement), false);
});

test('unavailable project CI remains blocked despite a passing local check', () => {
  const gate = cases.projectGate;
  const appliesToProject = project => gate.appliesOnlyTo.includes(project);
  assert.equal(appliesToProject('SYN-HDC'), true);
  assert.equal(appliesToProject('SYN-OTHER'), false);
  assert.equal(projectGateState(gate), 'blocked');
  assert.equal(gate.localCheck, 'passed');
  assert.equal(gate.corporateCi, 'unavailable');
  assert.notEqual(gate.corporateCi, 'passed');
  assert.equal(gate.prDescription, 'prepared');
  assert.notEqual(gate.prPublication, 'opened');
});
