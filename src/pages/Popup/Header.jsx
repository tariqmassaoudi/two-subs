import React from 'react';
import { styled } from '@material-ui/core/styles';
import openPage from './openPage';

const Title = styled('h1')({
  color: 'black !important',
  marginTop: '20px !important',
  textAlign: 'center !important',
  fontSize: '24px !important',
  fontWeight: '400 !important',
});

const Icon = styled('img')({
  display: 'block !important',
  margin: '30px auto 40px auto !important',
  cursor: 'pointer',
});

const Header = ({ popup }) => {
  return (
    <>
      <Title>Two Subs</Title>
      <Icon
        src={chrome.runtime.getURL('logo.png')}
        alt="Logo"

      ></Icon>
    </>
  );
};

export default Header;
