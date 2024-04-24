function assertEnvParams(envParamsToCheck: string | Array<string>) {
  const missingEnvParams: Array<string> = [];
  envParamsToCheck = Array.isArray(envParamsToCheck) ? envParamsToCheck : [envParamsToCheck];
  envParamsToCheck.forEach((param) => {
    if (!process.env[param]) {
      missingEnvParams.push(param);
    }
  });
  if (missingEnvParams.length) {
    const errStr = `\n\nThe following environment param${
      1 < missingEnvParams.length ? 's are' : ' is'
    } missing: ${missingEnvParams.join(', ')}\n\n`;
    console.error(errStr);
    throw new Error(errStr);
  }
}

function isReallyTrue(value: unknown): boolean {
  return Boolean(value) && value != '0' && (typeof value === 'string' ? value.toLowerCase() !== 'false' : true);
}

export default {
  assertEnvParams,
  isReallyTrue,
};
