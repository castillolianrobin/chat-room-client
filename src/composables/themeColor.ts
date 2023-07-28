import { inject, isRef, provide, type PropType, type Ref } from "vue";

export const defaultColor = 'primary-500';

/** 
 * Initialize a theme provider 
 */
export function createThemedColor(color?: Color | '') {
  provide("themeColor", color);
  return { color, defaultColor };
};


/** 
 * use the closest parent's theme color 
 */
export function useThemedColor(_color: Color = defaultColor) {
  // Inject theme color provider
  const colorProvider = inject<Color | ''>('themeColor', '' );
  const isProviderReactive =  isRef(colorProvider);
  const isProviderEmpty = isProviderReactive ? !colorProvider.value : !colorProvider;
  const color = isProviderEmpty ?  _color : colorProvider;

  return { color, defaultColor };  
};

/** You can pass the color parameter to useThemedColor() as props (use toRefs to make it reactive) */
export const themedColorProps = {
  color: { type: String as PropType<ThemeColors>, default: defaultColor, required: false },
}


/** TYPE DEFINIITION */

/** Hook parameter type */
type Color = ThemeColors | Ref<ThemeColors|undefined>;

/** List of available color names in the project's theme */
type ThemeNames = 'primary'|'secondary'|'accent'|'info'|'alert'|'error'|'success';

/** Type format definition for availble theme colors */
export type ThemeColors = `${ThemeNames}-${number}`|'black'|'white'|`[${string}]`;