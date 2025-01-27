import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

// project import
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import NavItem from './NavItem';

function CollapseItem({ item, level }) {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem;

  const [openCollapse, setOpenCollapse] = useState(false);

  const { pathname } = useLocation();
  const isSelected =
  (!!item.url && !!matchPath({ path: item.url, end: false }, pathname)) || openItem === item.id;
  
  // Active menu item on page load
  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
  }, [pathname, item.id]);

  const handleToggleCollapse = () => {
    setOpenCollapse((prev) => !prev);
  };

  const itemTarget = item.target || '_self';
  const listItemProps = {
    component: item.children ? 'div' : Link,
    ...(item.children ? {} : { to: item.url, target: itemTarget }),
  };

  const Icon = item.icon;
  const itemIcon = Icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : null;

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        onClick={item.children ? handleToggleCollapse : () => handlerActiveItem(item.id)}
        selected={isSelected}
        aria-expanded={openCollapse}
        aria-controls={item.id}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter',
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: `2px solid ${theme.palette.primary.main}`,
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'primary.lighter',
              },
            },
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'transparent',
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'transparent',
              },
              bgcolor: 'transparent',
            },
          }),
        }}
      >
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter',
                },
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                }),
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                {item.title}
              </Typography>
            }
          />
        )}
        {item.children && (openCollapse ? <MdExpandLess /> : <MdExpandMore />)}
        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItemButton>
      {item.children && (
        <Collapse in={openCollapse} timeout="auto" unmountOnExit id={item.id}>
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} level={level + 1} />
          ))}
        </Collapse>
      )}
    </>
  );
}

CollapseItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
};

export default CollapseItem;
