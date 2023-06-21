// LN
import url from 'url';
// import * as superagent from 'superagent';
import path from 'path';
// import json_stringify_safe from 'json-stringify-safe';
import child_process from 'child_process';

// import { DEFAULT_ERROR_CHANNEL, sendViaSlack } from '../handlers/slack';
// import { ICustomRequest, IParams } from '../types/expressCustom';
// import { ENVIRONMENTS } from '../types/environment';
import fs from 'fs';

const MINUTE_IN_MILLISECOND = 1000 * 60; // A minute in milliseconds
const HOUR_IN_MILLISECOND = MINUTE_IN_MILLISECOND * 60; // An hour in milliseconds
const DAY_IN_MILLISECOND = HOUR_IN_MILLISECOND * 24; // 24 hours in milliseconds

function prepareToBeConsoled(str: unknown) {
  const parsedStr = convertToString(str).trim();
  const oneLineStr = `${parsedStr.split('\n').join('\\n ')}`;
  return {
    parsedStr,
    oneLineStr,
  };
}

function consoleError(errStr: unknown): void {
  const { parsedStr: parsedErrorStr, oneLineStr } = prepareToBeConsoled(errStr);
  // eslint-disable-next-line no-console
  console.error(oneLineStr);

  let functionName: string;
  try {
    // eslint-disable-next-line no-console
    functionName = arguments.callee.caller.name || 'Nameless func';
  } catch (e) {
    functionName = 'Nameless func';
  }
  // void sendViaSlack(parsedErrorStr, functionName, DEFAULT_ERROR_CHANNEL);
}

function consoleErrorAndThrow(errStr: unknown): never {
  const { parsedStr: parsedErrorStr } = prepareToBeConsoled(errStr);
  consoleError(parsedErrorStr);
  throw new Error(parsedErrorStr);
}

function consoleTemporarilyIgnoreError(errStr: unknown): void {
  consoleLog(errStr);
}

// function consoleKnownError(errStr: string): void {
//   const { oneLineStr } = prepareToBeConsoled(errStr);
//   const oneLineMessage = `KNOWN ERROR: ${oneLineStr}`;
//   // eslint-disable-next-line no-console
//   console.log(oneLineMessage);
//   // eslint-disable-next-line no-console
//   console.error(oneLineMessage);
// }

function consoleLog(logStr: unknown): void {
//   // This is required because of AWS CloudLog (see: https://forums.aws.amazon.com/thread.jspa?threadID=158643).

  const { oneLineStr } = prepareToBeConsoled(logStr);

//   // eslint-disable-next-line no-console
  console.log(oneLineStr);

//   // var params = {
//   //   Entries: [ /* required */
//   //     {
//   //       Detail: 'STRING_VALUE',
//   //       DetailType: 'STRING_VALUE',
//   //       EventBusName: 'STRING_VALUE',
//   //       Resources: [
//   //         'STRING_VALUE',
//   //         /* more items */
//   //       ],
//   //       Source: 'STRING_VALUE',
//   //       Time: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
//   //     },
//   //     /* more items */
//   //   ]
//   // };
//   // cSpell:disable-next
//   // eventbridge.putEvents(params, function(err, data) {
//   //   if (err) console.log(err, err.stack); // an error occurred
//   //   else     console.log(data);           // successful response
//   // });
//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#putEvents-property
//   // https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
}

// function consoleDebug(logStr: unknown): void {
//   if (process.env.NODE_ENV != 'production' || process.env.DEBUGGING_LEVEL) {
//     consoleLog(logStr);
//   }
// }

function assertEnvParams(envParamsToCheck: string | Array<string>) {
  const missingEnvParams: Array<string> = [];
  envParamsToCheck = Array.isArray(envParamsToCheck) ? envParamsToCheck : [envParamsToCheck];
  envParamsToCheck.forEach((param) => {
    if (!process.env[param]) {
      missingEnvParams.push(param);
    }
  });
  if (missingEnvParams.length) {
    consoleErrorAndThrow(
      `\n\nThe following environment param${
        1 < missingEnvParams.length ? 's are' : ' is'
      } missing: ${missingEnvParams.join(', ')}\n\n`
    );
  }
}

