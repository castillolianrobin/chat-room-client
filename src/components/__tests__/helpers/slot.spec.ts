import { mount, VueWrapper } from "@vue/test-utils";
import { expect, it } from "vitest";


/** DEFAULT SLOT TEST */
export const defaultSlotTest = (component:any, options?:MountOptionsParams, executables?:Executables) => {  
  it('renders default slot', async () => {
    const defaultSlot_class = 'default-class';
    const defaultSlot_text = 'Test 1';
    const wrapper = mount(component, {
      slots: {
        default: `<div class="${defaultSlot_class}">${defaultSlot_text}</div>`
      },
      ...options,
    });

    if (executables?.afterMount) {
      try { await executables.afterMount(wrapper) } 
      catch(e) { console.error(e) }
    }
    executables?.afterMount && console.log();

    
    const defaultSlot_result = wrapper.findAll(`.${defaultSlot_class}`);
    expect(defaultSlot_result.length).toBe(1) 
    expect(defaultSlot_result[0].text()).toBe(defaultSlot_text);
  })
}

/** NAMED SLOT TEST */
export const namedSlotTest = (component:any, slotName: string, options?:MountOptionsParams, executables?: Executables) => {  
  it(`renders '${slotName}' slot`, () => {
    const namedSlot_class = 'slot-class';
    const namedSlot_text = 'Test 1';
    const wrapper = mount(component, {
      slots: {
        [slotName]: `<div class="${namedSlot_class}">${namedSlot_text}</div>`
      },
      ...options,
    })
    executables?.afterMount && executables?.afterMount(wrapper);
    const slot_result = wrapper.findAll(`.${namedSlot_class}`);
    expect(slot_result.length).toBe(1) 
    expect(slot_result[0].text()).toBe(namedSlot_text);
  })
}


/** TYPE DEFINITIONS */

type MountParams  = Parameters<typeof mount>; 
type MountOptionsParams  = MountParams[1] | Record<string, any>; 

interface Executables {
  afterMount: (wrapper: VueWrapper<any>)=> void;
  // beforeMount: ()=> void;
};