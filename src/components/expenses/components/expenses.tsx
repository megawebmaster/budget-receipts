import React, { FC, Fragment } from "react"
import Helmet from "react-helmet"
import { MonthList } from "../../month-list"
import { AvailableRoutes } from "../../../routes/routes"

export type ExpensesProps = {}

export const Expenses: FC<ExpensesProps> = () => (
  <Fragment>
    <Helmet>
      <title>Expenses - Simply Budget Receipts</title>
    </Helmet>
    <MonthList route={AvailableRoutes.EXPENSES}/>
  </Fragment>
)
