import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyReceiptViaSMSContext } from './NotifyReceiptViaSMSFormProvider';
import { transformErrors } from '../../../containers/NotifyViaSMS/utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const notificationType = {
  key: 'sale-receipt-details',
  label: 'Sale receipt details',
};

/**
 * Notify Receipt Via SMS Form.
 */
function NotifyReceiptViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    receiptId,
    receiptSMSDetail,
    createNotifyReceiptBySMSMutate,
  } = useNotifyReceiptViaSMSContext();

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_receipt_via_sms.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    createNotifyReceiptBySMSMutate([receiptId, values])
      .then(onSuccess)
      .catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };
  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...receiptSMSDetail,
    }),
    [receiptSMSDetail],
  );

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={notificationType}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
    />
  );
}

export default compose(withDialogActions)(NotifyReceiptViaSMSForm);