// async function sleepPromise(milliseconds: number): Promise<void> {
//   return new Promise((resolve, reject) => {
//     // utils.consoleLog(new Date().toISOString()+' - sleeping');

//     setTimeout(() => {
//       // utils.consoleLog(new Date().toISOString()+' - woke up');
//       resolve();
//     }, milliseconds || 200);
//   });
// }

// function getFullUrlFromReqObj<P extends IParams>(req: ICustomRequest<P>): string {
//   return decodeURIComponent(
//     url.format({
//       protocol: req.protocol,
//       host: req.get('host'),
//       pathname: req.originalUrl,
//     })
//   );
// }

// function convertRequestToString<P extends IParams>(req: ICustomRequest<P>) {
//   const logged_req = {
//     URL: getFullUrlFromReqObj(req),
//     // lang: req.headers["accept-language"], // TO DO: parse browser's language - https://stackoverflow.com/questions/11845471/how-can-i-get-the-browser-language-in-node-js-express-js
//     // useragent: req.headers['user-agent'], // Headers are already included
//     // referrerDomain: req.headers.referrer || req.headers.referer || '', // Headers are already included
//     ip: extractUserIpFromReq(req),
//     method: req.method + '/HTTP-VER' + req.httpVersion,
//     body: '',
//     query: req.query,
//     headers: req.headers,
//     id: req.id || '',
//   };

//   // Body
//   if (
//     req.headers['transfer-encoding'] ||
//     (req.headers['content-length'] && 0 < parseFloat(req.headers['content-length']))
//   ) {
//     const reqBody = convertToString(req.body);
//     logged_req.body = req.isBodyTooLong
//       ? `${reqBody.substring(0, 10)} ................... ${reqBody.substring(reqBody.length - 10, reqBody.length)}`
//       : reqBody;
//   }

//   return JSON.stringify(logged_req, null, 2);
// }

// // function addGetterToClass(fieldName: string, theClass: any) {
// //   let isNewGetter = false;
// //   if (!theClass.getterList) {
// //     isNewGetter = true;
// //     theClass.getterList = [];
// //   } else if (!theClass.getterList.includes(fieldName)) {
// //     isNewGetter = true;
// //   }

// //   if (isNewGetter) {
// //     theClass.getterList.push(fieldName);
// //     Object.defineProperty(theClass, fieldName, {
// //       get() {
// //         if (this['_' + fieldName]) {
// //           return this['_' + fieldName];
// //         } else {
// //           throw new Error(
// //             "ERROR! field '" +
// //               fieldName +
// //               "' was used before its value was loaded. It happened in the following class:\n" +
// //               JSON.stringify(theClass, null, 2)
// //           );
// //         }
// //       },
// //     });
// //   }
// // }

// async function runCLI(command: string): Promise<number> {
//   const fn = `runCLI (${command})`;
//   let exitCode: number;

//   consoleLog(`${fn} - Executing the following CLI: ${command}`);
//   return new Promise((resolve, reject) => {
//     child_process
//       .exec(command, (err, stdout, stderr) => {
//         const outputStr = `Exit code: ${exitCode}${stdout ? `\nStdout is:\n${stdout}` : ''}`;
//         if (exitCode) {
//           consoleError(`${fn} - ${outputStr} - Error is: ${err}\nStderr is:\n${stderr}`);
//           return reject(exitCode);
//         } else {
//           consoleLog(`${fn} - ${outputStr}`);
//           return resolve(exitCode);
//         }
//       })
//       .on('exit', (code) => {
//         exitCode = code || 0;
//       });
//   });
// }

