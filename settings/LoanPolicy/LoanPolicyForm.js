import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getFormValues } from 'redux-form';

import {
  cloneDeep,
  sortBy,
} from 'lodash';

import stripesForm from '@folio/stripes/form';
import { stripesShape } from '@folio/stripes/core';

import {
  Accordion,
  ExpandAllButton,
  Col,
  Row,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import LoanPolicy from '../Models/LoanPolicy';
import normalizeLoanPolicyForm from './utils/normalizeLoanPolicyForm';

import {
  AboutSection,
  LoansSection,
  RenewalsSection,
  CancelButton,
  SaveButton,
  PanelTitle,
  Metadata,
  DeleteEntry,
  RequestManagementSection,
} from './components';

class LoanPolicyForm extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.shape({
      fixedDueDateSchedules: PropTypes.object,
    }).isRequired,
    policy: PropTypes.object,
    initialValues: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    policy: {},
    initialValues: {},
  };

  state = {
    confirmDelete: false,
    sections: {
      generalSection: true,
      recallsSection: true,
      holdsSection: true,
      pagesSection: true,
    },
  };

  handleSectionToggle = ({ id }) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  generateScheduleOptions = () => {
    const {
      parentResources: {
        fixedDueDateSchedules: {
          records = [],
        } = {},
      },
    } = this.props;

    const sortedSchedules = sortBy(records, ['name']);
    return sortedSchedules.map(({ id, name }) => (<option key={id} value={id}>{name}</option>));
  };

  saveForm = (loanPolicy) => {
    const normalizedForm = normalizeLoanPolicyForm(loanPolicy);
    this.props.onSave(normalizedForm);
  };

  changeDeleteState = (confirmDelete) => {
    this.setState({ confirmDelete });
  };

  render() {
    const {
      onCancel,
      onRemove,
      pristine,
      policy,
      stripes,
      submitting,
      handleSubmit,
      initialValues,
      change,
    } = this.props;

    const {
      sections,
      confirmDelete,
    } = this.state;

    const {
      sections: {
        recallsSection,
        holdsSection,
        pagesSection,
      },
    } = this.state;

    const editMode = Boolean(policy.id);
    const schedules = this.generateScheduleOptions();

    return (
      <form onSubmit={handleSubmit(this.saveForm)}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={<CancelButton onCancel={onCancel} />}
            lastMenu={<SaveButton pristine={pristine} submitting={submitting} />}
            paneTitle={<PanelTitle editMode={editMode} />}
          >
            <React.Fragment>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
              <Accordion
                id="generalSection"
                open={sections.generalSection}
                label={<FormattedMessage id="ui-circulation.settings.loanPolicy.generalInformation" />}
                onToggle={this.handleSectionToggle}
              >
                <Metadata
                  connect={stripes.connect}
                  metadata={policy.metadata}
                />
                <AboutSection />
                <LoansSection
                  policy={policy}
                  change={change}
                  schedules={schedules}
                />
                <RenewalsSection
                  policy={policy}
                  schedules={schedules}
                />
                <RequestManagementSection
                  policy={policy}
                  holdsSectionOpen={holdsSection}
                  pagesSectionOpen={pagesSection}
                  recallsSectionOpen={recallsSection}
                  accordionOnToggle={this.handleSectionToggle}
                />
              </Accordion>
              {editMode &&
                <DeleteEntry
                  onRemove={onRemove}
                  policyName={policy.name}
                  initialValues={initialValues}
                  confirmDelete={confirmDelete}
                  changeDeleteState={this.changeDeleteState}
                />
              }
            </React.Fragment>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  policy: new LoanPolicy(getFormValues('entryForm')(state)),
});

const connectedLoanPolicyForm = connect(mapStateToProps)(LoanPolicyForm);

export default stripesForm({
  form: 'entryForm',
  navigationCheck: true,
  enableReinitialize: false,
})(connectedLoanPolicyForm);
