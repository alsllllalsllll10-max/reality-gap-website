const REPO_OWNER = 'alsllllalsllll10-max'
const REPO_NAME = 'reality-gap-website'
const ENCRYPTED_TOKEN = 'V19YPidLCV4xM11mdSJ9REUWXx86KgIMCFVGWF5RVlcnJFwoAi19WA=='

export function unlockToken(password: string): string | null {
  if (password !== '077alsomry077m') return null
  try {
    const pwd = password
    const encrypted = atob(ENCRYPTED_TOKEN)
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ pwd.charCodeAt(i % pwd.length))
    }
    return decrypted
  } catch {
    return null
  }
}

async function getFileSha(path: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
      headers: { Authorization: `token ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      return data.sha
    }
  } catch (e) { }
  return null
}

export async function uploadToGithub(
  path: string, 
  contentBase64: string, 
  commitMessage: string, 
  token: string
): Promise<boolean> {
  const sha = await getFileSha(path, token)
  const body = {
    message: commitMessage,
    content: contentBase64,
    branch: 'main',
    ...(sha ? { sha } : {})
  }

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return res.ok
}

// Convert a Blob to Base64 (excluding the data URI prefix)
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
