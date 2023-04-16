import { PublicEnum } from '../enums/public.enum';

export default {
  section: 'public',
  values: {
    ACCESS_IS_DENIDE: {
      key: 100000,
      value: PublicEnum.ACCESS_IS_DENIDE,
    },
    COLUMN_NOT_EXISTS: {
      key: 100001,
      value: PublicEnum.COLUMN_NOT_EXISTS,
    },

    DELETE_DENAY_RECORD_EXISTS_IN_RELATION: {
      key: 100002,
      value: PublicEnum.DELETE_DENAY_RECORD_EXISTS_IN_RELATION,
    },

    FIELD_DOES_NOT_EXIST: {
      key: 100003,
      value: PublicEnum.FIELD_DOES_NOT_EXIST,
    },

    PUBLIC_ERROR: {
      key: 100004,
      value: PublicEnum.PUBLIC_ERROR,
    },

    USER_NOT_EXISTS: {
      key: 100005,
      value: PublicEnum.USER_NOT_EXISTS,
    },

    UUID_NOT_MATCH: {
      key: 100006,
      value: PublicEnum.UUID_NOT_MATCH,
    },
    DUPLICATE_VALUE_IN_UNIQUE_COLUMN: {
      key: 100007,
      value: PublicEnum.DUPLICATE_VALUE_IN_UNIQUE_COLUMN,
    },
    INVALID_INPUT_FOR_ENUM: {
      key: 100008,
      value: PublicEnum.INVALID_INPUT_FOR_ENUM,
    },
    INPUT_TYPE_MUST_BE_STRING: {
      key: 100009,
      value: PublicEnum.INPUT_TYPE_MUST_BE_STRING,
    },
    FIELD_MUST_FILL: {
      key: 100010,
      value: PublicEnum.FIELD_MUST_FILL,
    },
    INPUT_TYPE_MUST_BE_INTEGER: {
      key: 100011,
      value: PublicEnum.INPUT_TYPE_MUST_BE_INTEGER,
    },
    INPUT_TYPE_MUST_BE_DATE: {
      key: 100012,
      value: PublicEnum.INPUT_TYPE_MUST_BE_DATE,
    },
    INPUT_TYPE_MUST_BE_ARRAY: {
      key: 100013,
      value: PublicEnum.INPUT_TYPE_MUST_BE_ARRAY,
    },
    INPUT_TYPE_MUST_BE_PHONE_NUMBER: {
      key: 100014,
      value: PublicEnum.INPUT_TYPE_MUST_BE_PHONE_NUMBER,
    },
    INPUT_TYPE_MUST_BE_EMAIL: {
      key: 100015,
      value: PublicEnum.INPUT_TYPE_MUST_BE_EMAIL,
    },
  },
};
