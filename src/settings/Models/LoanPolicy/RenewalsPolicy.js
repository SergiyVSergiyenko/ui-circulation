import { Period } from '../common';

export default class RenewalsPolicy {
  constructor(policy = {}) {
    this.unlimited = policy.unlimited || false;
    this.numberAllowed = policy.numberAllowed;
    this.period = new Period(policy.period);
    this.renewFromId = policy.renewFromId;
    this.differentPeriod = policy.differentPeriod || false;
    this.alternateFixedDueDateScheduleId = policy.alternateFixedDueDateScheduleId;
  }
}