// type objectOrArray = Record<string, unknown> | unknown[];
// function flatObject(theObject: objectOrArray, prefix: string = ''): objectOrArray {
//   if (theObject && typeof theObject == 'object') {
//     if (Array.isArray(theObject)) {
//       const resultObj: unknown[] = [];
//       theObject.forEach((item) => {
//         if (item && typeof item == 'object' && Object.prototype.toString.call(item) == '[object Object]') {
//           resultObj.push(flatObject(item as Record<string, unknown>));
//         } else {
//           resultObj.push(item);
//         }
//       });
//       return resultObj;
//     } else {
//       let resultObj: Record<string, unknown> = {};
//       Object.keys(theObject).forEach((key) => {
//         if (key != '_id') {
//           if (
//             theObject[key] &&
//             typeof theObject[key] == 'object' &&
//             Object.prototype.toString.call(theObject[key]) == '[object Object]'
//           ) {
//             resultObj = {
//               ...resultObj,
//               ...flatObject(theObject[key] as Record<string, unknown>, prefix + key + '.'),
//             };
//           } else {
//             (resultObj as Record<string, unknown>)[prefix + key] = theObject[key];
//           }
//         }
//       });
//       return resultObj;
//     }
//   } else {
//     const errStr = `flatObject - problem with theObject, its value is: ${convertToString(theObject)}`;
//     consoleError(errStr);
//     throw new Error(errStr);
//   }
// }

// function objectToQueryParamsString(qp: { [key: string]: unknown }) {
//   let parsedQP = '';
//   Object.keys(qp).map((k) => {
//     parsedQP += (parsedQP ? '&' : '?') + k + '=' + convertToString(qp[k]);
//   });
//   return parsedQP;
// }

// function extractUserIpFromReq<P extends IParams>(req: ICustomRequest<P>): string {
//   return ((req.headers['x-forwarded-for'] || '') as string).split(',').pop() || req.socket.remoteAddress || ''; // https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node (req.connection was replaced by req.socket)
// }

// function intersectionOfArrays<T>(array1: T[], array2: T[]): T[] {
//   if (!array1 || !array2) {
//     return [];
//   } else {
//     return array1.filter((item: T) => array2.includes(item));
//   }
// }

// /** get the difference of array1 to array2,
//  * please be noted that this function will not return the difference of array2 against array1 */
// function differenceOfArrays<T>(array1: T[], array2: T[]): T[] {
//   return array1.filter((x) => !array2.includes(x));
// }

// function mergeAndRemoveDuplicates<T>(array1: T[], array2: T[]): T[] {
//   if (!array1 && !array2) {
//     return [];
//   } else if (!array1) {
//     return [...array2];
//   } else if (!array2) {
//     return [...array1];
//   } else {
//     return [...new Set([...array1, ...array2])];
//   }
// }

// function escapeRegExp(str: string): string {
//   return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

// function replaceAll(str: string, find: string, replace: string): string {
//   // Example:
//   // replaceAll("a.a.a.a", ".", "|")
//   // "a|a|a|a"
//   return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
// }

// // function convertArrayIntoObject(array: { [key: string]: object }[], idFieldName: string): object {
// //   const result: { [key: string]: object } = {};
// //   let counter: number = 0;
// //   let key: string;
// //   if (array && Array.isArray(array) && array.length) {
// //     array.forEach((item: { [key: string]: object }) => {
// //       key = item[idFieldName] ? item[idFieldName].toString() : counter.toString();
// //       counter++;
// //       result[key] = item;
// //     });
// //   }
// //   return result;
// // }

// function isNumeric(n: unknown): boolean {
//   return !isNaN(parseFloat('' + n)) && isFinite(Number(n));
// }

// function round(num: number, digitsAfterDecimalDot: number) {
//   let rounded = num;
//   if (isNumeric(num) && isNumeric(digitsAfterDecimalDot)) {
//     const _decAmount = digitsAfterDecimalDot >= 0 ? digitsAfterDecimalDot : 2;
//     const _multiplier = Math.pow(10, _decAmount);
//     const result = Math.round(num * _multiplier) / _multiplier;
//     rounded = result || 0; // For num=-0.00014 and _multiplier=100 -> the `result` equals -0 instead of 0
//   }

//   if (num != 0 && rounded == 0) {
//     rounded = trimPrecedingFloatZeros(num, digitsAfterDecimalDot);
//   }
//   return rounded;
// }

