import { Redirect } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import Spinner from '../layouts/Utils/Spinner';
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err) => {
    console.error('Sign in error: ', err);
  };

  if (!authState) {
    return <Spinner />;
  }

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: '/' }} />
  ) : (
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
  );
};

export default LoginWidget;
