import { DataTransfer, File } from "happy-dom"
import { inputTest } from "@/components/__tests__/helpers/form.spec";
import { namedSlotTest } from "@/components/__tests__/helpers/slot.spec";
import { validationTest } from "@/components/__tests__/helpers/validation.spec";
import { describe, expect, it, vi } from "vitest";
import { AppFormFile as component } from '../'
import { mount } from "@vue/test-utils";
const name = 'AppFormFile';

describe(name, async ()=> {
  const dT = new DataTransfer()
  await dT.items.add(new File(['foo'], 'programmatically_created.txt'))
  // validation test
  validationTest(
    component, 
    { props: { modelValue: dT.files } },
    {
      extraFunction: async ()=> {
        it('limit the maximum file size', async ()=> {
          const maxSize = 10;
          const wrapper = mount(component, {
            props: { maxSize, modelValue: [] },
          });

          const fileLimitLabel = wrapper.find('[aria-label="file limit"]');
          
          expect(fileLimitLabel.text())
            .toContain(`Max file size: ${maxSize} KB`);

          const dT = new DataTransfer()
          const largeFile = new File(
            ['foo'], 
            'programmatically_created.txt',
          );
          await Object.defineProperty(largeFile, 'size', { 
            value: 100000,
            configurable: true, 
          })
          dT.files.push(largeFile);
          await wrapper.setProps({
            'onUpdate:modelValue': (e:File[]) => wrapper.setProps({modelValue: e}),
          });
          const dropbox = wrapper.find('[aria-label="dropzone box"]');
          await dropbox.trigger('drop', { dataTransfer: dT });
          await wrapper.vm.$nextTick();
          const errorTag = wrapper.find('[aria-label="error"]');
          expect(errorTag.text()).toContain(`exceeded ${maxSize} KB`);
        })
      }
    }
  );
  // input test
  inputTest(component, {
    options: { props: { modelValue: [] } },
    newValue: dT.files,
    disableTest: async (wrapper, testEmit)=> {
      const inputFile = wrapper.find('[type="file"]');
      await inputFile.trigger('change')
      await testEmit();
    },
  });

  describe('Dropzone', ()=> {
    // size in  bytes
    const maxSize = 1000;
    const accept = 'image/*'; 
    const wrapper = mount(component, {
      props: {
        maxSize,
        accept,
      },
    });
    const fileLimitLabel = wrapper.find('[aria-label="file limit"]');

    it('display the accepted file type', ()=> {
      expect(fileLimitLabel.text())
        .toContain(`Supported file type: ${accept}`);
    })

    it('can drop file to input', async ()=> {
      let modelValue:File[] = [];
      await wrapper.setProps({
        modelValue,
        'onUpdate:modelValue': (e:File[]) => modelValue = e,
      })
      const dropbox = wrapper.find('[aria-label="dropzone box"]')

      const dT = new DataTransfer()
      dT.files.push(new File(['foo'], 'programmatically_created.txt'));
      await dropbox.trigger('drop', { dataTransfer: dT });
      expect(modelValue).toEqual(dT.files);
    })

    it('can remove file', async ()=> {
      await wrapper.setProps({
        multiple: true,
        modelValue: [],
        'onUpdate:modelValue': (e:File[]) => wrapper.setProps({modelValue: e}),
      })
      const dropbox = wrapper.find('[aria-label="dropzone box"]')
      
      const dT = new DataTransfer()
      dT.files.push(new File(['foo'], 'programmatically_created.txt'));
      dT.files.push(new File(['foo'], 'programmatically_created.txt'));
      dT.files.push(new File(['foo'], 'programmatically_created.txt'));
      await dropbox.trigger('drop', { dataTransfer: dT });
      await wrapper.vm.$nextTick();
      const closeIcon = ()=> wrapper.find('[aria-label="file 3 close icon"]');
      await closeIcon()?.trigger('click');
      
      // should be less then original value
      expect(wrapper.props('modelValue')?.length).toBeLessThan(dT.files.length)
    })

    namedSlotTest(component, 'display');
    namedSlotTest(component, 'dropzone-title');
    namedSlotTest(component, 'dropzone-subtitle');
    
  });

  describe('Default Input', ()=> {
    // slot tests
    namedSlotTest(component, 'prepend', { props: { defaultInput: true } });
    namedSlotTest(component, 'append', { props: { defaultInput: true } });
    namedSlotTest(component, 'display', { props: { defaultInput: true } });

  });


  // it('return array of files as modelValue', {})
})