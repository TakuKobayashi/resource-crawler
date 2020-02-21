export async function sleep(waitMilliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, waitMilliseconds);
  });
}

export function tryParseJSON(text: string, isRecordErrorLog: boolean = false): any {
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (error) {
    if (isRecordErrorLog) {
      console.log(error);
    }
  }
  return json;
}
