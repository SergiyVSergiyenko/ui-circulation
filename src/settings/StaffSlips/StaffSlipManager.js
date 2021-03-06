import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import StaffSlipDetail from './StaffSlipDetail';
import StaffSlipForm from './StaffSlipForm';

class StaffSlipManager extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'staffSlips',
      path: 'staff-slips-storage/staff-slips',
      throwErrors: false,
    },
  });

  constructor() {
    super();
    this.validate = this.validate.bind(this);
  }

  validate(values) {
    const errors = {};

    if (!values.name) {
      errors.name = <FormattedMessage id="ui-circulation.settings.staffSlips.validation.required" />;
    }

    return errors;
  }

  render() {
    const {
      mutator,
      resources,
      label,
    } = this.props;

    return (
      <EntryManager
        {...this.props}
        parentMutator={mutator}
        entryList={sortBy((resources.entries || {}).records || [], ['name'])}
        detailComponent={StaffSlipDetail}
        paneTitle={label}
        entryLabel={label}
        entryFormComponent={StaffSlipForm}
        validate={this.validate}
        nameKey="name"
        permissions={{
          put: 'ui-circulation.settings.staff-slips',
          post: 'ui-circulation.settings.staff-slips.post',
          delete: 'ui-circulation.settings.staff-slips.delete'
        }}
      />
    );
  }
}

export default stripesConnect(StaffSlipManager);
