import React, { Fragment, PureComponent } from 'react'
import { Button, Header, List } from 'semantic-ui-react'
import Helmet from 'react-helmet'

export interface ExpensesProps {
  items: string[]
  addItem: () => void
}

export class Expenses extends PureComponent<ExpensesProps> {
  render() {
    const { addItem, items } = this.props

    return (
      <Fragment>
        <Helmet>
          <title>Expenses - Simply Budget Receipts</title>
        </Helmet>
        <Header as="h1">Hello, this is Expenses!</Header>
        <p>Here will be expenses page when I have time to write it :)</p>
        <List bulleted>
          {items.map(item => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
        <Button onClick={addItem}>Add item</Button>
      </Fragment>
    )
  }
}
