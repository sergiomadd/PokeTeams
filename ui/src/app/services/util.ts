

export function getErrorMessage(error: unknown) 
{
  if(error instanceof Error)
  {
    return error.message;
  } 
  return error;
}

export function toCamelCase(o) {
  var newO, origKey, newKey, value
  if (o instanceof Array) {
    return o.map(function(value) {
        if (typeof value === "object") {
          value = toCamelCase(value)
        }
        return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamelCase(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}