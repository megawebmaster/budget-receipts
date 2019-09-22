import { connect, Omit } from 'react-redux'

import { AppState } from '../../../../../../app.store'

import { CategoryField, CategoryFieldProps } from './category-field'
import { dropdownCategories } from '../../../../../categories'
import { DropdownItemProps } from 'semantic-ui-react'

type StateProps = {
  categories: DropdownItemProps[]
}

const mapStateToProps = (state: AppState) => ({
  categories: dropdownCategories(state),
})

const CategoryFieldContainer = connect<StateProps, {}, Omit<CategoryFieldProps, keyof StateProps>, AppState>(
  mapStateToProps,
)(CategoryField)

export { CategoryFieldContainer as CategoryField }
