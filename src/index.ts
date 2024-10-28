import {Theme, Color, BackgroundColor} from '@adobe/leonardo-contrast-colors'; 

let gray = new BackgroundColor({
    name: 'gray',
    colorKeys: ['#cacaca'],
    ratios: [2, 3, 4.5, 8]
  });
  
  let blue = new Color({
    name: 'blue',
    colorKeys: ['#5CDBFF', '#0000FF'],
    ratios: [3, 4.5]
  });
  
  let red = new Color({
    name: 'red',
    colorKeys: ['#FF9A81', '#FF0000'],
    ratios: [3, 4.5, 11]
  });
  
  let theme = new Theme({
    colors: [gray, blue, red],
    backgroundColor: gray,
    lightness: 97
  });
  
  // returns theme colors as JSON
  let colors = theme.contrastColors;

// Add this at the bottom to log the results
console.log('Generated Colors:', JSON.stringify(colors, null, 2));

// Export the theme and colors for use in other files
export { theme, colors };
