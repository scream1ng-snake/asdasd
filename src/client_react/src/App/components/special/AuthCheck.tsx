import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { FC } from 'react';
import { FullscreenLoading } from '../common';
import { useStore } from '../../hooks';

export const Checker: FC<haveChildren> = observer(({ children }) => {
  const { auth } = useStore();
  const { isAuth, isCheckingAuth } = auth;


  if (isAuth) return children;

  if (isCheckingAuth) return <FullscreenLoading />

  return (
    <Navigate
      replace
      to="/authorize"
    />
  );
})


