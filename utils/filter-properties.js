const filterProperties = (rawObject, validProperties) => {
  return Object.entries(rawObject).reduce((acc, [key, value]) => {
    if (validProperties.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

module.exports = {
  filterProperties,
};
