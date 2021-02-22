import React, { useMemo } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  Classes,
  ControlGroup,
  Button
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, useFormikContext, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { toSafeInteger } from 'lodash';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  AccountsSelectList,
  ContactSelecetList,
  FieldRequiredHint,
  InputPrependText,
  Money,
  Hint,
  Icon,
  MoneyInputGroup
} from 'components';
import withSettings from 'containers/Settings/withSettings';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  compose,
  safeSumBy,
  fullAmountPaymentEntries,
  amountPaymentEntries,
} from 'utils';

/**
 * Payment made form header fields.
 */
function PaymentMadeFormHeaderFields({ baseCurrency }) {
  // Formik form context.
  const { values: { entries }, setFieldValue } = useFormikContext();

  // Payment made form context.
  const {
    vendors,
    accounts,
    isNewMode,
    setPaymentVendorId,
  } = usePaymentMadeFormContext();
  
  // Sumation of payable full-amount.
  const payableFullAmount = useMemo(() => safeSumBy(entries, 'due_amount'), [entries]);
  
  // Handle receive full-amount click.
  const handleReceiveFullAmountClick = () => {
    const newEntries = fullAmountPaymentEntries(entries);
    const fullAmount = safeSumBy(newEntries, 'payment_amount');

    setFieldValue('entries', newEntries);
    setFieldValue('full_amount', fullAmount);
  };

  // Handles the full-amount field blur.
  const onFullAmountBlur = (value) => {
    const newEntries = amountPaymentEntries(toSafeInteger(value), entries);
    setFieldValue('entries', newEntries);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------------ Vendor name ------------ */}
      <FastField name={'vendor_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'vendor_name'} />}
            inline={true}
            className={classNames('form-group--select-list', Classes.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'vendor_id'} />}
          >
            <ContactSelecetList
              contactsList={vendors}
              selectedContactId={value}
              defaultSelectText={<T id={'select_vender_account'} />}
              onContactSelected={(contact) => {
                form.setFieldValue('vendor_id', contact.id);
                setPaymentVendorId(contact.id);
              }}
              disabled={!isNewMode}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Payment date ------------ */}
      <FastField name={'customer_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              //   onChange={handleDateChange('payment_date')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Full amount ------------ */}
      <Field name={'full_amount'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            labelInfo={<Hint />}
            helperText={<ErrorMessage name="full_amount" />}
          >
            <ControlGroup>
              <InputPrependText text={baseCurrency} />
              <MoneyInputGroup
                value={value}
                onChange={(value) => {
                  setFieldValue('full_amount', value);
                }}
                onBlurValue={onFullAmountBlur}
              />
            </ControlGroup>

            <Button
              onClick={handleReceiveFullAmountClick}
              className={'receive-full-amount'}
              small={true}
              minimal={true}
            >
              Receive full amount (
              <Money amount={payableFullAmount} currency={baseCurrency} />)
            </Button>
          </FormGroup>
        )}
      </Field>

      {/* ------------ Payment number ------------ */}
      <FastField name={'payment_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_no'} />}
            inline={true}
            className={('form-group--payment_number', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_number" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Payment account ------------ */}
      <FastField name={'payment_account_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_account'} />}
            className={classNames(
              'form-group--payment_account_id',
              'form-group--select-list',
              Classes.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'payment_account_id'} />}
          >
            <AccountsSelectList
              accounts={accounts}
              labelInfo={<FieldRequiredHint />}
              onAccountSelected={(account) => {
                form.setFieldValue('payment_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_payment_account'} />}
              selectedAccountId={value}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Reference ------------ */}
      <FastField name={'reference'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(PaymentMadeFormHeaderFields);