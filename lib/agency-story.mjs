import { createStoryRecipe } from 'react-kino/recipes';

// Start from the editorial recipe; replace its scaffold with our own narrative.
// Application components stay in source and are referenced by stable names.
const editorial = createStoryRecipe('editorial');
export const agencyStory = {
  ...editorial,
  title: 'Useful automation starts with a clear workflow',
  scenes: [
  {
    "id": "clarity",
    "title": "Choose a practical starting point",
    "duration": 170,
    "pin": true,
    "layout": "split",
    "background": "#242d25",
    "color": "#e9e6df",
    "layers": [
      {
        "id": "clarity-narrative",
        "kind": "component",
        "content": "ClarityNarrative"
      },
      {
        "id": "clarity-visual",
        "kind": "component",
        "content": "ClarityVisual"
      }
    ]
  },
  {
    "id": "expression",
    "title": "Build with oversight",
    "duration": 170,
    "pin": true,
    "layout": "split",
    "background": "#d6ff4a",
    "color": "#20251f",
    "layers": [
      {
        "id": "expression-narrative",
        "kind": "component",
        "content": "ExpressionNarrative"
      },
      {
        "id": "expression-visual",
        "kind": "component",
        "content": "ExpressionVisual"
      }
    ]
  }
]
};
export const storyRegistrations = ['ClarityNarrative', 'ClarityVisual', 'ExpressionNarrative', 'ExpressionVisual'];
