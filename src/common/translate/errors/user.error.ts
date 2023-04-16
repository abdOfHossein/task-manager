import { UserEnum } from '../enums/user.enum';
export default {
  section: 'user',
  values: {
    USER_NOT_EXISTS: {
      key: 100000,
      value: UserEnum.USER_NOT_EXISTS,
    },
    USER_ALREADY_EXISTS: {
      key: 100001,
      value: UserEnum.USER_ALREADY_EXISTS,
    },
    USER_DOES_NOT_HAVE_THIS_ROLE: {
      key: 100002,
      value: UserEnum.USER_DOES_NOT_HAVE_THIS_ROLE,
    },
    USER_MUST_ATLEAST_HAS_ONE_ROLE: {
      key: 100003,
      value: UserEnum.USER_MUST_ATLEAST_HAS_ONE_ROLE,
    },
  },
};
