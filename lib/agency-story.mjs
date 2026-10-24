import { createStoryRecipe } from 'react-kino/recipes';

// Start from the editorial recipe; replace its scaffold with our own narrative.
// Application components stay in source and are referenced by stable names.
const editorial = createStoryRecipe('editorial');
export const agencyStory = {
  ...editorial,
  title: 'From first spark to first impression',
  scenes: [
  {
    "id": "clarity",
    "title": "Find the central idea",
    "duration": 170,
    "pin": true,
    "layout": "split",
    "background": "#242d25",
    "color": "#e9e6df",
    "layers": [
      {
        "id": "clarity-narrative",
        "kind": "component",
        "content": "ClarityNarrative",
        "track": {
          "start": 0,
          "end": 0.35,
          "from": {
            "y": 16,
            "opacity": 0.7
          },
          "to": {
            "y": 0,
            "opacity": 1
          },
          "easing": "ease-out"
        }
      },
      {
        "id": "clarity-visual",
        "kind": "component",
        "content": "ClarityVisual",
        "track": {
          "start": 0.05,
          "end": 0.85,
          "from": {
            "y": 24,
            "scale": 0.96,
            "opacity": 0.7
          },
          "to": {
            "y": 0,
            "scale": 1,
            "opacity": 1
          },
          "easing": "ease-out"
        }
      }
    ]
  },
  {
    "id": "expression",
    "title": "Give it a world of its own",
    "duration": 170,
    "pin": true,
    "layout": "split",
    "background": "#d6ff4a",
    "color": "#20251f",
    "layers": [
      {
        "id": "expression-narrative",
        "kind": "component",
        "content": "ExpressionNarrative",
        "track": {
          "start": 0,
          "end": 0.35,
          "from": {
            "y": 16,
            "opacity": 0.7
          },
          "to": {
            "y": 0,
            "opacity": 1
          },
          "easing": "ease-out"
        }
      },
      {
        "id": "expression-visual",
        "kind": "component",
        "content": "ExpressionVisual",
        "track": {
          "start": 0.05,
          "end": 0.85,
          "from": {
            "y": 24,
            "scale": 0.96,
            "opacity": 0.7
          },
          "to": {
            "y": 0,
            "scale": 1,
            "opacity": 1
          },
          "easing": "ease-out"
        }
      }
    ]
  }
]
};
export const storyRegistrations = ['ClarityNarrative', 'ClarityVisual', 'ExpressionNarrative', 'ExpressionVisual'];
