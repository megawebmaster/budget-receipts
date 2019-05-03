import React, { FC, Fragment } from "react"
import Helmet from "react-helmet"
import { MonthList } from "../../month-list"
import { AvailableRoutes } from "../../../routes/routes"

export interface ExpensesProps {
  items: string[]
  addItem: () => void
}

export const Expenses: FC<ExpensesProps> = ({addItem, items}) => (
  <Fragment>
    <Helmet>
      <title>Expenses - Simply Budget Receipts</title>
    </Helmet>
    <MonthList baseRoute={{type: AvailableRoutes.EXPENSES, payload: {year: 2019}}}/>
  </Fragment>
)
