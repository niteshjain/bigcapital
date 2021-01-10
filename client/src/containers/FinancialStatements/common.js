import { mapKeys, omit, snakeCase } from 'lodash';
import { formatMessage } from 'services/intl';

export const displayColumnsByOptions = [
  { key: 'total', name: 'Total', type: 'total', by: '' },
  { key: 'year', name: 'Date/Year', type: 'date_periods', by: 'year' },
  { key: 'month', name: 'Date/Month', type: 'date_periods', by: 'month' },
  { key: 'week', name: 'Date/Week', type: 'date_periods', by: 'month' },
  { key: 'day', name: 'Date/Day', type: 'date_periods', by: 'day' },
  { key: 'quarter', name: 'Date/Quarter', type: 'date_periods', by: 'quarter' },
];

export const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: formatMessage({ id: 'all_accounts' }),
    hint: formatMessage({ id: 'all_accounts_including_with_zero_balance' }),
  },
  {
    key: 'without-zero-balance',
    name: formatMessage({ id: 'accounts_without_zero_balance' }),
    hint: formatMessage({
      id: 'include_accounts_and_exclude_zero_balance',
    }),
  },
  {
    key: 'with-transactions',
    name: formatMessage({ id: 'accounts_with_transactions' }),
    hint: formatMessage({
      id: 'include_accounts_once_has_transactions_on_given_date_period',
    }),
  },
];

export const transformDisplayColumnsType = (form) => {
  const columnType = displayColumnsByOptions.find(
    (o) => o.key === form.displayColumnsType,
  );
  return {
    displayColumnsBy: columnType ? columnType.by : '',
    displayColumnsType: columnType ? columnType.type : 'total',
  };
};

export const transformFilterFormToQuery = (form) => {
  return mapKeys({
    ...omit(form, ['accountsFilter']),
    ...transformDisplayColumnsType(form),
    noneZero: form.accountsFilter === 'without-zero-balance',
    noneTransactions: form.accountsFilter === 'with-transactions',
  }, (v, k) => snakeCase(k));
};