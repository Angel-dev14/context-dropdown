import { Option } from '../context-dropdown/model/option';

export const optionsData: Option[] = [
  {
    id: 1,
    name: 'Pizza',
    type: 'Pizza',
    subOptions: [
      {
        id: 1,
        name: 'Pepperoni',
        type: 'Pizza',
        subOptions: [
          {
            id: 1,
            name: 'Extra Cheese',
            type: 'Pizza',
            subOptions: [
              { id: 1, name: 'Mozarella', type: 'Pizza' },
              { id: 2, name: 'Cheddar', type: 'Pizza' },
            ],
          },
          { id: 2, name: 'Spicy Pepperoni', type: 'Pizza' },
          { id: 3, name: 'Double Layer', type: 'Pizza' },
        ],
      },
      {
        id: 2,
        name: 'Margherita',
        type: 'Pizza',
        subOptions: [
          { id: 1, name: 'Basil', type: 'Pizza' },
          { id: 2, name: 'No Cheese', type: 'Pizza' },
        ],
      },
      {
        id: 3,
        name: 'Capricciosa',
        type: 'Pizza',
        subOptions: [
          { id: 1, name: 'Artichokes', type: 'Pizza' },
          { id: 2, name: 'Ham', type: 'Pizza' },
          { id: 3, name: 'Olives', type: 'Pizza' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Spaghetti',
    type: 'Spaghetti',
    subOptions: [
      {
        id: 1,
        name: 'Bolognese',
        type: 'Spaghetti',
        subOptions: [
          { id: 1, name: 'Extra Meat', type: 'Spaghetti' },
          { id: 2, name: 'Gluten-Free', type: 'Spaghetti' },
        ],
      },
      {
        id: 2,
        name: 'Al Dente',
        type: 'Spaghetti',
        subOptions: [
          { id: 1, name: 'Olive Oil', type: 'Spaghetti' },
          { id: 2, name: 'Garlic', type: 'Spaghetti' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Macaroni',
    type: 'Macaroni',
    subOptions: [
      {
        id: 1,
        name: 'Cheese',
        type: 'Macaroni',
        subOptions: [
          { id: 1, name: 'Four Cheese', type: 'Macaroni' },
          { id: 2, name: 'Smoked Gouda', type: 'Macaroni' },
        ],
      },
      { id: 2, name: 'Tomato Sauce', type: 'Macaroni' },
      { id: 2, name: 'Plain', type: 'Macaroni' },
    ],
  },
  {
    id: 4,
    name: 'Salad',
    type: 'Salad',
    subOptions: [],
  },
];
