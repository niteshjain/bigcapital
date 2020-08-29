import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

export default function EstimateFormFooter({
  formik: { isSubmitting },
  onSubmitClick,
  onCancelClick,
  invoice,
}) {
  return (
    <div className={'form__floating-footer'}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={() => {
          onSubmitClick({ redirect: true });
        }}
      >
        {invoice && invoice.id ? <T id={'edit'} /> : <T id={'save_send'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        name={'save'}
        type="submit"
        onClick={() => {
          onSubmitClick({ redirect: false });
        }}
      >
        <T id={'save'} />
      </Button>

      <Button className={'ml1'} disabled={isSubmitting}>
        <T id={'clear'} />
      </Button>

      <Button
        className={'ml1'}
        type="submit"
        onClick={() => {
          onCancelClick && onCancelClick();
        }}
      >
        <T id={'close'} />
      </Button>
    </div>
  );
}