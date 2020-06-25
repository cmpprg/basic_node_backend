// build string to instruct user on format of json body request
const formatMsgBuilder = attributesAndDataTypesObj => {
  let message = 'Expected Format: { ';

  for (let attr of Object.keys(attributesAndDataTypesObj)) {
    let segment = `${attr}:<${attributesAndDataTypesObj[attr]}>`;
    message += `${segment}, `;
  };

  message = message.slice(0, -2);
  message += ' }.';
  return message;
};
// this is the module object
const checkHelper = {
  //ensure that required attributes for creating record exist in the body of request.
  checkAttributesInBody: (attributesAndDataTypesObj, body) => {
    for (let attribute of Object.keys(attributesAndDataTypesObj)){
      if (!body[attribute]) {
        let formatMsg = formatMsgBuilder(attributesAndDataTypesObj);
        let errorMessage = `${formatMsg} Your missing '${attribute}' property.`;
        return errorMessage;
      };
    };
  }
};

module.exports = checkHelper