// function roundAndFormat(num: unknown, digitsAfterDecimalDot: number): string {
//   if (isNumeric(num) && isNumeric(digitsAfterDecimalDot)) {
//     const roundedNumber = round(parseFloat(String(num)), digitsAfterDecimalDot);
//     let result = '';
//     if (roundedNumber.toString().includes('.')) {
//       const numbersAfterDot = roundedNumber.toFixed(digitsAfterDecimalDot).split('.')[1];
//       const numbersBeforeDot = roundedNumber.toLocaleString().split('.')[0];
//       result = numbersBeforeDot + '.' + numbersAfterDot;
//     } else {
//       result = roundedNumber.toLocaleString();
//     }
//     return result;
//   } else {
//     return String(num);
//   }
// }

// /** Trim preceding zeros after floating point **/
// function trimPrecedingFloatZeros(num: number, digitsAfterDecimalDot: number) {
//   const zeroesPart = Array(digitsAfterDecimalDot - 1)
//     .fill('0')
//     .join('');
//   return Number(`${num}`.replace(new RegExp(`(?<=.)(${zeroesPart}(0+))+`, 'i'), zeroesPart));
// }

// function getFunctionUniqueName(file: string, theArguments?: IArguments) {
//   let calleeName = '';
//   try {
//     if (theArguments) {
//       calleeName = '-' + theArguments.callee.name;
//     }
//   } catch (e) {
//     // Do nothing.
//   }
//   return path.basename(file) + calleeName;
// }

// function genRand(min: number, max: number, decimalPlaces: number) {
//   const rand = Math.random() * (max - min) + min;
//   const power = Math.pow(10, decimalPlaces);
//   return Math.floor(rand * power) / power;
// }

// function genRandId_lettersAndNumbers(length: number) {
//   const allCharOptions = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += allCharOptions[genRand(0, allCharOptions.length, 0)];
//   }
//   return result;
// }

// function cartesianProduct(array: string[]) {
//   const results: string[][] = [[]];
//   for (const item of array) {
//     const copy = [...results];
//     for (const itemFromCopy of copy) {
//       results.push(itemFromCopy.concat(item));
//     }
//   }
//   return results.filter((item) => {
//     return item.length;
//   });
// }

// function tryParseJSON(jsonString: string) {
//   try {
//     const o = JSON.parse(jsonString);

//     // Handle non-exception-throwing cases:
//     // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
//     // but... JSON.parse(null) returns null, and typeof null === "object",
//     // so we must check for that, too. Thankfully, null is false, so this suffices:
//     if (o && typeof o === 'object') {
//       return o;
//     }
//   } catch (e) {
//     // Do nothing.
//   }

//   return false;
// }

function convertToString(value: unknown, shouldAddSpaceToJson = true): string {
  const isError = (obj: unknown) => {
    return Object.prototype.toString.call(obj) === '[object Error]';
    // return obj && obj.stack && obj.message && typeof obj.stack === 'string'
    //        && typeof obj.message === 'string';
  };

  try {
    switch (typeof value) {
      case 'string':
      case 'boolean':
      case 'number':
      default:
        return '' + value;

      case 'undefined':
        return '';

      case 'object':
        if (value == null) {
          return '';
        } else if (isError(value)) {
          const error1: Error = value as Error;
          return error1.stack || error1.message;
        } else if (value.constructor?.name === 'ObjectID' && typeof value.toString === 'function') {
          return String(value);
        } else if (value.constructor.name === 'IncomingMessage' && typeof value === 'object') {
          return ''; // convertRequestToString(value as ICustomRequest);
        } else {
          if (shouldAddSpaceToJson) {
            return ''; // json_stringify_safe(value, null, 2);
          } else {
            return ''; // json_stringify_safe(value);
          }
        }
    }
  } catch (e) {
    return '' + value;
  }
}

// function ip_to_num(matchText: number) {
//   return (
//     ((matchText >> 24) & 0xff) +
//     '.' +
//     ((matchText >> 16) & 0xff) +
//     '.' +
//     ((matchText >> 8) & 0xff) +
//     '.' +
//     (matchText & 0xff)
//   );
// }

