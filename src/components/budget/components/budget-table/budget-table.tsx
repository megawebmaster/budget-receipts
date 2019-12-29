import React, { FC, Fragment } from 'react'
import cx from 'classnames'
import { Button, Header, Input, Label, Responsive, Segment, SemanticCOLORS, Table } from 'semantic-ui-react'

import { Category } from '../../../categories'

import styles from './budget-table.module.css'

type BudgetTableProps = {
  className?: string
  color: SemanticCOLORS
  categories: Category[]
  editable: boolean
  label: string
}

// TODO: Extract sub-components

export const BudgetTable: FC<BudgetTableProps> = ({ label, color, categories, editable }) =>
  categories.length === 0 ? null : (
    <Segment.Group>
      <Segment.Group horizontal>
        <Segment basic color={color} className={styles.header}>
          <Header as="h3">{label}</Header>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>Planned: 2000.00 PLN</strong>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>Real: 2000.00 PLN</strong>
        </Segment>
      </Segment.Group>
      <Segment className={styles.content}>
        {categories.map(category => {
          const hasChildren = category.children && category.children.length > 0

          return (
            <Table
              key={category.id}
              singleLine
              compact
              className={cx(styles.table, { [styles.single]: !editable && !hasChildren })}
            >
              <Responsive
                as={Table.Header}
                minWidth={hasChildren ? Responsive.onlyTablet.minWidth : Responsive.onlyMobile.minWidth}
              >
                <Table.Row>
                  <Table.HeaderCell width={4}>
                    <span>{category.name}</span>
                  </Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    <Input fluid labelPosition="right" value={1200} disabled={hasChildren}>
                      <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                        Planned:
                      </Responsive>
                      <input />
                      <Label>PLN</Label>
                    </Input>
                  </Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    <Input fluid labelPosition="right" value={1300} disabled={hasChildren}>
                      <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                        Real:
                      </Responsive>
                      <input />
                      <Label>PLN</Label>
                    </Input>
                  </Table.HeaderCell>
                </Table.Row>
              </Responsive>
              {category.children && (
                <Table.Body>
                  {category.children.map(subcategory => (
                    <Table.Row key={subcategory.id}>
                      <Table.Cell>
                        <span>
                          <Responsive as={Fragment} {...Responsive.onlyMobile}>{category.name} - </Responsive>
                          {subcategory.name}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Input fluid labelPosition="right" value={1000}>
                          <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                            Planned:
                          </Responsive>
                          <input />
                          <Label>PLN</Label>
                        </Input>
                      </Table.Cell>
                      <Table.Cell><Input fluid labelPosition="right" value={900}>
                        <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                          Real:
                        </Responsive>
                        <input />
                        <Label>PLN</Label>
                      </Input>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
              {editable && (
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={3}>
                      <Button fluid basic size="tiny">Add subcategory…</Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          )
        })}
        {editable && (
          <Button fluid basic size="small">Add category…</Button>
        )}
      </Segment>
    </Segment.Group>
  )
