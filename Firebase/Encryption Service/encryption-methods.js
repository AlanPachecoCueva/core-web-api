const path = require("path");
const { KeyManagementServiceClient } = require("@google-cloud/kms");

function instanceClient() {
  const client = new KeyManagementServiceClient({
    keyFilename: path.join(
      __dirname,
      "../../application_default_credentials.json"
    ),
  });

  console.log("client: ", client);
  const projectId = process.env.GOOGLE_PROJECT_ID; //Este id es del proyecto "Desarrollo Software Seguro"
  const locationId = process.env.GOOGLE_KEY_RING_LOCATION_ID;
  const keyRingId = process.env.GOOGLE_KEY_RING_ID;
  const keyId = process.env.GOOGLE_KEY_ID;
  console.log("projectId: ", process.env.GOOGLE_PROJECT_ID);
  console.log("projectId: ", projectId);
  console.log("locationId: ", locationId);
  console.log("keyRingId: ", keyRingId);
  console.log("keyId: ", keyId);
  const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);
  return { keyName, client };
}

async function encryptText(plaintext) {
  try {
    const { keyName, client } = instanceClient();
    const buffer = Buffer.from(plaintext, "utf8");

    const [result] = await client.encrypt({ name: keyName, plaintext: buffer });
    console.log(`Texto encriptado: ${result.ciphertext.toString("hex")}`);
    return result.ciphertext.toString("hex");
  } catch (error) {
    console.error(`Failed to encrypt text: ${error}`);
  }
}

async function decryptText(encryptedMessage) {
  // try {
  const { keyName, client } = instanceClient();
  console.log("HOLA    1");

  console.log("encryptedMessage: ", encryptedMessage);
  const ciphertextBuffer = Buffer.from(encryptedMessage, "hex");
  console.log("ciphertextBuffer: ", ciphertextBuffer);
  const [decryptResult] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertextBuffer,
  });
  console.log("decryptResult: ", decryptResult);
  const decryptedMessage = decryptResult.plaintext.toString("utf8");
  console.log(`Texto desencriptado: ${decryptedMessage}`);
  return decryptedMessage;
  // } catch (error) {
  //   console.error(`Failed to decrypt text: ${error}`);
  //   return encryptedMessage;
  // }
}

module.exports = { encryptText, decryptText };