// function getMyExternalIP(cb: (response: unknown) => void) {
//   setTimeout(() => {
//     superagent.get('http://ip-api.com/json').end((err1, res1) => {
//       try {
//         if (err1) consoleError('getMyExternalIP: ' + err1);
//         cb(JSON.parse(res1.text));
//       } catch (e) {
//         consoleError('getMyExternalIP: ' + convertToString(e));
//       }
//     });
//   });
// }

// function duplicateJson(srcJson: unknown) {
//   return JSON.parse(JSON.stringify(srcJson));
// }

function isReallyTrue(value: unknown): boolean {
  return Boolean(value) && value != '0' && (typeof value === 'string' ? value.toLowerCase() !== 'false' : true);
}

// function includesOneOfTheseValues(this: unknown, param1: unknown[], param2: unknown[]) {
//   let array1: unknown[];
//   let array2: unknown[];

//   if (param2) {
//     array1 = param1;
//     array2 = param2;
//   } else {
//     array1 = Array.isArray(this) ? this : [this];
//     array2 = param1;
//   }
//   // console.log('array1='+JSON.stringify(array1,null,2));
//   // console.log('array2='+JSON.stringify(array2,null,2));

//   return array1.some((item) => array2.includes(item));
// }

// function PromiseAll_throttled<T>(listOfCallableActions: (() => Promise<T>)[], limit: number) {
//   // See 'throttleActions' function in:
//   // https://stackoverflow.com/questions/38385419/throttle-amount-of-promises-open-at-a-given-time

//   // We'll need to store which is the next promise in the list.
//   let i = 0;
//   const resultArray: T[] = new Array(listOfCallableActions.length);

//   // Now define what happens when any of the actions completes. Javascript is
//   // (mostly) single-threaded, so only one completion handler will call at a
//   // given time. Because we return doNextAction, the Promise chain continues as
//   // long as there's an action left in the list.
//   function doNextAction(): Promise<void> {
//     if (i < listOfCallableActions.length) {
//       // Save the current value of i, so we can put the result in the right place
//       const actionIndex = i++;
//       const nextAction = listOfCallableActions[actionIndex];
//       return Promise.resolve(nextAction())
//         .then((result) => {
//           // Save results to the correct array index.
//           resultArray[actionIndex] = result;
//           return;
//         })
//         .then(doNextAction);
//     } else {
//       return Promise.resolve();
//     }
//   }

//   // Now start up the original <limit> number of promises.
//   // i advances in calls to doNextAction.
//   const listOfPromises: Array<Promise<void>> = [];
//   while (i < limit && i < listOfCallableActions.length) {
//     listOfPromises.push(doNextAction());
//   }
//   return Promise.all(listOfPromises).then(() => resultArray);
// }

// function isValidDate(date: unknown): boolean {
//   const fn = getFunctionUniqueName(__filename /*arguments*/) + '-isValidDate';
//   try {
//     // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date#answer-44198641
//     return (
//       Boolean(date) &&
//       Object.prototype.toString.call(date) === '[object Date]' &&
//       !isNaN(Number(date)) &&
//       !isNaN((date as Date).getTime())
//     );
//   } catch (e) {
//     consoleError(`${fn} - Error: ${convertToString(e)}. Returning 'false'.`);
//     return false;
//   }
// }

// function isRoundedHour(date: Date): boolean {
//   return date.getTime() == new Date(date).setUTCMinutes(0, 0, 0);
// }

// function beginningOfLastMonth(): Date {
//   return beginningOfAMonth(beginningOfAMonth(new Date()).getTime() - 1);
// }

// function beginningOfAMonth(date: Date | number): Date {
//   const _parsedDate: Date = new Date(date);
//   return new Date(Date.UTC(_parsedDate.getUTCFullYear(), _parsedDate.getUTCMonth(), 1));
// }

// function beginningOfThisMonth(): Date {
//   const today: Date = new Date();
//   return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
// }

// function endOfAMonth(date: Date): Date {
//   return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
// }

// function isBeginningOfAMonth(date: Date): boolean {
//   return beginningOfAMonth(date).getTime() === date.getTime();
// }

