import React, { FC, Fragment, ReactNode } from 'react'
import { NavLink } from 'redux-first-router-link'
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, Menu, MenuItem, Responsive } from 'semantic-ui-react'
import { Action as RouterAction } from 'redux-first-router'

import styles from './responsive-menu.module.css'

type MenuItem = {
  id: string
  items: Item[]
}

type Item = {
  id: string
  route: RouterAction
  text: string
}

type ResponsiveMenuProps = {
  items: MenuItem[]
  label: string
  children?: ReactNode
}

type ItemsProps = {
  items: Item[]
  as: any
}

const Items: FC<ItemsProps> = ({ items, as: Item }) => (
  <Fragment>
    {items.map(item => (
      <Item
        key={`item-${item.id}`}
        as={NavLink}
        activeClassName="active"
        to={item.route}
      >
        {item.text}
      </Item>
    ))}
  </Fragment>
)

export const ResponsiveMenu: FC<ResponsiveMenuProps> = ({ items, label, children }) => (
  <Fragment>
    <Responsive
      as="div"
      maxWidth={Responsive.onlyTablet.maxWidth}
      className={styles.dropdownContainer}
    >
      <Dropdown
        button
        fluid
        scrolling
        className={styles.dropdown}
        text={label}
      >
        <DropdownMenu>
          {items.map((menu, idx) => (
            <Fragment key={menu.id}>
              <Items items={menu.items} as={DropdownItem} />
              {idx !== items.length - 1 && (
                <DropdownDivider />
              )}
            </Fragment>
          ))}
        </DropdownMenu>
      </Dropdown>
      {children}
    </Responsive>
    <Responsive
      as={Fragment}
      {...Responsive.onlyComputer}
    >
      {items.map(menu => (
        <Menu vertical fluid key={menu.id}>
          <Items items={menu.items} as={MenuItem} />
        </Menu>
      ))}
    </Responsive>
  </Fragment>
)
