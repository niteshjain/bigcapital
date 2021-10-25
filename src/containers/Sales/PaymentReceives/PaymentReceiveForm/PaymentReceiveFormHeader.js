import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { Money } from 'components';
import { FormattedMessage as T } from 'components';

import { CLASSES } from 'common/classes';
import PaymentReceiveHeaderFields from './PaymentReceiveHeaderFields';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Payment receive form header.
 */
function PaymentReceiveFormHeader({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Formik form context.
  const { values } = useFormikContext();

  // Calculates the total payment amount from due amount.
  const paymentFullAmount = useMemo(
    () => sumBy(values.entries, 'payment_amount'),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        <PaymentReceiveHeaderFields />

        <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
          <div class="big-amount">
            <span class="big-amount__label">
              <T id={'amount_received'} />
            </span>
            <h1 class="big-amount__number">
              <Money amount={paymentFullAmount} currency={base_currency} />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default compose(withCurrentOrganization())(PaymentReceiveFormHeader);