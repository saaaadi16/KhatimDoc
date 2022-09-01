export const tempAppSet = (Var: number = 1) => {
  sessionStorage.setItem("App", JSON.stringify(Var));
  tempAppGet();
};

export const tempAppGet = (): number => {
  let temp = sessionStorage.getItem("App");
  return Number(temp);
};

export const TempPackSet = (Var: number = 0) => {
  sessionStorage.setItem("PackageState", JSON.stringify(Var));
  TempPackGet();
};

export const TempPackGet = (): number => {
  let temp = sessionStorage.getItem("PackageState");
  return Number(temp);
};

export const tempSettingsSet = (Var1: number = 0) => {
  sessionStorage.setItem("Sett", JSON.stringify(Var1));
};

export const tempSettingsGet = () => {
  let temp = sessionStorage.getItem("Sett");

  if (temp) return Number(temp);

  // sessionStorage.setItem("Sett", "0");
  return 0;
};

export const clearApp = () => {
  sessionStorage.removeItem("App");
  sessionStorage.removeItem("PackageState");
  sessionStorage.removeItem("Sett");
};

export const clearPack = () => {
  sessionStorage.removeItem("PackageState");
};

export const clearSett = () => {
  sessionStorage.removeItem("Sett");
};

export const base64ToB = (base64: any) => {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
};

export const Download = (reportName: string, byte: any) => {
  var blob = new Blob([byte], {
    type: "application/zip",
  });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = `${fileName}`;
  link.click();
};
