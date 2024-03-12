import { Option } from '../context-dropdown/model/option';

export const optionsData: Option[] = [
  {
    id: 1,
    name: 'Pizza',
    subOptions: [
      {
        id: 1,
        name: 'Pepperoni',
        subOptions: [
          { id: 1, name: 'Extra Cheese' },
          { id: 2, name: 'Spicy Pepperoni' },
          { id: 3, name: 'Double Layer' },
        ],
      },
      {
        id: 2,
        name: 'Margherita',
        subOptions: [
          { id: 1, name: 'Basil' },
          { id: 2, name: 'No Cheese' },
        ],
      },
      {
        id: 3,
        name: 'Capricciosa',
        subOptions: [
          { id: 1, name: 'Artichokes' },
          { id: 2, name: 'Ham' },
          { id: 3, name: 'Olives' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Spaghetti',
    subOptions: [
      {
        id: 1,
        name: 'Bolognese',
        subOptions: [
          { id: 1, name: 'Extra Meat' },
          { id: 2, name: 'Gluten-Free' },
        ],
      },
      {
        id: 2,
        name: 'Al Dente',
        subOptions: [
          { id: 1, name: 'Olive Oil' },
          { id: 2, name: 'Garlic' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Macaroni',
    subOptions: [
      {
        id: 1,
        name: 'Cheese',
        subOptions: [
          { id: 1, name: 'Four Cheese' },
          { id: 2, name: 'Smoked Gouda' },
        ],
      },
      { id: 2, name: 'Tomato Sauce' },
    ],
  },
  {
    id: 4,
    name: 'Salads',
    subOptions: [],
  },
];
