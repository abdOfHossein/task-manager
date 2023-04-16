import { EventEnum } from '../enums/event.enum';

export default {
  section: 'event',
  values: {
    EVENT_NOT_EXISTS: {
      key: 100000,
      value: EventEnum.EVENT_NOT_EXISTS,
    },
    EVENT_ALREADY_EXISTS: {
      key: 100001,
      value: EventEnum.EVENT_ALREADY_EXISTS,
    },
  },
};
