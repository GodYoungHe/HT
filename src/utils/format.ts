// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

interface Obj {
  [key: string]: any;
}

export function stringifyNumbers(obj: Obj): Obj {
  const newObj: Obj = {};

  for (const key in obj) {
    if (typeof obj[key] === "number") {
      newObj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      newObj[key] = stringifyNumbers(obj[key]);
    } else if (Array.isArray(obj[key])) {
      newObj[key] = obj[key].map((item: any) => {
        if (typeof item === "number") {
          return item.toString();
        } else if (typeof item === "object") {
          return stringifyNumbers(item);
        } else {
          return item;
        }
      });
    } else {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
