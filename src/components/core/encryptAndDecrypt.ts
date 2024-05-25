export const encryptContent = async (key: string, plainText: string) => {
  const keyEncoded = new TextEncoder().encode(key)
  const iv = new Uint8Array(16)
  iv.set(keyEncoded)
  const key_encoded = await window.crypto.subtle.importKey('raw', iv.buffer, 'AES-CTR', false, [
    'encrypt',
    'decrypt'
  ])
  const enc = new TextEncoder()
  return window.crypto.subtle.encrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128
    },
    key_encoded,
    enc.encode(plainText)
  )
}

export const decryptContent = async (key: string, ciphertext: ArrayBuffer) => {
  const keyEncoded = new TextEncoder().encode(key)
  const iv = new Uint8Array(16)
  iv.set(keyEncoded)
  const key_encoded = await window.crypto.subtle.importKey('raw', iv.buffer, 'AES-CTR', false, [
    'encrypt',
    'decrypt'
  ])
  // The iv value is the same as that used for encryption
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-CTR', counter: iv, length: 128 },
    key_encoded,
    ciphertext
  )
  const enc = new TextDecoder('utf-8')
  return enc.decode(decrypted)
}