// function beginningOfADay(date: Date | number): Date {
//   const _parsedDate: Date = new Date(date);
//   const millisecondsInDate = _parsedDate.getTime();
//   const startOfThisDay_UTC = Math.floor(millisecondsInDate / DAY_IN_MILLISECOND) * DAY_IN_MILLISECOND;
//   return new Date(startOfThisDay_UTC);
// }

// function isBeginningOfADay(date: Date): boolean {
//   return beginningOfADay(date).getTime() === date.getTime();
// }

// function beginningOfAWeek(date: Date, doesWeekBeginOnMonday: boolean = true): Date {
//   const firstDayOfWeekIndex = doesWeekBeginOnMonday ? 1 : 0;
//   const dayOfWeek = date.getDay();
//   const firstDayOfWeek = new Date(date);
//   const diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek;

//   firstDayOfWeek.setDate(date.getDate() - diff);
//   firstDayOfWeek.setHours(0, 0, 0, 0);

//   return firstDayOfWeek;
// }

// function beginningOfLastWeek(date: Date, doesWeekBeginOnMonday: boolean = true): Date {
//   return new Date(beginningOfAWeek(date, doesWeekBeginOnMonday).getTime() - 7 * DAY_IN_MILLISECOND);
// }

// function endOfAWeek(date: Date, doesWeekBeginOnMonday: boolean = true): Date {
//   return new Date(beginningOfAWeek(date, doesWeekBeginOnMonday).getTime() + 7 * DAY_IN_MILLISECOND);
// }

// function isBeginningOfAYear(date: Date): boolean {
//   return date.toISOString().substring(4, 20) === '-01-01T00:00:00.000Z';
// }

// function isBeginningOfAWeek(date: Date): boolean {
//   return beginningOfAWeek(date).getTime() === date.getTime();
// }

// function beginningOfToday(): Date {
//   return beginningOfADay(Date.now());
// }

// function beginningOfTomorrow(): Date {
//   return new Date(beginningOfADay(Date.now()).getTime() + DAY_IN_MILLISECOND);
// }

// function endOfToday(): Date {
//   return beginningOfTomorrow();
// }

// function beginningOfYesterday(): Date {
//   const startOfYesterday_UTC = beginningOfToday().getTime() - DAY_IN_MILLISECOND;
//   return new Date(startOfYesterday_UTC);
// }

// function getListOfDatesInBetween(start: Date, end: Date, ignoreEndIfMidnight: boolean): string[] {
//   const result: Array<string> = [];
//   let realEndDate: Date;
//   if (ignoreEndIfMidnight && start.getTime() != end.getTime() && end.getTime() == beginningOfADay(end).getTime()) {
//     // Check if the time of 'end' is midnight. If yes - its date won't be returned, unless 'ignoreEndIfMidnight' is false.
//     realEndDate = beginningOfADay(new Date(end.getTime() - 1));
//   } else {
//     realEndDate = beginningOfADay(end);
//   }

//   for (
//     let i = beginningOfADay(start);
//     i.getTime() <= realEndDate.getTime();
//     i = new Date(i.getTime() + DAY_IN_MILLISECOND)
//   ) {
//     result.push(i.toISOString().slice(0, 10));
//   }
//   return result;
// }

// function createDeltaDate(
//   minutes: number,
//   hours: number,
//   days: number,
//   months: number,
//   years: number,
//   fromDate = new Date()
// ): Date {
//   const date = new Date(fromDate);
//   date.setUTCMinutes(date.getUTCMinutes() + minutes);
//   date.setUTCHours(date.getUTCHours() + hours);
//   date.setUTCDate(date.getUTCDate() + days);
//   date.setUTCMonth(date.getUTCMonth() + months);
//   date.setUTCFullYear(date.getUTCFullYear() + years);
//   return date;
// }

