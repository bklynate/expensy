/* eslint-disable arrow-body-style */
// import uuid from 'uuid';
import { db } from './../firebase/firebase';

// Action List - Create action generators for these:

// component calls an action generator, which in turn returns an object
// the component then dispatchs an object to the redux store and it changes

// async redux
// component calls action generator
// action generator returns function
// component dispatches function
// function runs and has the ability to cause other actions

// ADD_EXPENSE
export const addExpense = expense => ({
  type: 'ADD_EXPENSE',
  expense
});

export const startAddExpense = (expenseData = {}) => dispatch => {
  const {
    description = '',
    note = '',
    amount = 0,
    createdAt = 0
  } = expenseData;
  const expense = { description, note, amount, createdAt };
  return db.ref('expenses').push(expense).then(ref => {
    dispatch(
      addExpense({
        id: ref.key,
        ...expense
      })
    );
  });
};
// REMOVE_EXPENSE
export const removeExpense = ({ id } = {}) => ({
  type: 'REMOVE_EXPENSE',
  expense: { id }
});

export const startRemoveExpense = ({ id }) => {
  return (dispatch) => {
    return db.ref(`expenses/${id}`).remove().then(() => {
      dispatch(removeExpense({ id }))
    })
  }
}
// EDIT_EXPENSE
export const editExpense = ({ id, updates }) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});

export const startEditExpense = ({ id, updates }) => {
  return (dispatch) => {
    return db.ref(`expenses/${id}`).update({
      ...updates
    }).then(() => {
      dispatch(editExpense({
        id,
        updates
      }))
    })
  }
}

// SET_EXPENSE
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
})

export const startSetExpenses = () => {
  return (dispatch) => {
    return db.ref('expenses').once('value')
      .then(data => {
        const expenses = [];
        data.forEach(item => {
          expenses.push({
            id: item.key,
            ...item.val()
          })
        })
        dispatch(setExpenses(expenses));
      })
  }
};
