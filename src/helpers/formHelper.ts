export default {
  /**
   * @param {Object} formObject
   * @returns {FormData} FormData generated from a nested object that can be used on javascript http request
   */
  generateFormData<Obj extends object>(formObject: Obj) {
    let formDataBlueprint: any[] = [];
    for (const [key, value] of Object.entries(formObject)) {
      const formInputBlueprint = this.createKeyValuePair(key, value);
      if (Array.isArray(formInputBlueprint)) {
        formDataBlueprint = [...formDataBlueprint, ...formInputBlueprint];
      } else {
        formDataBlueprint.push(formInputBlueprint);
      }
    }
    const formData = new FormData();
    formDataBlueprint.forEach((value) => {
      formData.append(value.key, value.value);
    });

    return formData;
  },
  /**
   * @param {string} key
   * @param {*} value
   * @returns {Array} returns key-value pair object or an array of key-value pair object
   * Recursive function that creates a key value pair that can be appended for FormData Object
   */
  createKeyValuePair<Key extends string, Value>(key: Key, value: Value) {
    let multiValue: { key: string, value: any }[] = [];
    if (value === null || value === undefined) {
      return {
        key,
        value: '',
      };
    } else if (Array.isArray(value)) {
      value.forEach((subVal, subKey) => {
        const namespace = `${key}[${subKey}]`;
        const nestedVal = this.createKeyValuePair(namespace, subVal);
        if (Array.isArray(nestedVal)) {
          multiValue = [...multiValue, ...nestedVal];
        } else {
          multiValue.push(nestedVal);
        }
      });
      return multiValue;
    } else if (typeof value === 'object' && !this.isFile(value)) {
      for (const [subKey, subVal] of Object.entries(value)) {
        const namespace = `${key}[${subKey}]`;
        const nestedVal = this.createKeyValuePair(namespace, subVal);
        if (Array.isArray(nestedVal)) {
          multiValue = [...multiValue, ...nestedVal];
        } else {
          multiValue.push(nestedVal);
        }
      }
      return multiValue;
    } else {
      return {
        key,
        value,
      };
    }
  },
  /**
   * @param {*} input
   * @returns {Boolean} if the input is a File type
   */
  isFile(input: any) {
    if ('File' in window && input instanceof File) return true;
    else return false;
  },
};
