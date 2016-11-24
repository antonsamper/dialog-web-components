/**
 * Copyright 2016 Dialog LLC <info@dlg.im>
 */

import React, { PureComponent } from 'react';
import { Text } from '@dlghq/react-l10n';
import classNames from 'classnames';
import Input from '../Input/Input';
import Button from '../Button/Button';
import {
  LOGIN_SENT, CODE_REQUESTED, CODE_SENT,
  SIGNUP_STARTED, NAME_SENT, AUTH_FINISHED
} from './constants';
import styles from './AuthForm.css';

export type AuthValue = {
  login: string,
  code: string,
  name: string
};

export type Props = {
  id: string,
  className?: string,
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  value: AuthValue,
  autoFocus?: boolean,
  onChange: (value: AuthValue) => any,
  onSubmit: (value: AuthValue) => any
};


class AuthForm extends PureComponent {
  props: Props;

  static defaultProps = {
    id: 'form_login'
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(value, { target }) {
    this.props.onChange({
      ...this.props.value,
      [target.name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.value);
  }

  isLoading() {
    switch (this.props.step) {
      case LOGIN_SENT:
      case CODE_SENT:
      case NAME_SENT:
        return true;
      default:
        return false;
    }
  }

  renderButtonText() {
    const { step } = this.props;
    if (step < CODE_REQUESTED) {
      return <Text id="AuthForm.request_code" />;
    }

    if (step < SIGNUP_STARTED) {
      return <Text id="AuthForm.check_code" />;
    }

    if (step < AUTH_FINISHED) {
      return <Text id="AuthForm.sign_up" />;
    }

    return <Text id="AuthForm.success" />;
  }

  renderLogin() {
    const { id, step } = this.props;

    if (step > LOGIN_SENT) {
      return null;
    }

    return (
      <Input
        name="login"
        id={`${id}_login`}
        label="AuthForm.login"
        value={this.props.value.login}
        disabled={step >= LOGIN_SENT}
        autoFocus={this.props.autoFocus}
        onChange={this.handleChange}
      />
    );
  }

  renderCode() {
    const { id, step } = this.props;

    if (step < CODE_REQUESTED) {
      return null;
    }

    return (
      <Input
        name="code"
        id={`${id}_code`}
        label="AuthForm.code"
        value={this.props.value.code}
        disabled={step >= CODE_SENT}
        autoFocus={this.props.autoFocus}
        onChange={this.handleChange}
      />
    );
  }

  renderName() {
    const { id, step } = this.props;

    if (step < SIGNUP_STARTED) {
      return null;
    }

    return (
      <Input
        name="name"
        id={`${id}_name`}
        label="AuthForm.name"
        value={this.props.value.name}
        disabled={step >= NAME_SENT}
        autoFocus={this.props.autoFocus}
        onChange={this.handleChange}
      />
    );
  }

  render() {
    const { id } = this.props;
    const className = classNames(styles.root, this.props.className);

    return (
      <form id={id} onSubmit={this.handleSubmit} className={className}>
        {this.renderLogin()}
        {this.renderCode()}
        {this.renderName()}
        <Button type="submit" theme="primary" loading={this.isLoading()} wide>
          {this.renderButtonText()}
        </Button>
      </form>
    );
  }
}

export default AuthForm;