// function outputDateOnlyWithLeadingZeros(dateStr: string | Date | number): string {
//   const OCT = 9;
//   const tmpDate = new Date(dateStr);
//   const m = (tmpDate.getUTCMonth() >= OCT ? '' : '0') + (tmpDate.getUTCMonth() + 1);
//   const d = (tmpDate.getUTCDate() >= 10 ? '' : '0') + tmpDate.getUTCDate();
//   return tmpDate.getUTCFullYear() + '-' + m + '-' + d;
// }

// function convertBirthDateToAge(birthDate: string | Date | number): number {
//   const today = new Date();
//   const _birthDate = new Date(birthDate);
//   let age = today.getFullYear() - _birthDate.getFullYear();
//   const m = today.getMonth() - _birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < _birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// function createNewDirectory(directory: string) {
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory);
//   }
// }

// function removeAllFilesFromFolder(directory: string) {
//   fs.readdir(directory, (filesRemoveError, deleteFiles) => {
//     if (filesRemoveError) throw filesRemoveError;
//     for (const deleteFile of deleteFiles) {
//       fs.unlink(path.join(directory, deleteFile), (filesUnlinkError) => {
//         if (filesUnlinkError) throw filesUnlinkError;
//       });
//     }
//   });
// }

// function getLastUrlSegment(url: string) {
//   // filter(Boolean) use case => if '/' not present in url returns undefined
//   return new URL(url).pathname.split('/').filter(Boolean).pop();
// }

// export function validatePhoneNumber(value: string) {
//   const regexp = new RegExp(/^\+?(\d|-|\s|\(|\)|\[|\]|\.)*$/);
//   return regexp.test(value);
// }

// function isNumberLessThanZero(n: number) {
//   return n < 0;
// }

// /**
//  * Converts a Date object to a string containing only the date, with leading zeros whenever needed.
//  * If the Date is exactly on midnight UTC, then the previous date will be outputted.
//  *
//  * Examples:
//  *
//  * Date('2021-11-06T21:10:25.625Z') => '2021-11-06'
//  *
//  * Date('2021-11-06T00:00:00.000Z') => '2021-11-05'
//  *
//  * This is helpful in ranges, for example this range:
//  *
//  * Date('2021-11-06T00:00:00.000Z') - Date('2021-11-08T00:00:00.000Z')
//  *
//  * Is outputted like this, if this function is used (only) on the end date:
//  *
//  * '2021-11-06' - '2021-11-07'
//  *
//  * which is the right way to display it.
//  *
//  * @param endDate The timestamp
//  * @returns A string in the following format: "2000-12-31"
//  */
// function convertEndTimestampToEndDate(endDate: Date): string {
//   if (isValidDate(endDate)) {
//     const beginningOfTheDay = new Date(endDate.toISOString().substring(0, 10));
//     let resultString = endDate;
//     if (beginningOfTheDay.getTime() == endDate.getTime()) {
//       resultString = new Date(endDate.getTime() - DAY_IN_MILLISECOND);
//     }
//     return outputDateOnlyWithLeadingZeros(resultString);
//   } else {
//     throw new Error(`endDate is not a valid date: ${endDate}!`);
//   }
// }

// function isValidEmail(address: unknown) {
//   const parsedAddress = convertToString(address);
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(parsedAddress);
// }

// function throwIfNotOverridden(): void {
//   throw new Error('Function must be overridden!');
// }

// function isProd(): boolean {
//   return process.env.NODE_ENV == ENVIRONMENTS.PRODUCTION;
// }

// function isDevEnvironment(): boolean {
//   return process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT || !process.env.NODE_ENV;
// }

// function toSafeNumberOrNull(val: unknown): number | null {
//   return val === '' || typeof val === 'undefined' ? null : Number(val) || 0;
// }

// function toSafeDateOrNull(val: unknown): Date | null {
//   return val === '' || typeof val !== 'string' ? null : new Date(val.split('/').reverse().join('/'));
// }

// function minimumDate(date1: Date, date2: Date) {
//   if (date1 && date2) {
//     if (date1 > date2) {
//       return date2;
//     }
//     return date1;
//   } else if (date1 && !date2) {
//     return date1;
//   } else {
//     return date2;
//   }
// }

