import { IconButton, List, ListItem, ListItemText, Menu, MenuItem, SwipeableDrawer } from '@material-ui/core';
import { BugReport, Menu as MenuIcon, Settings } from '@material-ui/icons';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { GITHUB_REPO } from '../../config';
import AccountWidget from '../AccountWidget';
import AppLogo from '../App/AppLogo';
import constants from '../constants';
import LocalizationMenu from '../Localization';
import SearchForm from '../Search/SearchForm';

const REPORT_BUG_PATH = `//github.com/${GITHUB_REPO}/issues`;

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: ${constants.fontWeightNormal};
  height: 100%;
  justify-content: center;
  margin: 0 12px;
  text-align: center;
`;

const BugLink = styled.a`
  font-size: ${constants.fontSizeMedium};
  font-weight: ${constants.fontWeightLight};
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;
  & svg {
    margin-right: 5px;
    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

const AppLogoWrapper = styled.div`
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const DropdownMenu = styled(Menu)`
  & .MuiMenu-paper {
    background: ${constants.primarySurfaceColor};
  }
`;

const DropdownMenuItem = styled(MenuItem)`
  color: ${constants.primaryTextColor} !important;
`;

const ToolbarHeader = styled(Toolbar)`
  backdrop-filter: blur(16px);
  background-color: ${constants.defaultPrimaryColorSolid} !important;
  height: 56px;
  left: 0;
  padding: 8px 16px !important;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;

  & a {
    color: ${constants.primaryTextColor};

    &:hover {
      color: ${constants.primaryTextColor};
      opacity: 0.6;
    }
  }
`;

const MenuContent = styled.div`
  background: ${constants.primarySurfaceColor};
  height: 100%;
  max-width: 300px;
  min-width: 220px;
`;

const MenuLogoWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const DrawerLink = styled(Link)`
  color: ${constants.textColorPrimary};
`;

const LinkGroup = ({ navbarPages }) => {
  return (
    <VerticalAlignToolbar>
      {navbarPages.map(page => (
        <TabContainer key={page.key}>
          <Link to={page.to}>{page.label}</Link>
        </TabContainer>
      ))}
    </VerticalAlignToolbar>
  );
};

LinkGroup.propTypes = {
  navbarPages: PropTypes.shape([{}]),
};

const SettingsGroup = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, [anchorEl]);

  return (
    <>
      <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)}>
        <Settings />
      </IconButton>
      <DropdownMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ style: { maxHeight: 600 } }}>
        {children}
      </DropdownMenu>
    </>
  );
};

const MenuButtonWrapper = styled.div`
  margin-right: 12px;
`;

const LogoGroup = ({ onMenuClick }) => (
  <div style={{ marginRight: 16 }}>
    <VerticalAlignToolbar>
      <MenuButtonWrapper>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
      </MenuButtonWrapper>
      <AppLogoWrapper>
        <AppLogo />
      </AppLogoWrapper>
    </VerticalAlignToolbar>
  </div>
);

LogoGroup.propTypes = {
  onMenuClick: PropTypes.func,
};

const SearchGroup = () => (
  <VerticalAlignToolbar style={{ marginLeft: 'auto' }}>
    <ActionSearch style={{ marginRight: 6, opacity: '.6' }} />
    <SearchForm />
  </VerticalAlignToolbar>
);

const AccountGroup = () => (
  <VerticalAlignToolbar>
    <AccountWidget />
  </VerticalAlignToolbar>
);

const ReportBug = ({ strings }) => (
  <DropdownMenuItem component="a" href={REPORT_BUG_PATH} target="_blank" rel="noopener noreferrer" >
    <BugReport style={{ marginRight: 32, width: 24, height: 24 }} />
    {strings.app_report_bug}
  </DropdownMenuItem>
);

ReportBug.propTypes = {
  strings: PropTypes.shape({}),
};

const LogOut = ({ strings }) => (
  <BugLink
    href={`${process.env.REACT_APP_API_HOST}/logout`}
    rel="noopener noreferrer"
  >
    <LogOutButton />
    <span>
      {strings.app_logout}
    </span>
  </BugLink>
);

LogOut.propTypes = {
  strings: PropTypes.shape({}),
};

const Header = ({
  location, disableSearch, navbarPages, drawerPages,
}) => {
  const [Announce, setAnnounce] = useState(null);
  const [menuIsOpen, setMenuState] = useState(false);
  const small = useSelector(state => state.browser.greaterThan.small);
  const user = useSelector(state => state.app.metadata.data.user);
  const strings = useSelector(state => state.app.strings);

  useEffect(() => {
    import('../Announce').then(ann => setAnnounce(ann.default));
  }, []);

  return (
    <>
      <ToolbarHeader>
        <VerticalAlignDiv>
          <LogoGroup onMenuClick={() => setMenuState(true)} />
          {small && <LinkGroup navbarPages={navbarPages} />}
        </VerticalAlignDiv>
        {!disableSearch && <SearchGroup />}
        <VerticalAlignDiv style={{ marginLeft: '16px' }}>
          {small && <AccountGroup />}
          <SettingsGroup>
            <LocalizationMenu />
            <ReportBug strings={strings} />
            {user ? <LogOut strings={strings} /> : null}
          </SettingsGroup>
        </VerticalAlignDiv>
        <SwipeableDrawer
          onOpen={() => setMenuState(true)}
          onClose={() => setMenuState(false)}
          open={menuIsOpen}
        >
          <MenuContent>
            <List>
              <MenuLogoWrapper>
                <div>
                  <AppLogo onClick={() => setMenuState(false)} />
                </div>
              </MenuLogoWrapper>
              {drawerPages.map(page => (
                <DrawerLink key={`drawer__${page.to}`} to={page.to}>
                  <ListItem button key={`drawer__${page.to}`} onClick={() => setMenuState(false)}>
                    <ListItemText primary={page.label} />
                  </ListItem>
                </DrawerLink>
              ))}
            </List>
          </MenuContent>
        </SwipeableDrawer>
      </ToolbarHeader>
      { location.pathname !== '/' && Announce && <Announce /> }
    </>
  );
};

Header.propTypes = {
  location: PropTypes.shape({}),
  disableSearch: PropTypes.bool,
  navbarPages: PropTypes.shape([{}]),
  drawerPages: PropTypes.shape([{}]),
};

export default Header;
