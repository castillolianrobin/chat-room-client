import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { AppButton } from '../';
import { defaultSlotTest } from '../../__tests__/helpers/slot.spec';
const name = 'AppButton';

describe(name, () => {

  it('renders a button element', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders a link element if to prop is not empty', () => {
    const wrapper = mount(AppButton, { props: { to: '/form'} })
    expect(wrapper.find('routerlink').attributes()).toHaveProperty('to')
    expect(wrapper.find('routerlink').exists()).toBe(true)
  })

  it('emits a click event when clicked', () => {
    const wrapper = mount(AppButton)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })

  /** test if hover is working */
  const wrapper = mount(AppButton);
  const classes = wrapper.classes();
  it('has hover css', ()=>{
    const hoverClasses = classes.filter(
      _class=>_class.includes('hover:')  
    );
    expect(hoverClasses.length).greaterThan(0);
  })

  /** test if focus is working */ 
  it('has focus css', ()=>{
    const focusClasses = classes.filter(
      _class=>_class.includes('focus:')  
    );
    expect(focusClasses.length).greaterThan(0);
  })

  /** test if active is working */
  it('has active css', ()=>{
    const activeClasses = classes.filter(
      _class=>_class.includes('active:')  
    );
    expect(activeClasses.length).greaterThan(0);
  })

  /** test if disabled css is working */
  it('has working disabled', async ()=>{
    await wrapper.setProps({ disabled: true });
    const disabledClass = wrapper.classes().filter(
      _class => _class.includes('disabled')
    );
    expect(disabledClass.length).greaterThan(0);
    expect(disabledClass.length).greaterThan(0);
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  })

  /** test if loading css is working */

  /** test if variant is working */

  /** test if sizes is working */

  defaultSlotTest(AppButton);
})
