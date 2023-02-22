import * as React from 'react';
import { Appbar, Title } from 'react-native-paper';

const Header = (props) => {
  return (
    <Appbar.Header theme={{ colors: { primary: "#00aaff" }}}>
        <Title>{props.name}</Title>
    </Appbar.Header>
  );
};

export default Header;