// function sortQueryObject<P extends IParams>(req: ICustomRequest<P>) {
//   const orderBy: Record<string, unknown> = {};
//   if (req.query.sortBy) {
//     const column = String(req.query.sortBy);
//     const direction = String(req.query.sortDirection) || 'ASC';
//     orderBy[column] = direction;
//   }
//   return orderBy;
// }

// function getCurrentIsraelDate() {
//   const LOCALE = 'en-US';
//   const TIME_ZONE = 'Asia/Tel_Aviv';
//   const currentIsraelDateString = new Date().toLocaleDateString(LOCALE, { timeZone: TIME_ZONE });
//   const splitArrayOfCurrentIsraelDateString = currentIsraelDateString.split('/');
//   return {
//     day: Number(splitArrayOfCurrentIsraelDateString[1]),
//     month: Number(splitArrayOfCurrentIsraelDateString[0]),
//     year: Number(splitArrayOfCurrentIsraelDateString[2]),
//     currentIsraelDateString,
//   };
// }

// function areArraysEqual(array1: Array<unknown>, array2: Array<unknown>) {
//   if (array1.length !== array2.length) return false;
//   if (!array1.every((element) => array2.includes(element))) return false;
//   if (!array2.every((element) => array1.includes(element))) return false;
//   return true;
// }

// function commaSeparatedArrayHandler(commaSeparatedString: string): Array<string> {
//   return commaSeparatedString.split(',');
// }
// export function isArrayAndHaveElements(unknown: unknown): boolean {
//   return Array.isArray(unknown) && Boolean(unknown.length);
// }

export default {
  consoleError,
//   consoleTemporarilyIgnoreError,
//   consoleKnownError,
  consoleLog,
//   consoleDebug,
  assertEnvParams,
//   sleepPromise,
//   getFullUrlFromReqObj,
//   convertRequestToString,
//   // addGetterToClass,
//   runCLI,
//   flatObject,
//   objectToQueryParamsString,
//   extractUserIpFromReq,
//   intersectionOfArrays,
//   differenceOfArrays,
//   mergeAndRemoveDuplicates,
//   replaceAll,
//   // convertArrayIntoObject,
//   isNumeric,
//   round,
//   roundAndFormat,
//   trimPrecedingFloatZeros,
//   getFunctionUniqueName,
//   genRand,
//   genRandId_lettersAndNumbers,
//   cartesianProduct,
//   tryParseJSON,
//   convertToString,
//   ip_to_num,
//   getMyExternalIP,
//   duplicateJson,
  isReallyTrue,
//   includesOneOfTheseValues,
//   PromiseAll_throttled,
//   isValidEmail,
//   throwIfNotOverridden,
//   isProd,
//   isDevEnvironment,
  consoleErrorAndThrow,
//   createNewDirectory,
//   removeAllFilesFromFolder,
//   toSafeNumberOrNull,
//   toSafeDateOrNull,
//   getLastUrlSegment,
//   validatePhoneNumber,
//   sortQueryObject,
//   areArraysEqual,
//   isNumberLessThanZero,
//   commaSeparatedArrayHandler,
//   isArrayAndHaveElements,
//   date: {
//     isRoundedHour,

//     isBeginningOfADay,
//     beginningOfADay,
//     beginningOfYesterday,
//     beginningOfToday,
//     beginningOfTomorrow,
//     endOfToday,

//     isBeginningOfAWeek,
//     beginningOfAWeek,
//     beginningOfLastWeek,
//     endOfAWeek,

//     isBeginningOfAMonth,
//     beginningOfAMonth,
//     beginningOfLastMonth,
//     beginningOfThisMonth,
//     endOfAMonth,

//     isBeginningOfAYear,

//     isValidDate,
//     getListOfDatesInBetween,
//     getCurrentIsraelDate,
//     createDeltaDate,
//     outputDateOnlyWithLeadingZeros,
//     convertBirthDateToAge,
//     convertEndTimestampToEndDate,
//     minimumDate,
//     MINUTE_IN_MILLISECOND,
//     HOUR_IN_MILLISECOND,
//     DAY_IN_MILLISECOND,
//   },
};
