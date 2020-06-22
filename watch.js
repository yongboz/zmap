export function watch(obj, key, func) {
  obj.$data = obj.$data ? obj.$data : {};
  obj.$data[key] = obj[key];
  Object.defineProperty(obj, key, {
    get: function () {
      return obj.$data[key];
    },
    set: function (val) {
      const oldValue = obj.$data[key];
      if (oldValue === val) return val;
      obj.$data[key] = val;
      func(oldValue, val);
      return val;
    },
  });
}
